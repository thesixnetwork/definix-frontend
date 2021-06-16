import React, { useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Doughnut } from 'react-chartjs-2'
import styled from 'styled-components'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import {
  useFarms,
  usePools,
  usePriceKlayKusdt,
  usePriceKethKusdt,
  usePriceKethKlay,
  usePriceFinixUsd,
  usePriceSixUsd,
  usePoolsIsFetched,
  useFarmsIsFetched,
} from 'state/hooks'
import _ from 'lodash'

import { getBalanceNumber } from 'utils/formatBalance'
import { BLOCKS_PER_YEAR } from 'config'
import { Button, Card, ChevronRightIcon, Heading, Skeleton, Text } from 'uikit-dev'
import Loading from 'uikit-dev/components/Loading'
import { fetchFarmUserDataAsync } from 'state/actions'
import { useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useWallet } from 'klaytn-use-wallet'
import useI18n from 'hooks/useI18n'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import { provider } from 'web3-core'

import FarmCard from '../../Farms/components/FarmCard/FarmCard'
import { FarmWithStakedValue } from '../../Farms/components/FarmCard/types'
import FinixHarvestBalance from './FinixHarvestBalance'
import FinixHarvestPool from './FinixHarvestPool'

const Container = styled(Card)`
  overflow: auto;
`

const NetWorth = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;

  .sum {
    flex-grow: 1;
  }
`

const Legend = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;

  &:last-child {
    margin: 0;
  }

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 8px;
  }
`

