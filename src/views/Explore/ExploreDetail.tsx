import React, { useRef, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import rebalanceABI from 'config/abi/rebalance.json'
import _ from 'lodash'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { getContract, getWeb3Contract } from 'utils/caver'
import { getAddress, getHerodotusAddress, getFinixAddress } from 'utils/addressHelpers'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { ArrowBackIcon, Button, Card, Text, useMatchBreakpoints } from 'uikit-dev'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import numeral from 'numeral'
import { BLOCKS_PER_YEAR } from 'config'
import herodotusABI from 'config/abi/herodotus.json'
import { usePriceFinixUsd } from 'state/hooks'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
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
  const [apy, setApy] = useState(0)
  const [returnPercent, setReturnPercent] = useState(0)
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

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
    }
  }, [dispatch, account, rebalance])

  const fetchAPYData = useCallback(async () => {
    if (rebalance && rebalance.address && rebalance.tokens) {
      setIsLoading(true)
      try {
        const autoHerodotusContract = getContract(
          [
            {
              constant: true,
              inputs: [
                {
                  name: '',
                  type: 'address',
                },
              ],
              name: 'rebalancePID',
              outputs: [
                {
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
          ],
          rebalance.autoHerodotus,
        )
        // getAddress( "0x115DE0E312ae3Fd19E8000379D9A8103dB2e789c"
        const herodotusContract = getContract(herodotusABI, getHerodotusAddress())
        const [pid, BONUS_MULTIPLIER, totalAllocPoint, currentPriceTokensResp] = await Promise.all([
          autoHerodotusContract.methods.rebalancePID(getAddress(rebalance.address)).call(),
          herodotusContract.methods.BONUS_MULTIPLIER().call(),
          herodotusContract.methods.totalAllocPoint().call(),
          axios.get(
            process.env.REACT_APP_DEFINIX_GET_PRICE_API,
          ),
        ])
        const currentPriceAllResult = _.get(currentPriceTokensResp, 'data.prices', [])

        const poolInfo = await herodotusContract.methods.poolInfo(pid).call()

        const totalRewardPerBlock = new BigNumber(poolInfo.lastRewardBlock)
          .times(BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))

        const finixRewardPerBlock = totalRewardPerBlock.times(totalAllocPoint)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const finixPrice = new BigNumber(currentPriceAllResult.FINIX)

        const finixApy = finixPrice.times(finixRewardPerYear).div(rebalance.totalAssetValue)
        setApy(finixApy.toNumber())
        // eslint-disable-next-line

        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }
  }, [rebalance])
  const fetchReturnPercentData = useCallback(async () => {
    if (rebalance && rebalance.address && rebalance.tokens) {
      setIsLoading(true)
      try {
        const address = getAddress(rebalance.address)
        const rebalanceCalls = [
          {
            address,
            name: 'getCurrentPoolUSDBalance',
          },
          {
            address,
            name: 'getTokensLength',
          },
          {
            address,
            name: 'usdToken',
          },
        ]
        const erc20Calls = [
          {
            address,
            name: 'totalSupply',
          },
        ]

        const [[currentPoolUsdBalances], tokenLength, usdTokenAddresses] = await multicall(rebalanceABI, rebalanceCalls)

        const tokenCallers = []
        for (let i = 0; i < tokenLength; i++) {
          tokenCallers.push(multicall(rebalanceABI, [{ address, name: 'tokens', params: [i] }]))
        }
        const tokenRatioPointsCallers = []
        for (let i = 0; i < tokenLength; i++) {
          tokenRatioPointsCallers.push(multicall(rebalanceABI, [{ address, name: 'tokenRatioPoints', params: [i] }]))
        }
        const tokenAddresss = _.flattenDeep(await Promise.all(tokenCallers))
        const makeTokenCallers = (inputArray) => {
          return inputArray.map((tokenAddress) => {
            return multicall(erc20, [
              { address: tokenAddress, name: 'name' },
              { address: tokenAddress, name: 'symbol' },
              { address: tokenAddress, name: 'decimals' },
              {
                address: tokenAddress,
                name: 'balanceOf',
                params: [address],
              },
            ]).then((calledTokenData) => {
              const [[name], [symbol], [decimals], [totalBalance]] = calledTokenData
              return {
                address: tokenAddress,
                name,
                symbol,
                decimals,
                // @ts-ignore
                totalBalance: new BigNumber([totalBalance]),
              }
            })
          })
        }
        const tokenInfoCallers = makeTokenCallers(tokenAddresss)
        const tokens = await Promise.all(tokenInfoCallers)
        const usdTokenCallers = makeTokenCallers(usdTokenAddresses)
        const usdToken = await Promise.all(usdTokenCallers)
        const [totalSupply] = await multicall(erc20, erc20Calls)

        // @ts-ignore
        const selectedTotalSupply = (totalSupply || [])[0]
        const poolUsdBalance = (currentPoolUsdBalances || []).map((x, index) => {
          let currentToken = tokens[index]
          if (currentToken) currentToken = (usdToken || [])[0]
          // @ts-ignore
          return new BigNumber([x]).div(new BigNumber(10).pow((currentToken || {}).decimals || 18))
        })
        const totalAssetValue = BigNumber.sum.apply(null, poolUsdBalance)
        // @ts-ignore
        const sharedPrice = totalAssetValue.div(new BigNumber([selectedTotalSupply]).div(new BigNumber(10).pow(18)))
        const last24Response = await axios.get(
          `${process.env.REACT_APP_API_LAST_24}?address=${address}&period=${timeframe}`,
        )
        const last24Data = _.get(last24Response, 'data.result', {})
        const last24TotalSupply = new BigNumber(_.get(last24Data, 'total_supply')).div(new BigNumber(10).pow(18))
        const last24Tokens = _.get(last24Data, 'tokens', {})
        const sumOldTokenPrice = BigNumber.sum.apply(
          null,
          tokens.map((token: any) => {
            const tokenAmount = new BigNumber(_.get(last24Tokens, `${token.address.toLowerCase()}.balance`, '0')).div(
              new BigNumber(10).pow(token.decimals),
            )
            const tokenPrice = new BigNumber(_.get(last24Tokens, `${token.address.toLowerCase()}.price`, 0))
            const totalTokenPrice = tokenAmount.times(tokenPrice)
            return totalTokenPrice
          }),
        )
        const oldSharedPrice = sumOldTokenPrice.div(last24TotalSupply)
        const diffSharedPrice = sharedPrice.minus(oldSharedPrice)
        const sharedPricePercentDiff =
          sharedPrice.div(oldSharedPrice.div(100)).toNumber() * (diffSharedPrice.isLessThan(0) ? -1 : 1)
        setReturnPercent(sharedPricePercentDiff)

        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }
  }, [rebalance, timeframe])
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
    fetchReturnPercentData()
    fetchAPYData()
  }, [fetchGraphData, fetchReturnPercentData, fetchAPYData])

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
                    <TwoLineFormat title="APY" value={`${apy.toFixed(2)}%`} hint="xxx" className="mr-6" />
                    <TwoLineFormat title="Return" value={`${returnPercent.toFixed(2)}%`} hint="xxx" />
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
