import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ArrowBackRounded } from '@mui/icons-material'
import { Box, Button, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { useMatchBreakpoints } from 'uikit-dev'
import Card from 'uikitV2/components/Card'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import { getAddress } from 'utils/addressHelpers'
import { usePriceFinixUsd } from '../../state/hooks'
import { Rebalance } from '../../state/types'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../state/wallet'
import AssetDetail from './components/AssetDetail'
import CardHeading from './components/CardHeading'
import FactSheet from './components/FactSheet'
import FullAssetRatio from './components/FullAssetRatio'
import FullChart from './components/FullChart'
import FundAction from './components/FundAction'
import SelectChart, { TypeChartName } from './components/SelectChart'
import SelectTime from './components/SelectTime'
import Transaction from './components/Transaction'
import TwoLineFormat from './components/TwoLineFormat'
import WithDrawalFees from './components/WithdrawalFees'

interface ExploreDetailType {
  rebalance: Rebalance | any
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
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

const ExploreDetail: React.FC<ExploreDetailType> = ({ rebalance }) => {
  const [currentTab, setCurrentTab] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('1D')
  const [chartName, setChartName] = useState<TypeChartName>('Normalize')
  const [returnPercent, setReturnPercent] = useState(0)
  const [maxDrawDown, setMaxDrawDown] = useState(0)
  const [graphData, setGraphData] = useState({})
  const { isXl, isLg } = useMatchBreakpoints()
  const finixPrice = usePriceFinixUsd()
  const isMobile = !isXl && !isLg
  const dispatch = useDispatch()
  const { account } = useWallet()
  const prevRebalance = usePrevious(rebalance, {})
  const prevTimeframe = usePrevious(timeframe, '')
  const [periodPriceTokens, setPeriodPriceTokens] = useState([])
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

  const [sharpRatio, setSharpRatio] = useState(0)

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      dispatch(fetchRebalanceRewards(account, [rebalance]))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      dispatch(fetchRebalanceRewards(account, [rebalance]))
    }
  }, [dispatch, account, rebalance])

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
            const tokens = _.compact([...((rebalance || {}).tokens || [])])
            const oldPrice = []
            for (let i = 1; i <= tokens.length; i++) {
              oldPrice.push(fundGraphResult[0].values[i + tokens.length])
            }
            setPeriodPriceTokens(oldPrice)
          }

          const label = []
          const rebalanceData = {
            name: 'rebalance',
            values: [],
          }
          const base: Record<string, any> = {}
          fundGraphResult.forEach((data) => {
            const allCurrentTokens = _.compact([...((rebalance || {}).tokens || [])])
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
            name: 'rebalance',
            values: [],
            valuesPrice: [],
          }
          const sharePricesFromGraph = []
          const graphTokenData: Record<string, any> = {}
          const base: Record<string, any> = {}
          fundGraphResult.forEach((data) => {
            const allCurrentTokens = _.compact([...((rebalance || {}).tokens || [])])
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
            for (let j = 0; j < allCurrentTokens.length; j++) {
              let balance = new BigNumber(dataPoint[j + 1])
              balance = balance.dividedBy(10 ** allCurrentTokens[j].decimals)

              let price = new BigNumber(0)
              if (j < allCurrentTokens.length) {
                price = new BigNumber(dataPoint[j + (allCurrentTokens.length + 1)])
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
                graphTokenData[token.symbol] = {
                  name: token.symbol,
                  values: [],
                  valuesPrice: [],
                  color: ratioObject.color,
                }
              }
              graphTokenData[token.symbol].valuesPrice.push(dataValues[index])
              graphTokenData[token.symbol].values.push(
                new BigNumber(dataValues[index])
                  .div(base[token.symbol] as number)
                  .times(100)
                  .toNumber(),
              )
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
          setMaxDrawDown(currentDrawdown)
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
            name: 'rebalance',
            values: [],
            valuesPrice: [],
          }
          const sharePricesFromGraph = []
          const graphTokenData: Record<string, any> = {}
          const base: Record<string, any> = {}
          // find min max between
          const allCurrentTokens = _.compact([...((rebalance || {}).tokens || [])])

          const priceTokens = []
          for (let index = 0; index < allCurrentTokens.length; index++) {
            priceTokens.push([])
          }
          fundGraphResult.forEach((data) => {
            const dataPoint = _.get(data, 'values', [])
            for (let j = 0; j < allCurrentTokens.length; j++) {
              if (j < allCurrentTokens.length) {
                priceTokens[j].push(dataPoint[j + 1 + allCurrentTokens.length])
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
            for (let j = 0; j < allCurrentTokens.length; j++) {
              let balance = new BigNumber(dataPoint[j + 1])
              balance = balance.dividedBy(10 ** allCurrentTokens[j].decimals)

              let price = new BigNumber(0)
              if (j < allCurrentTokens.length) {
                price = new BigNumber(dataPoint[j + (allCurrentTokens.length + 1)])
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
                graphTokenData[token.symbol] = {
                  name: token.symbol,
                  values: [],
                  valuesPrice: [],
                  color: ratioObject.color,
                }
              }
              // if (token.symbol === 'USDT') {
              //   graphTokenData[token.symbol].values.push(50)
              //   graphTokenData[token.symbol].valuesPrice.push(1)
              // } else {
              graphTokenData[token.symbol].values.push(
                new BigNumber(dataValues[index]).minus(calToken[index].min).div(calToken[index].between).plus(20),
              )
              graphTokenData[token.symbol].valuesPrice.push(dataValues[index])
              // }
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
    if (chartName === 'Price') {
      fetchPriceGraphData()
    } else {
      fetchNormalizeGraphData()
    }
  }, [fetchPriceGraphData, fetchNormalizeGraphData, fetchReturnData, chartName])

  if (!rebalance) return <Redirect to="/rebalancing" />
  const { ratio } = rebalance
  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <Box className="mb-2">
        <Button
          variant="text"
          component={Link}
          to="/rebalancing"
          startIcon={<ArrowBackRounded color="inherit" />}
          sx={{ fontWeight: 'normal', color: theme.palette.text.disabled }}
        >
          Back
        </Button>
      </Box>

      <Card className="mb-3">
        <CardHeading rebalance={rebalance} />
        <Box display="flex" flexWrap="wrap" py={{ xs: '20px', lg: 4 }}>
          <Box px={{ xs: '20px', lg: 4 }} className={lgUp ? 'col-3 bd-r' : 'col-6 mb-3'}>
            <TwoLineFormatV2
              large
              title="Total Asset Value"
              value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
            />
          </Box>
          <Box px={{ xs: '20px', lg: 4 }} className={lgUp ? 'col-3 bd-r' : 'col-6 mb-3'}>
            <TwoLineFormatV2
              large
              title="Yield APR"
              value={numeral(
                finixPrice
                  .times(_.get(rebalance, 'finixRewardPerYearFromApollo', new BigNumber(0)))
                  .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                  .times(100)
                  .toFixed(2),
              ).format('0,0.[00]')}
              tooltip="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
            />
          </Box>
          <Box px={{ xs: '20px', lg: 4 }} className={lgUp ? 'col-3 bd-r' : 'col-6'}>
            <TwoLineFormatV2
              large
              title="Share Price (Since inception)"
              value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
              percent={`${
                rebalance.sharedPricePercentDiff >= 0
                  ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                  : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
              }%`}
              percentColor={(() => {
                if (rebalance.sharedPricePercentDiff < 0) return 'error'
                if (rebalance.sharedPricePercentDiff > 0) return 'success'
                return ''
              })()}
            />
          </Box>

          <Box px={{ xs: '20px', lg: 4 }} className={lgUp ? 'col-3' : 'col-6'}>
            {' '}
            <TwoLineFormatV2 large title="Risk-O-Meter" value="Medium" />
          </Box>
        </Box>
      </Card>

      <Card className="mb-3">
        <Tabs
          textColor="inherit"
          indicatorColor="secondary"
          value={currentTab}
          onChange={(e, newTab) => {
            setCurrentTab(newTab)
          }}
        >
          <Tab label="Overview" value={0} />
          <Tab label="Performance" value={1} />
          <Tab label="Transaction" value={2} />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <FullAssetRatio ratio={ratio} className="mb-4" />
          <AssetDetail rebalance={rebalance} periodPriceTokens={periodPriceTokens} />
          <FactSheet rebalance={rebalance} />
          <WithDrawalFees
            managementFee={_.get(rebalance, 'fee.management', 0.5)}
            buybackFee={_.get(rebalance, 'fee.buyback', 1.0)}
            className="mb-4"
          />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <div className="flex flex-wrap align-center justify-space-between mb-3">
            <div className="flex flex-wrap align-center justify-space-between mb-3">
              <div>
                <SelectTime timeframe={timeframe} setTimeframe={setTimeframe} />
              </div>
              <div style={{ marginLeft: isMobile ? '0px' : '20px', marginTop: isMobile ? '10px' : '0px' }}>
                <SelectChart chartName={chartName} setChartName={setChartName} />
              </div>
            </div>
            <div className={`flex ${isMobile ? 'mt-3 justify-end' : ''}`}>
              {false && (
                <TwoLineFormat
                  title="24H Performance"
                  value={`$${numeral(_.get(rebalance, 'twentyHperformance', 0)).format('0,0.[00]')}`}
                  valueClass={(() => {
                    if (_.get(rebalance, 'twentyHperformance', 0) < 0) return 'failure'
                    if (_.get(rebalance, 'twentyHperformance', 0) > 0) return 'success'
                    return ''
                  })()}
                  className="mr-6"
                />
              )}

              <TwoLineFormat
                title="Return"
                value={`${numeral(returnPercent || 0).format('0,0.[00]')}%`}
                hint="Probability return on investment measures approximately over a period of time."
                hintPosition="left"
              />
            </div>
          </div>

          <FullChart isLoading={isLoading} graphData={graphData} tokens={[...rebalance.ratio]} />

          <TwoLineFormat
            className="px-4 py-3 col-4 bd-r"
            title="Sharpe ratio"
            value={`${numeral(sharpRatio).format('0,0.00')}`}
            hint="The average return ratio compares to the risk-taking activities earned per unit rate of the total risk."
          />
          <TwoLineFormat
            className="px-4 py-3 col-4"
            title="Max Drawdown"
            value={`${Math.abs(numeral(maxDrawDown).format('0,0.00'))}%`}
            hint="The differentiation between the historical peak and low point through the portfolio."
          />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Transaction className="mb-4" rbAddress={rebalance.address} />
        </TabPanel>
      </Card>

      <Card>
        <FundAction rebalance={rebalance} isVertical={!isMobile} className={!isMobile ? 'col-3' : ''} />
      </Card>
    </>
  )
}

export default ExploreDetail
