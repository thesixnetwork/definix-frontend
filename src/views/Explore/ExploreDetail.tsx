import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import numeral from 'numeral'
import Color from 'color'
import {
  BackIcon,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  TabBox,
  Text,
  useMatchBreakpoints,
  VDivider,
} from 'definixswap-uikit'

import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useTheme from 'hooks/useTheme'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'react-i18next'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import { usePriceFinixUsd } from '../../state/hooks'
import { Rebalance } from '../../state/types'
import { TypeChartName } from './components/SelectChart'

import CardHeading from './components/CardHeading'
import FundAction from './components/FundAction'
import Transaction from './components/Transaction'
import TwoLineFormat from './components/TwoLineFormat'
import Overview from './components/Overview'
import Performance from './components/Performance'

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
  const [chartName, setChartName] = useState<TypeChartName>('Normalize')
  const [returnPercent, setReturnPercent] = useState(0)
  const [maxDrawDown, setMaxDrawDown] = useState(0)
  const [graphData, setGraphData] = useState({})
  const { isDark } = useTheme()
  const { isMaxXl } = useMatchBreakpoints()
  const finixPrice = usePriceFinixUsd()
  const dispatch = useDispatch()
  const { account } = useWallet()
  const { t } = useTranslation()
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

  const fetchMaxDrawDown = useCallback(async () => {
    if (
      !_.isEqual(rebalance, prevRebalance) ||
      !_.isEqual(timeframe, prevTimeframe) ||
      !_.isEqual(chartName, undefined)
    ) {
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
  }, [rebalance, timeframe, prevRebalance, prevTimeframe, chartName])

  const fetchReturnData = useCallback(async () => {
    if (
      !_.isEqual(rebalance, prevRebalance) ||
      !_.isEqual(timeframe, prevTimeframe) ||
      !_.isEqual(chartName, undefined)
    ) {
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
  }, [rebalance, timeframe, prevRebalance, prevTimeframe, chartName])

  const fetchNormalizeGraphData = useCallback(async () => {
    if (!_.isEqual(rebalance, prevRebalance) || !_.isEqual(timeframe, prevTimeframe) || chartName === 'Normalize') {
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
            name: 'Rebalance',
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
          setGraphData({ labels: label, graph: graphTokenData, chartName })
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }
  }, [rebalance, timeframe, prevRebalance, prevTimeframe, chartName])

  const fetchPriceGraphData = useCallback(async () => {
    if (!_.isEqual(rebalance, prevRebalance) || !_.isEqual(timeframe, prevTimeframe) || chartName === 'Price') {
      if (rebalance && rebalance.address) {
        setIsLoading(true)
        const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
        const maxDrawDownAPI = process.env.REACT_APP_DEFINIX_MAX_DRAWDOWN_API
        try {
          const maxDrawDownResp = await axios.get(`${maxDrawDownAPI}?pool=${getAddress(rebalance.address)}`)
          const fundGraphResp = await axios.get(
            `${fundGraphAPI}?rebalance_address=${getAddress(rebalance.address)}&timeframe=${timeframe}`,
          )
          const fundGraphResult = _.get(fundGraphResp, 'data.result', [])
          const currentDrawdown = _.get(maxDrawDownResp, 'data.result.current_drawdown', [])
          const label = []
          const rebalanceData = {
            name: 'Rebalance',
            values: [],
            valuesPrice: [],
          }
          const sharePricesFromGraph = []
          const graphTokenData: Record<string, any> = {}
          const base: Record<string, any> = {}
          // find min max between
          const allCurrentTokens = _.compact([
            ...((rebalance || {}).tokens || []),
            ...((rebalance || {}).usdToken || []),
          ])

          const priceTokens = []
          for (let index = 0; index < allCurrentTokens.length; index++) {
            priceTokens.push([])
          }
          fundGraphResult.forEach((data) => {
            const dataPoint = _.get(data, 'values', [])
            for (let j = 0; j < allCurrentTokens.length; j++) {
              if (j < allCurrentTokens.length) {
                priceTokens[j].push(dataPoint[j + 1 + allCurrentTokens.length])
              } else {
                priceTokens[j].push(1)
              }
            }
          })
          const calToken = []
          allCurrentTokens.forEach((token, index) => {
            const min: number = _.min(priceTokens[index])
            const max: number = _.max(priceTokens[index])
            calToken.push({
              min,
              max,
              between: (max - min) / 60,
            })
          })
          const sharePrices = []
          fundGraphResult.forEach((data) => {
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
            sharePrices.push(sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber())
            rebalanceData.values.push(
              new BigNumber(sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber())
                .div(new BigNumber(base.rebalance as number))
                .times(100)
                .toNumber(),
            )
            // rebalanceData.values.push(sumUsd)

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
            // cal sharePrice end

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
                if (token.symbol === 'KUSDT') {
                  graphTokenData[token.symbol].values.push(50)
                  graphTokenData[token.symbol].valuesPrice.push(1)
                } else {
                  graphTokenData[token.symbol].values.push(
                    new BigNumber(dataValues[index]).minus(calToken[index].min).div(calToken[index].between).plus(20),
                  )
                  graphTokenData[token.symbol].valuesPrice.push(dataValues[index])
                }
              }
            })
          })
          const rebalanceMin = _.min(rebalanceData.values)
          const rebalanceMax = _.max(rebalanceData.values)
          const rebalanceBetween = (rebalanceMax - rebalanceMin) / 60

          const valuesRebalanceCalculate = []
          const valuesPriceRebalanceCalculate = []
          rebalanceData.values.forEach((val, index) => {
            valuesRebalanceCalculate.push((val - rebalanceMin) / rebalanceBetween + 20)
            valuesPriceRebalanceCalculate.push(sharePrices[index])
          })
          rebalanceData.values = valuesRebalanceCalculate
          rebalanceData.valuesPrice = valuesPriceRebalanceCalculate

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
          setMaxDrawDown(currentDrawdown)
          setSharpRatio(getSharpeRatio(sharePricesFromGraph, sharePricesFromGraph.length))
          setGraphData({ labels: label, graph: graphTokenData, chartName })
          // eslint-disable-next-line
          // debugger
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }
  }, [rebalance, timeframe, prevRebalance, prevTimeframe, chartName])
  useEffect(() => {
    fetchReturnData()
    fetchMaxDrawDown()
    if (chartName === 'Price') {
      fetchPriceGraphData()
    } else {
      fetchNormalizeGraphData()
    }
  }, [fetchPriceGraphData, fetchNormalizeGraphData, fetchReturnData, chartName, fetchMaxDrawDown])

  if (!rebalance) return <Redirect to="/rebalancing" />

  const tabs = [
    {
      name: t('Overview'),
      component: <Overview rebalance={rebalance} periodPriceTokens={periodPriceTokens} />,
    },
    {
      name: t('Performance'),
      component: (
        <Performance
          rebalance={rebalance}
          isLoading={isLoading}
          returnPercent={returnPercent}
          graphData={graphData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          chartName={chartName}
          maxDrawDown={maxDrawDown}
          setChartName={setChartName}
          sharpRatio={sharpRatio}
        />
      ),
    },
    {
      name: t('Transaction'),
      component: <Transaction rbAddress={rebalance.address} />,
    },
  ]

  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box pb="32px">
        <div>
          <Flex className="mb-s40">
            <Button
              variant="text"
              as={Link}
              to="/rebalancing"
              height="24px"
              p="0"
              startIcon={<BackIcon color="textSubtle" />}
            >
              <Text textStyle="R_16R" color="textSubtle">
                {rebalance.title}
              </Text>
            </Button>
          </Flex>

          <Card className="mb-s16">
            <CardBody>
              <CardHeading
                rebalance={rebalance}
                isHorizontal={isMaxXl}
                className={`mb-s24 ${isMaxXl ? 'pb-s28' : 'pb-s24 bd-b'}`}
              />

              <div className="flex flex-wrap">
                <TwoLineFormat
                  className={isMaxXl ? 'col-6 mb-s20' : 'col-3'}
                  title={t('Total Asset Value')}
                  value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
                  large={!isMaxXl}
                />
                <Flex className={isMaxXl ? 'col-6 mb-s20' : 'col-3'}>
                  {isMaxXl || <VDivider mr="S_32" />}
                  <TwoLineFormat
                    title={t('Yield APR')}
                    value={`${numeral(
                      finixPrice
                        .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                        .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                        .times(100)
                        .toFixed(2),
                    ).format('0,0.[00]')}%`}
                    hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
                    large={!isMaxXl}
                  />
                </Flex>
                <Flex className={isMaxXl ? 'col-6' : 'col-3'}>
                  {isMaxXl || <VDivider mr="S_32" />}
                  <TwoLineFormat
                    title={t('Share Price(Since Inception)')}
                    value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
                    percent={`${
                      rebalance.sharedPricePercentDiff >= 0
                        ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                        : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                    }%`}
                    percentClass={(() => {
                      if (rebalance.sharedPricePercentDiff < 0) return 'failure'
                      if (rebalance.sharedPricePercentDiff > 0) return 'success'
                      return ''
                    })()}
                    large={!isMaxXl}
                  />
                </Flex>
                <Flex className={isMaxXl ? 'col-6' : 'col-3'}>
                  {isMaxXl || <VDivider mr="S_32" />}
                  <TwoLineFormat title={t('Risk-0-Meter')} value="Medium" large={!isMaxXl} />
                </Flex>

                {/* <TwoLineFormat
                  className={isMaxXl ? 'col-6' : 'col-3'}
                  title="Investors"
                  value={numeral(rebalance.activeUserCountNumber).format('0,0')}
                /> */}
              </div>
            </CardBody>
          </Card>

          <Card>
            <TabBox tabs={tabs} />
          </Card>
        </div>

        <FundAction rebalance={rebalance} isMobile={isMaxXl} />
      </Box>
    </>
  )
}

export default ExploreDetail
