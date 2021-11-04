import React, { useCallback, useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import useBlock from 'hooks/useBlock'
import {
  useFarms,
  usePools,
  usePriceFinixUsd,
  usePriceKethKusdt,
  usePriceSixUsd,
  usePriceKlayKusdt,
  usePriceKethKlay,
} from 'state/hooks'
import styled from 'styled-components'
import { Text, Link, TitleSet } from 'definixswap-uikit'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { getBalanceNumber } from 'utils/formatBalance'
import FlexLayout from 'components/layout/FlexLayout'
import { IS_GENESIS } from '../../config'
import Flip from '../../uikit-dev/components/Flip'
import PoolCard from './components/PoolCard/PoolCard'
import PoolCardGenesis from './components/PoolCardGenesis'
import PoolTabButtons from './components/PoolTabButtons'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWallet()
  const farms = useFarms()
  const pools = usePools(account)
  const sixPriceUSD = usePriceSixUsd()
  const finixPriceUSD = usePriceFinixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const kethPriceUsd = usePriceKethKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  const [isPhrase1, setIsPhrase1] = useState(false)
  const [listView, setListView] = useState(true)
  const [pageState, setPageState] = useState<{
    state: string
    data: any
  }>({
    state: 'list',
    data: null,
  }) // 'list', 'deposit', 'remove',

  const phrase1TimeStamp = process.env.REACT_APP_PHRASE_1_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_1_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()

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

    let klayApy = new BigNumber(0)
    switch (pool.sousId) {
      case 0: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear.div(currentTotalStaked).times(100)
        if ((stakingTokenFarm.bundleRewards || []).length > 0) {
          const klayBundle = (stakingTokenFarm.bundleRewards || []).find(
            (br) => br.rewardTokenInfo.name === QuoteToken.WKLAY,
          )
          if (klayBundle) {
            // @ts-ignore
            const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
            const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
            const yieldValue = klayPriceUSD.times(klayRewardPerYear)
            let totalValue = new BigNumber(currentTotalStaked)
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.KLAY) {
              totalValue = klayPriceUSD.times(new BigNumber(currentTotalStaked))
            }
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.FINIX) {
              totalValue = finixPriceUSD.times(new BigNumber(currentTotalStaked))
            }
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.KETH) {
              totalValue = kethPriceUsd.times(new BigNumber(currentTotalStaked))
            }
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
              totalValue = sixPriceUSD.times(new BigNumber(currentTotalStaked))
            }
            klayApy = yieldValue.div(totalValue).times(100)
          }
        }
        break
      }
      case 1: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        const finixInSix = new BigNumber(currentTotalStaked).times(sixPriceUSD).div(finixPriceUSD)
        apy = finixRewardPerYear.div(finixInSix).times(100)
        if ((stakingTokenFarm.bundleRewards || []).length > 0) {
          const klayBundle = (stakingTokenFarm.bundleRewards || []).find(
            (br) => br.rewardTokenInfo.name === QuoteToken.WKLAY,
          )
          if (klayBundle) {
            // @ts-ignore
            const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
            const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
            const yieldValue = klayPriceUSD.times(klayRewardPerYear)
            let totalValue = new BigNumber(currentTotalStaked)
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.KLAY) {
              totalValue = klayPriceUSD.times(new BigNumber(currentTotalStaked))
            }
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.FINIX) {
              totalValue = finixPriceUSD.times(new BigNumber(currentTotalStaked))
            }
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.KETH) {
              totalValue = kethPriceUsd.times(new BigNumber(currentTotalStaked))
            }
            if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
              totalValue = sixPriceUSD.times(new BigNumber(currentTotalStaked))
            }
            klayApy = yieldValue.div(totalValue).times(100)
          }
        }
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
    const finixApy = apy
    const sumApy = BigNumber.sum(finixApy, klayApy)
    console.groupCollapsed('Pool')
    console.log({
      ...pool,
      isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
      apy: sumApy,
      finixApy,
      klayApy,
      estimatePrice,
      farm: stakingTokenFarm,
    })
    console.groupEnd()
    return {
      ...pool,
      isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
      apy: sumApy,
      finixApy,
      klayApy,
      estimatePrice,
      farm: stakingTokenFarm,
    }
  })

  const [finishedPools, openPools] = partition(poolsWithApy, (pool) => pool.isFinished)
  const targetPools = useMemo(() => {
    return liveOnly ? openPools : finishedPools
  }, [liveOnly, openPools, finishedPools])

  const filterStackedOnlyPools = (poolsForFilter) =>
    poolsForFilter.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))

  const onSelectAdd = useCallback((props: any) => {
    console.log('onSelectAdd', props)
    setPageState({
      state: 'deposit',
      data: props,
    })
  }, [])
  const onSelectRemove = useCallback((props: any) => {
    console.log('onSelectRemove', props)
    setPageState({
      state: 'withdraw',
      data: props,
    })
  }, [])

  useEffect(() => {
    if (currentTime < phrase1TimeStamp) {
      setTimeout(() => {
        setIsPhrase1(true)
      }, phrase1TimeStamp - currentTime)
    } else {
      setIsPhrase1(true)
    }
  }, [currentTime, phrase1TimeStamp])

  useEffect(() => {
    return () => {
      setListView(true)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Pool - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanel isShowRightPanel={false}>
          <MaxWidth>
            {pageState.state === 'list' && (
              <>
                <TitleSet
                  title="Pool"
                  description="단일 토큰을 예치하여 FINIX를 얻으세요."
                  linkLabel="Learn to stake."
                  link="https://sixnetwork.gitbook.io/definix-on-klaytn-en/pools/how-to-stake-to-definix-pool"
                />
                {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
                  Help
                </HelpButton> */}
                
                <PoolTabButtons
                  stackedOnly={stackedOnly}
                  setStackedOnly={setStackedOnly}
                  liveOnly={liveOnly}
                  setLiveOnly={setLiveOnly}
                />

                <TimerWrapper
                  isPhrase1={!(currentTime < phrase1TimeStamp && isPhrase1 === false)}
                  date={phrase1TimeStamp}
                >
                  {IS_GENESIS ? (
                    <div>
                      <Route exact path={`${path}`}>
                        <>
                          {poolsWithApy.map((pool) => (
                            <PoolCardGenesis key={pool.sousId} pool={pool} />
                          ))}
                          {/* <Coming /> */}
                        </>
                      </Route>
                    </div>
                  ) : (
                    <>
                      <Route exact path={`${path}`}>
                        {orderBy(stackedOnly ? filterStackedOnlyPools(targetPools) : targetPools, ['sortOrder']).map(
                          (pool) => (
                            <PoolCard
                              key={pool.sousId}
                              pool={pool}
                              onSelectAdd={onSelectAdd}
                              onSelectRemove={onSelectRemove}
                            />
                          ),
                        )}
                      </Route>
                      {/* <Route path={`${path}/history`}>
                        {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                          <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
                        ))}
                      </Route> */}
                    </>
                  )}
                </TimerWrapper>
              </>
            )}
            {pageState.state === 'deposit' && (
              <>
                <Deposit
                  sousId={pageState.data.sousId}
                  isBnbPool={pageState.data.isBnbPool}
                  tokenName={pageState.data.tokenName}
                  totalStaked={pageState.data.totalStaked}
                  myStaked={pageState.data.myStaked}
                  max={pageState.data.max}
                  onBack={() => {
                    setPageState({
                      state: 'list',
                      data: null,
                    })
                  }}
                />
                ,
              </>
            )}
            {pageState.state === 'withdraw' && (
              <>
                <Withdraw
                  sousId={pageState.data.sousId}
                  isOldSyrup={pageState.data.isOldSyrup}
                  tokenName={pageState.data.tokenName}
                  totalStaked={pageState.data.totalStaked}
                  myStaked={pageState.data.myStaked}
                  max={pageState.data.max}
                  onBack={() => {
                    setPageState({
                      state: 'list',
                      data: null,
                    })
                  }}
                />
                ,
              </>
            )}
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout>
    </>
  )
}

const TimerWrapper = ({ isPhrase1, date, children }) => {
  return isPhrase1 ? (
    children
  ) : (
    <>
      <div>
        <br />
        <Flip date={date} />
        <br />
        <br />
        <br />
      </div>
      {children}
    </>
  )
}

export default Farm
