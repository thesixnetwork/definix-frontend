import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import moment from 'moment'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Color from 'color'
import { BackIcon, Box, Button, Card, Flex, Tabs, Text, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useTheme from 'hooks/useTheme'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import { Rebalance } from '../../state/types'

import FundAction from './components/FundAction'
import Performance from './components/Performance'
import Overview from './components/Overview'
import Transaction from './components/Transaction'
import SummaryCard, { SummaryItem } from './components/SummaryCard'

interface ExploreDetailType {
  rebalance: Rebalance | any
}

const modder = {
  '1D': 300000,
  '1W': 600000,
  '1M': 3600000,
  '3M': 3600000,
  ALL: 3600000,
}

const formatter = {
  '1D': 'HH:mm',
  '1W': 'DD MMM HH:mm',
  '1M': 'DD MMM HH:mm',
  '3M': 'DD MMM HH:mm',
  ALL: 'DD MMM HH:mm',
}

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const ExploreDetail: React.FC<ExploreDetailType> = ({ rebalance: rawData }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('1D')
  const [returnPercent, setReturnPercent] = useState(0)
  const [maxDrawDown, setMaxDrawDown] = useState(0)
  const [updatedDate, setUpdatedDate] = useState(' ')
  const [graphData, setGraphData] = useState({})
  const { isDark } = useTheme()
  const { isMaxXl } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { account } = useWallet()
  const { t } = useTranslation()
  const tabs = useMemo(() => {
    return [
      {
        id: 'overview',
        name: t('Overview'),
      },
      {
        id: 'performance',
        name: t('Performance'),
      },
      {
        id: 'transaction',
        name: t('Transaction'),
      },
    ]
  }, [t])
  const [curTab, setCurTab] = useState<string>(tabs[0].id)
  // for adjust color
  const rebalance = useMemo(() => {
    if (!rawData?.ratio) return rawData
    const ratio = rawData?.ratio.map((coin) => {
      const colorObj = Color(coin.color)
      const color = ((dark, c) => {
        const hex = c.hex()
        if (dark) {
          return hex === '#000000' ? c.lighten(0.1).hex() : hex
        }
        return hex === '#FFFFFF' ? c.darken(0.1).hex() : hex
      })(isDark, colorObj)
      return { ...coin, color }
    })
    return { ...rawData, ratio }
  }, [rawData, isDark])
  const prevRebalance = usePrevious(rebalance, {})
  const prevTimeframe = usePrevious(timeframe, '')
  const [periodPriceTokens, setPeriodPriceTokens] = useState([])

  const [sharpRatio, setSharpRatio] = useState(0)

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    setUpdatedDate(format(new Date(), 'MMM dd, yyyy HH:mm:ss (O)'))
  }, [rebalance])

  const fetchMaxDrawDownFromGraph = useCallback(async () => {
    if (!_.isEqual(rebalance, prevRebalance) || !_.isEqual(timeframe, prevTimeframe)) {
      if (rebalance && rebalance.address) {
        setIsLoading(true)
        const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
        try {
          const fundGraphResp = await axios.get(
            `${fundGraphAPI}?rebalance_address=${getAddress(rebalance.address)}&timeframe=ALL`,
          )
          const fundGraphResult = _.get(fundGraphResp, 'data.result', [])
          const label = []
          const rebalanceData = {
            name: 'Rebalance',
            values: [],
          }
          const ALL = 'ALL'
          const base: Record<string, any> = {}
          fundGraphResult.forEach((data) => {
            const allCurrentTokens = _.compact([
              ...((rebalance || {}).tokens || []),
              ...((rebalance || {}).usdToken || []),
            ])
            const timestampLabel = moment(data.timestamp * 1000 - ((data.timestamp * 1000) % modder[ALL])).format(
              formatter[ALL],
            )
            label.push(timestampLabel)
            let dataValues = _.get(data, 'values', [])
            let sumUsd = 0
            for (let i = 0; i <= (dataValues.length - 1) / 2; i++) {
              const currentIndex = i + 1
              const currentLoopToken = allCurrentTokens[i]

              const currentLoopValue = new BigNumber(
                dataValues[currentIndex + (dataValues.length - 1) / 2] || '1',
              ).times(
                new BigNumber(dataValues[currentIndex]).div(
                  new BigNumber(10).pow(_.get(currentLoopToken, 'decimals', 18)),
                ),
              )
              sumUsd += currentLoopValue.toNumber()
            }
            if (!base.rebalance) {
              base.rebalance = sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber()
            }

            rebalanceData.values.push(
              new BigNumber(sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber())
                .div(new BigNumber(base.rebalance as number))
                .times(100)
                .toNumber(),
            )

            dataValues = dataValues.splice(allCurrentTokens.length + 1)
          })
          let maxValue = new BigNumber(0)
          let maxDrawDownPercent = new BigNumber(0)

          // let maxDrawDownValue;
          for (let index = 0; index < rebalanceData.values.length; index++) {
            const value = new BigNumber(rebalanceData.values[index])
            if (value.isLessThan(maxValue)) {
              const drawDown = maxValue.minus(value).dividedBy(maxValue).multipliedBy(100)
              if (drawDown.isGreaterThan(maxDrawDownPercent)) {
                maxDrawDownPercent = drawDown

                // maxDrawDownValue = value;
              }
            }
            if (value.isGreaterThan(maxValue)) {
              // reset max value
              maxValue = value
            }
          }
          setMaxDrawDown(maxDrawDownPercent.toNumber())
          // setReturnPercent(rebalanceData.values[rebalanceData.values.length - 1] - rebalanceData.values[0])
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }
  }, [rebalance, timeframe, prevRebalance, prevTimeframe])

  const fetchReturnData = useCallback(async () => {
    if (!_.isEqual(rebalance, prevRebalance) || !_.isEqual(timeframe, prevTimeframe)) {
      if (rebalance && rebalance.address) {
        setIsLoading(true)
        const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
        try {
          const fundGraphResp = await axios.get(
            `${fundGraphAPI}?rebalance_address=${getAddress(rebalance.address)}&timeframe=${timeframe}`,
          )
          const fundGraphResult = _.get(fundGraphResp, 'data.result', [])
          if (timeframe === '1D') {
            const tokens = _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])
            const oldPrice = []
            for (let i = 1; i <= tokens.length; i++) {
              oldPrice.push(fundGraphResult[0].values[i + tokens.length])
            }
            setPeriodPriceTokens(oldPrice)
          }

          const label = []
          const rebalanceData = {
            name: 'Rebalance',
            values: [],
          }
          const base: Record<string, any> = {}
          fundGraphResult.forEach((data) => {
            const allCurrentTokens = _.compact([
              ...((rebalance || {}).tokens || []),
              ...((rebalance || {}).usdToken || []),
            ])
            const timestampLabel = moment(data.timestamp * 1000 - ((data.timestamp * 1000) % modder[timeframe])).format(
              formatter[timeframe],
            )
            label.push(timestampLabel)
            let dataValues = _.get(data, 'values', [])
            let sumUsd = 0
            for (let i = 0; i <= (dataValues.length - 1) / 2; i++) {
              const currentIndex = i + 1
              const currentLoopToken = allCurrentTokens[i]

              const currentLoopValue = new BigNumber(
                dataValues[currentIndex + (dataValues.length - 1) / 2] || '1',
              ).times(
                new BigNumber(dataValues[currentIndex]).div(
                  new BigNumber(10).pow(_.get(currentLoopToken, 'decimals', 18)),
                ),
              )
              sumUsd += currentLoopValue.toNumber()
            }
            if (!base.rebalance) {
              base.rebalance = sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber()
            }

            rebalanceData.values.push(
              new BigNumber(sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber())
                .div(new BigNumber(base.rebalance as number))
                .times(100)
                .toNumber(),
            )

            dataValues = dataValues.splice(allCurrentTokens.length + 1)
          })
          setReturnPercent(rebalanceData.values[rebalanceData.values.length - 1] - rebalanceData.values[0])
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }
  }, [rebalance, timeframe, prevRebalance, prevTimeframe])

  const fetchNormalizeGraphData = useCallback(async () => {
    if (!_.isEqual(rebalance, prevRebalance) || !_.isEqual(timeframe, prevTimeframe)) {
      if (rebalance && rebalance.address) {
        setIsLoading(true)
        const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
        try {
          const fundGraphResp = await axios.get(
            `${fundGraphAPI}?rebalance_address=${getAddress(rebalance.address)}&timeframe=${timeframe}`,
          )
          const fundGraphResult = _.get(fundGraphResp, 'data.result', [])

          const label = []
          const rebalanceData = {
            name: rebalance.title,
            isRebalance: true,
            values: [],
            valuesPrice: [],
          }
          const sharePricesFromGraph = []
          const graphTokenData: Record<string, any> = {}
          const base: Record<string, any> = {}

          fundGraphResult.forEach((data) => {
            const allCurrentTokens = _.compact([
              ...((rebalance || {}).tokens || []),
              ...((rebalance || {}).usdToken || []),
            ])
            const timestampLabel = moment(data.timestamp * 1000 - ((data.timestamp * 1000) % modder[timeframe])).format(
              formatter[timeframe],
            )
            label.push(timestampLabel)
            let dataValues = _.get(data, 'values', [])
            let sumUsd = 0
            for (let i = 0; i <= (dataValues.length - 1) / 2; i++) {
              const currentIndex = i + 1
              const currentLoopToken = allCurrentTokens[i]
              const currentLoopValue = new BigNumber(
                dataValues[currentIndex + (dataValues.length - 1) / 2] || '1',
              ).times(
                new BigNumber(dataValues[currentIndex]).div(
                  new BigNumber(10).pow(_.get(currentLoopToken, 'decimals', 18)),
                ),
              )
              sumUsd += currentLoopValue.toNumber()
            }
            if (!base.rebalance) {
              base.rebalance = sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber()
            }
            rebalanceData.values.push(
              new BigNumber(sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber())
                .div(new BigNumber(base.rebalance as number))
                .times(100)
                .toNumber(),
            )
            rebalanceData.valuesPrice.push(
              sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber(),
            )

            // cal sharePrice
            const dataPoint = dataValues
            let _totalSupply = new BigNumber(dataPoint[0])
            _totalSupply = _totalSupply.dividedBy(10 ** 18)
            let totalUSD = new BigNumber(0)
            for (let j = 1; j < allCurrentTokens.length + 1; j++) {
              let balance = new BigNumber(dataPoint[j])
              balance = balance.dividedBy(10 ** allCurrentTokens[j - 1].decimals)

              let price = new BigNumber(0)
              if (j < allCurrentTokens.length) {
                price = new BigNumber(dataPoint[j + allCurrentTokens.length])
              } else {
                price = new BigNumber(1)
              }
              totalUSD = totalUSD.plus(balance.multipliedBy(price))
            }
            const sharePrice = totalUSD.dividedBy(_totalSupply)

            sharePricesFromGraph.push(sharePrice)

            dataValues = dataValues.splice(allCurrentTokens.length + 1)
            allCurrentTokens.forEach((token, index) => {
              if (!base[token.symbol]) {
                base[token.symbol] = dataValues[index]
              }
              if (!graphTokenData[token.symbol]) {
                const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)
                if (ratioObject) {
                  graphTokenData[token.symbol] = {
                    name: token.symbol,
                    values: [],
                    valuesPrice: [],
                    color: ratioObject.color,
                  }
                }
              }
              if (graphTokenData[token.symbol]) {
                graphTokenData[token.symbol].valuesPrice.push(dataValues[index])
                graphTokenData[token.symbol].values.push(
                  new BigNumber(dataValues[index])
                    .div(base[token.symbol] as number)
                    .times(100)
                    .toNumber(),
                )
              }
            })
          })
          graphTokenData.rebalance = rebalanceData
          const getSharpeRatio = (values, backPoint) => {
            const returns = values.map((value, index) =>
              index === 0
                ? new BigNumber(0)
                : value
                    .dividedBy(values[index - 1])
                    .minus(1)
                    .multipliedBy(100),
            )
            const sliceReturns = returns.slice(-1 * backPoint)
            const sum = sliceReturns.reduce((previous, current) => previous.plus(current), new BigNumber(0))
            const avg = sum.dividedBy(sliceReturns.length) || 0
            const std = sliceReturns
              .map((value) => value.minus(avg).exponentiatedBy(2))
              .reduce((previous, current) => previous.plus(current), new BigNumber(0))
              .dividedBy(sliceReturns.length - 1)
              .squareRoot()
            return avg.dividedBy(std)
          }

          setSharpRatio(getSharpeRatio(sharePricesFromGraph, sharePricesFromGraph.length))
          setGraphData({ labels: label, graph: graphTokenData })
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }
  }, [rebalance, timeframe, prevRebalance, prevTimeframe])

  const fetchMaxDrawDown = useCallback(async () => {
    if (!_.isEqual(rebalance, prevRebalance) || !_.isEqual(timeframe, prevTimeframe)) {
      if (rebalance && rebalance.address) {
        setIsLoading(true)
        const maxDrawDownAPI = process.env.REACT_APP_DEFINIX_MAX_DRAWDOWN_API
        try {
          const maxDrawDownResp = await axios.get(`${maxDrawDownAPI}?pool=${getAddress(rebalance.address)}`)
          const currentDrawdown = _.get(maxDrawDownResp, 'data.result.current_drawdown', [])
          setMaxDrawDown(currentDrawdown)
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }
  }, [rebalance, timeframe, prevRebalance, prevTimeframe])

  useEffect(() => {
    fetchReturnData()
    fetchMaxDrawDownFromGraph()
    fetchNormalizeGraphData()
  }, [fetchNormalizeGraphData, fetchReturnData, fetchMaxDrawDownFromGraph])

  useEffect(() => {
    fetchMaxDrawDown()
  }, [fetchMaxDrawDown])

  if (!rebalance) return <Redirect to="/rebalancing" />

  return (
    <>
      <Box pb="S_32">
        <div>
          <Flex mb={isMaxXl ? 'S_2' : '10px'}>
            <Button
              variant="text"
              as={Link}
              to="/rebalancing"
              height="24px"
              p="0"
              startIcon={<BackIcon color="textSubtle" />}
            >
              <Text textStyle="R_16R" color="textSubtle">
                {t('Back')}
              </Text>
            </Button>
          </Flex>
          <Text textStyle="R_12R" color="textSubtle" textAlign="right" mb={isMaxXl ? 'S_8' : 'S_12'}>
            {updatedDate}
          </Text>

          <SummaryCard
            rebalance={rebalance}
            isMobile={isMaxXl}
            items={[
              SummaryItem.TOTAL_ASSET_VALUE,
              SummaryItem.YIELD_APR,
              SummaryItem.SHARE_PRICE_W_YIELD,
              SummaryItem.RISK_O_METER,
            ]}
          />

          <Card>
            <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} {...(isMaxXl && { small: true, equal: true })} />
            {curTab === tabs[0].id && <Overview rebalance={rebalance} periodPriceTokens={periodPriceTokens} />}
            {curTab === tabs[1].id && (
              <Performance
                rebalance={rebalance}
                isLoading={isLoading}
                returnPercent={returnPercent}
                graphData={graphData}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                maxDrawDown={maxDrawDown}
                sharpRatio={sharpRatio}
              />
            )}
            {curTab === tabs[2].id && <Transaction rbAddress={rebalance.address} />}
          </Card>
        </div>

        <FundAction rebalance={rebalance} isMobile={isMaxXl} />
      </Box>
    </>
  )
}

export default ExploreDetail