const HarvestAll = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .ready {
    padding: 12px 24px;
    position: relative;

    &:before {
      content: '';
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top-color: ${({ theme }) => theme.colors.white};
      position: absolute;
      top: 100%;
      left: calc(50% - 8px);
    }
  }

  .harvest {
    padding: 16px 24px;
    background: ${({ theme }) => theme.colors.backgroundBlueGradient};
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const StatAll = styled.div`
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.white};

  h2 {
    margin: 4px 0;
  }
`

const FarmsAndPools = styled.a`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .icon {
    padding-right: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &:last-child {
    border: none;
  }
`

const Coins = styled.div`
  padding: 16px;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  img {
    width: 48px;
    flex-shrink: 0;
  }
`

const Summary = styled.div`
  padding: 12px;
  width: 60%;
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
    padding: 4px;
  }
`

const List = styled.div`
  overflow: auto;
  max-height: 530px;

  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 100%;
    overflow: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: 100%;
    overflow: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 370px;
    overflow: auto;
  }
`
const Dot = styled.div`
  margin-top: 3px;
`

const CardMyFarmsAndPools = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true)
  // Harvest
  const [pendingTx, setPendingTx] = useState(false)
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const isPoolFetched = usePoolsIsFetched()
  const isFarmFetched = useFarmsIsFetched()

  useEffect(() => {
    if (isFarmFetched && isPoolFetched) {
      setIsLoading(false)
    }
  }, [isPoolFetched, isFarmFetched])

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    return () => {
      setListView(false)
    }
  }, [])

  // Farms
  const farmsLP = useFarms()
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPriceUsd = usePriceKethKusdt()
  const [listView, setListView] = useState(false)
  const activeFarms = farmsLP.filter((farms) => farms.pid !== 0 && farms.pid !== 1 && farms.multiplier !== '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farms) => farms.userData && new BigNumber(farms.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const finixPriceVsBNB = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
          .times(farm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

        // finixPriceInQuote * finixRewardPerYear / lpTotalInQuoteToken
        let apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)

        if (farm.quoteTokenSymbol === QuoteToken.KUSDT) {
          apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(klayPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
          apy = finixPrice.div(ethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
          apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const finixApy =
            farm && finixPriceVsBNB.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = finixApy && dualApy && finixApy.plus(dualApy)
        }

        return { ...farm, apy }
      })

      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          klayPrice={klayPrice}
          kethPrice={ethPriceUsd}
          sixPrice={sixPrice}
          finixPrice={finixPrice}
          klaytn={klaytn}
          account={account}
          isHorizontal={listView}
        />
      ))
    },
    [sixPrice, klayPrice, ethPriceUsd, finixPrice, klaytn, account, listView],
  )

  // Pools
  const pools = usePools(account)
  const farms = useFarms()
  const sixPriceUSD = usePriceSixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()

  const priceToKlay = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceKLAYTN = new BigNumber(tokenPrice)
    if (tokenName === 'KLAY') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.KUSDT) {
      return tokenPriceKLAYTN.div(klayPriceUSD)
    }
    return tokenPriceKLAYTN
  }

  const poolsWithApy = pools.map((pool) => {
    const isKlayPool = pool.poolCategory === PoolCategory.KLAYTN
    const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    let stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)
    switch (pool.sousId) {
      case 0:
        stakingTokenFarm = farms.find((s) => s.pid === 0)
        break
      case 1:
        stakingTokenFarm = farms.find((s) => s.pid === 1)
        break
      case 2:
        stakingTokenFarm = farms.find((s) => s.pid === 2)
        break
      case 3:
        stakingTokenFarm = farms.find((s) => s.pid === 3)
        break
      case 4:
        stakingTokenFarm = farms.find((s) => s.pid === 4)
        break
      case 5:
        stakingTokenFarm = farms.find((s) => s.pid === 5)
        break
      case 6:
        stakingTokenFarm = farms.find((s) => s.pid === 6)
        break
      default:
        break
    }

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api
    const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'KETH' ? ethPriceKlay : 1

    // /!\ Assume that the farm quote price is KLAY
    const stakingTokenPriceInKLAY = isKlayPool
      ? new BigNumber(1)
      : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote).times(tempMultiplier)
    const rewardTokenPriceInKLAY = priceToKlay(
      pool.tokenName,
      rewardTokenFarm?.tokenPriceVsQuote,
      rewardTokenFarm?.quoteTokenSymbol,
    )

    const totalRewardPricePerYear = rewardTokenPriceInKLAY.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInKLAY.times(getBalanceNumber(pool.totalStaked))
    let apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    const totalLP = new BigNumber(stakingTokenFarm.lpTotalSupply).div(new BigNumber(10).pow(18))
    let highestToken
    if (stakingTokenFarm.tokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.tokenAmount
    } else if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.quoteTokenAmount
    } else if (stakingTokenFarm.tokenAmount > stakingTokenFarm.quoteTokenAmount) {
      highestToken = stakingTokenFarm.tokenAmount
    } else {
      highestToken = stakingTokenFarm.quoteTokenAmount
    }
    const tokenPerLp = new BigNumber(totalLP).div(new BigNumber(highestToken))
    const priceUsdTemp = tokenPerLp.times(2).times(new BigNumber(sixPriceUSD))
    const estimatePrice = priceUsdTemp.times(new BigNumber(pool.totalStaked).div(new BigNumber(10).pow(18)))

    switch (pool.sousId) {
      case 0: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear.div(currentTotalStaked).times(100)
        break
      }
      case 1: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        const finixInSix = new BigNumber(currentTotalStaked).times(sixPriceUSD).div(finixPrice)
        apy = finixRewardPerYear.div(finixInSix).times(100)
        break
      }
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      default:
        break
    }
    return {
      ...pool,
      isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
      apy,
      estimatePrice,
    }
  })

  const stackedOnlyPools = poolsWithApy.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )

  // Net Worth
  const getNetWorth = (d) => {
    if (typeof d.pid === 'number') {
      // farm
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const stakedTotalInQuoteToken = new BigNumber(stakedBalance)
        .div(new BigNumber(10).pow(18))
        .times(new BigNumber(2))
        .times(d.lpTokenRatio)
      // const displayBalance = rawStakedBalance.toLocaleString()
      let totalValue
      totalValue = d.lpTotalInQuoteToken
      if (!d.lpTotalInQuoteToken) {
        totalValue = new BigNumber(0)
      }
      if (d.quoteTokenSymbol === QuoteToken.KLAY) {
        totalValue = klayPrice.times(d.lpTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.FINIX) {
        totalValue = finixPrice.times(d.lpTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.KETH) {
        totalValue = ethPriceUsd.times(d.lpTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.SIX) {
        totalValue = sixPrice.times(d.lpTotalInQuoteToken)
      }

      const earningRaw = _.get(d, 'userData.earnings', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = finixPrice.times(earning)
      return new BigNumber(totalValue).div(d.lpTotalInQuoteToken).times(stakedTotalInQuoteToken).plus(totalEarning)
    }
    if (typeof d.sousId === 'number') {
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const stakedTotal = new BigNumber(stakedBalance).div(new BigNumber(10).pow(18))
      let totalValue
      totalValue = stakedTotal
      if (d.stakingTokenName === QuoteToken.KLAY) {
        totalValue = klayPrice.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.FINIX) {
        totalValue = finixPrice.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.KETH) {
        totalValue = ethPriceUsd.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.SIX) {
        totalValue = sixPrice.times(stakedTotal)
      }
      const earningRaw = _.get(d, 'userData.pendingReward', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = finixPrice.times(earning)
      return new BigNumber(totalValue).plus(totalEarning)
    }
    return new BigNumber(0)
  }

  const dataFarms = stackedOnlyFarms.map((f) => ({
    lpSymbol: f.lpSymbol,
    value: Number(getNetWorth(f)),
  }))

  const dataPools = stackedOnlyPools.map((p) => ({
    lpSymbol: p.tokenName,
    value: Number(getNetWorth(p)),
  }))

  const arrayData = [...dataFarms, ...dataPools]
  const sorted = arrayData.sort((a, b) => b.value - a.value)
  const chartValue = sorted.map((i) => Number(i.value))
  const topThree = sorted.splice(0, 3)

  // OTHER
  const result = sorted.map((i) => Number(i))
  const other = result.reduce((a, b) => a + b, 0)

  // CHART
  const chartColors = []
  const defaultColor = ['#0973B9', '#E2B23A', '#24B181']
  defaultColor.splice(0, topThree.length).forEach((c) => {
    chartColors.push(c)
  })
  const otherColor = '#8C90A5'
  if (other > 0) chartColors.push(otherColor)
  const chart = {
    data: {
      labels: stackedOnlyFarms.map((d) => d.lpSymbol),
      datasets: [
        {
          data: chartValue,
          backgroundColor: chartColors,
          hoverBackgroundColor: chartColors,
        },
      ],
      hoverOffset: 4,
      borderWidth: 1,
    },
    options: {
      legend: {
        display: false,
        position: 'right',
      },
      tooltips: {
        enabled: false,
      },
      layout: {
        padding: 24,
      },
      rotation: 2,
      cutoutPercentage: 90,
      responsive: true,
    },
  }

  return (
    <Container className={className}>
      <NetWorth>
        <div className="col-12 flex" style={{ position: 'relative' }}>
          {isLoading ? <Loading /> : <Doughnut data={chart.data} options={chart.options} height={150} width={150} />}
        </div>
        <div className="sum col-7 pa-3 pl-0">
          <Text color="textSubtle">Net Worth</Text>
          {isLoading ? (
            <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
          ) : (
            <Heading fontSize="24px !important">
              {(() => {
                const allNetWorth = [...stackedOnlyFarms, ...stackedOnlyPools].map((f) => {
                  return getNetWorth(f)
                })
                // eslint-disable-next-line
                const totalNetWorth =
                  _.compact(allNetWorth).length > 0
                    ? _.compact(allNetWorth).reduce((fv, sv) => {
                        return fv.plus(sv)
                      })
                    : new BigNumber(0)
                return totalNetWorth && Number(totalNetWorth) !== 0
                  ? `$${Number(totalNetWorth).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : '-'
              })()}
            </Heading>
          )}
          {isLoading ? (
            <>
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
            </>
          ) : (
            <>
              <div className="mt-2 flex">
                <Dot className="col-2">
                  {chartColors.map((color) => (
                    <Legend>
                      <span
                        className="dot"
                        style={{
                          background: color === '#8C90A5' && arrayData.length === 3 ? 'transparent' : color,
                          marginBottom: '11px',
                        }}
                      />
                    </Legend>
                  ))}
                </Dot>
                <div className="col-8">
                  {topThree.map((d) => (
                    <Legend key={`legend${d.lpSymbol}`}>
                      <Text fontSize="12px" color="textSubtle">
                        {d.lpSymbol}
                      </Text>
                      <Text bold style={{ paddingLeft: '80px' }}>
                        {d.value ? `$${Number(d.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                      </Text>
                    </Legend>
                  ))}

                  {other > 0 && (
                    <Legend>
                      <Text fontSize="12px" color="textSubtle">
                        OTHER
                      </Text>
                      <Text bold style={{ paddingLeft: '80px' }}>
                        {other ? `$${Number(other).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                      </Text>
                    </Legend>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </NetWorth>

      <HarvestAll>
        <Text bold textAlign="center" className="ready">
          FINIX ready to harvest
        </Text>
        <div className="harvest">
          <div className="flex justify-center">
            <StatAll>
              <Text textAlign="center" color="textSubtle">
                From all farms
              </Text>
              {isLoading ? (
                <>
                  <Skeleton animation="pulse" variant="rect" height="26px" className="my-1" />
                  <Skeleton animation="pulse" variant="rect" height="21px" />
                </>
              ) : (
                <>
                  <Heading fontSize="24px !important" textAlign="center">
                    <FinixHarvestBalance />
                  </Heading>
                </>
              )}
            </StatAll>
            <StatAll>
              <Text textAlign="center" color="textSubtle">
                From all pools
              </Text>
              {isLoading ? (
                <>
                  <Skeleton animation="pulse" variant="rect" height="26px" className="my-1" />
                  <Skeleton animation="pulse" variant="rect" height="21px" />
                </>
              ) : (
                <>
                  <Heading fontSize="24px !important" textAlign="center">
                    <FinixHarvestPool />
                  </Heading>
                </>
              )}
            </StatAll>
          </div>
          {account ? (
            <Button
              id="harvest-all"
              size="sm"
              className="btn-secondary-disable mt-3"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
            >
              {pendingTx
                ? TranslateString(548, 'Collecting FINIX')
                : TranslateString(532, `Harvest all (${balancesWithValue.length})`)}
            </Button>
          ) : (
            <UnlockButton />
          )}
        </div>
      </HarvestAll>

      <List>
        <>
          {stackedOnlyPools.map((d) => {
            const imgs = d.tokenName.split(' ')[0].split('-')
            return (
              <FarmsAndPools href="#" key={d.tokenName}>
                <Coins>
                  <div className="flex">
                    <img src={`/images/coins/${imgs[0]}.png`} alt="" />
                  </div>
                  <Text bold>{d.tokenName}</Text>
                </Coins>
                <Summary>
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      APR
                    </Text>
                    <Text bold color="success">
                      {new BigNumber(d.apy).toNumber().toFixed(2)}%
                    </Text>
                  </div>
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      LP Staked
                    </Text>
                    <Text bold>
                      {new BigNumber(d.userData.stakedBalance).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                    </Text>
                  </div>
                  <div />
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      FINIX Earned
                    </Text>
                    <Text bold>
                      {new BigNumber(d.userData.pendingReward).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                    </Text>
                  </div>
                </Summary>
                <div className="icon">
                  <ChevronRightIcon color="textDisabled" width="28" />
                </div>
              </FarmsAndPools>
            )
          })}
        </>

        {farmsList(stackedOnlyFarms, false).map((d) => {
          const imgs = d.props.farm.lpSymbol.split(' ')[0].split('-')
          return (
            <FarmsAndPools href="#" key={d.props.farm.lpSymbol}>
              <Coins>
                {isLoading ? (
                  <>
                    <div className="flex">
                      <Skeleton animation="pulse" variant="circle" height="48px" width="48px" className="mx-1" />
                      <Skeleton animation="pulse" variant="circle" height="48px" width="48px" className="mx-1" />
                    </div>
                    <Skeleton animation="pulse" variant="rect" height="21px" width="80%" />
                  </>
                ) : (
                  <>
                    <div className="flex">
                      <img src={`/images/coins/${imgs[0]}.png`} alt="" />
                      <img src={`/images/coins/${imgs[1]}.png`} alt="" />
                    </div>
                    <Text bold>{d.props.farm.lpSymbol}</Text>
                  </>
                )}
              </Coins>
              <Summary>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    APR
                  </Text>
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="21px" width="50%" />
                  ) : (
                    <Text bold color="success">
                      {new BigNumber(d.props.farm.apy.toNumber() * 100).toNumber().toFixed()}%
                    </Text>
                  )}
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    LP Staked
                  </Text>
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="21px" />
                  ) : (
                    <Text bold>
                      {new BigNumber(d.props.farm.userData.stakedBalance)
                        .div(new BigNumber(10).pow(18))
                        .toNumber()
                        .toFixed(2)}
                    </Text>
                  )}
                </div>
                {false && (
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      Multiplier
                    </Text>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="21px" width="50%" />
                    ) : (
                      <Text bold color="warning">
                        {d.props.farm.multiplier}
                      </Text>
                    )}
                  </div>
                )}
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    FINIX Earned
                  </Text>
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="21px" />
                  ) : (
                    <Text bold>
                      {new BigNumber(d.props.farm.userData.earnings)
                        .div(new BigNumber(10).pow(18))
                        .toNumber()
                        .toFixed(2)}
                    </Text>
                  )}
                </div>
              </Summary>
              <div className="icon">
                <ChevronRightIcon color="textDisabled" width="28" />
              </div>
            </FarmsAndPools>
          )
        })}
      </List>
    </Container>
  )
}

export default CardMyFarmsAndPools
