import React, { useRef, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { ArrowBackIcon, Button, Card, Text, useMatchBreakpoints } from 'uikit-dev'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import numeral from 'numeral'
import { getAddress } from 'utils/addressHelpers'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import CardHeading from './components/CardHeading'
import FullAssetRatio from './components/FullAssetRatio'
import FullChart from './components/FullChart'
import FundAction from './components/FundAction'
import FundDetail from './components/FundDetail'
import SelectTime from './components/SelectTime'
import TradeStrategy from './components/TradeStrategy'
import Transaction from './components/Transaction'
import TwoLineFormat from './components/TwoLineFormat'
import WithDrawalFees from './components/WithdrawalFees'
import { Rebalance } from '../../state/types'

const MaxWidth = styled.div`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const LeftPanelAbsolute = styled(LeftPanel)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
`

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

const ExploreDetail: React.FC<ExploreDetailType> = ({ rebalance }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('1D')
  const [performanceData, setPerformanceData] = useState<Record<string, string>>({})
  const [graphData, setGraphData] = useState({})
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg
  const dispatch = useDispatch()
  const { account } = useWallet()
  const prevRebalance = usePrevious(rebalance, {})
  const prevTimeframe = usePrevious(timeframe, '')

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
    }
  }, [dispatch, account, rebalance])

  const fetchGraphData = useCallback(async () => {
    if (!_.isEqual(rebalance, prevRebalance) || !_.isEqual(timeframe, prevTimeframe)) {
      if (rebalance && rebalance.address) {
        setIsLoading(true)
        const performanceAPI = process.env.REACT_APP_API_REBALANCING_PERFORMANCE
        const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
        try {
          const performanceResp = await axios.get(
            `${performanceAPI}?address=${getAddress(rebalance.address)}&period=${timeframe}`,
          )
          const fundGraphResp = await axios.get(
            `${fundGraphAPI}?rebalance_address=${getAddress(rebalance.address)}&timeframe=${timeframe}`,
          )
          const performanceResult = _.get(performanceResp, 'data.result', {})
          const fundGraphResult = _.get(fundGraphResp, 'data.result', [])
          const label = []
          const rebalanceData = {
            name: 'rebalance',
            values: [],
          }
          const graphTokenData: Record<string, any> = {}
          const base: Record<string, any> = {}
          fundGraphResult.forEach((data) => {
            const timestampLabel = moment(data.timestamp * 1000 - ((data.timestamp * 1000) % modder[timeframe])).format(
              formatter[timeframe],
            )
            label.push(timestampLabel)
            let dataValues = _.get(data, 'values', [])
            if (!base.rebalance) {
              base.rebalance = new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber()
            }
            rebalanceData.values.push(
              new BigNumber(dataValues[0])
                .div(new BigNumber(10).pow(18))
                .div(new BigNumber(base.rebalance as number))
                .times(100)
                .toNumber(),
            )
            dataValues = dataValues.splice(_.get(rebalance, 'tokens', []).length)
            _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).forEach(
              (token, index) => {
                if (!base[token.symbol]) {
                  base[token.symbol] = dataValues[index]
                }
                if (!graphTokenData[token.symbol]) {
                  const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)
                  graphTokenData[token.symbol] = {
                    name: token.symbol,
                    values: [],
                    color: ratioObject.color,
                  }
                }
                graphTokenData[token.symbol].values.push(
                  new BigNumber(dataValues[index])
                    .div(base[token.symbol] as number)
                    .times(100)
                    .toNumber(),
                )
              },
            )
          })
          graphTokenData.rebalance = rebalanceData
          setGraphData({ labels: label, graph: graphTokenData })
          setPerformanceData(performanceResult)
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }
  }, [rebalance, timeframe, prevRebalance, prevTimeframe])
  useEffect(() => {
    fetchGraphData()
  }, [fetchGraphData])

  if (!rebalance) return <Redirect to="/explore" />
  const { ratio } = rebalance
  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            <Card className="mb-4">
              <div className="pa-4 pt-2 bd-b">
                <Button
                  variant="text"
                  as={Link}
                  to="/explore"
                  ml="-12px"
                  mb="8px"
                  padding="0 12px"
                  startIcon={<ArrowBackIcon />}
                >
                  <Text fontSize="14px" color="textSubtle">
                    Back
                  </Text>
                </Button>

                <div className="flex justify-space-between align-end mb-2">
                  <CardHeading rebalance={rebalance} />
                  {!isMobile && (
                    <TwoLineFormat
                      title="Share price"
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
                      large
                    />
                  )}
                </div>

                <div className={`flex flex-wrap ${!isMobile ? 'pl-8' : ''}`}>
                  <TwoLineFormat
                    className={isMobile ? 'col-6 my-2' : 'col-3'}
                    title="Total asset value"
                    value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
                  />
                  {isMobile && (
                    <TwoLineFormat
                      className={isMobile ? 'col-6 my-2' : 'col-3'}
                      title="Share price"
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
                    />
                  )}
                  <TwoLineFormat
                    className={isMobile ? 'col-6' : 'col-3'}
                    title="24H Performance"
                    value={`$${numeral(rebalance.twentyHperformance).format('0,0.[00]')}`}
                    valueClass={(() => {
                      if (rebalance.twentyHperformance < 0) return 'failure'
                      if (rebalance.twentyHperformance > 0) return 'success'
                      return ''
                    })()}
                  />
                  <TwoLineFormat
                    className={isMobile ? 'col-6' : 'col-3'}
                    title="Investors"
                    value={numeral(rebalance.activeUserCountNumber).format('0,0')}
                  />
                </div>
              </div>

              <div className="pa-4">
                <div className="flex flex-wrap align-center justify-space-between mb-3">
                  <SelectTime timeframe={timeframe} setTimeframe={setTimeframe} />
                  <div className={`flex ${isMobile ? 'mt-3 justify-end' : ''}`}>
                    <TwoLineFormat title="APY" value="00%" hint="xxx" className="mr-6" />
                    <TwoLineFormat title="Return" value="00%" hint="xxx" />
                  </div>
                </div>

                <FullChart isLoading={isLoading} graphData={graphData} tokens={[...rebalance.ratio]} />
              </div>

              <div className="flex bd-t">
                <TwoLineFormat className="px-4 py-3 col-4 bd-r" title="Risk-O-Meter" value="Medium" />
                <TwoLineFormat
                  className="px-4 py-3 col-4 bd-r"
                  title="Sharpe ratio"
                  value={`${numeral(performanceData.sharpeRatio).format('0,0.00')}`}
                  hint="xxx"
                />
                <TwoLineFormat
                  className="px-4 py-3 col-4"
                  title="Max Drawdown"
                  value={`${numeral(performanceData.maxDrawDown).format('0,0.00')}%`}
                  hint="xxx"
                />
              </div>
            </Card>

            <FullAssetRatio ratio={ratio} className="mb-4" />
            <TradeStrategy className="mb-4" />
            <WithDrawalFees className="mb-4" />
            <FundDetail className="mb-4" rebalance={rebalance} />
            <Transaction className="mb-4" rbAddress={rebalance.address} />
            <FundAction rebalance={rebalance} />
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default ExploreDetail
