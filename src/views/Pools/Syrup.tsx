import BigNumber from 'bignumber.js'
import _ from 'lodash'
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'

import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken } from 'config/constants/types'

import useBlock from 'hooks/useBlock'
import {
  useFarms,
  usePools,
  usePriceFinixUsd,
  usePriceKethKusdt,
  usePriceSixUsd,
  usePriceKlayKusdt,
  usePriceKethKlay,
  useBalances,
} from 'state/hooks'
import { fetchBalances } from 'state/wallet'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { TitleSet, Box } from 'definixswap-uikit'
import { IS_GENESIS } from '../../config'
import Flip from '../../uikit-dev/components/Flip'
import PoolCard from './components/PoolCard/PoolCard'
import PoolCardGenesis from './components/PoolCardGenesis'
import PoolTabButtons from './components/PoolTabButtons'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

const Farm: React.FC = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const { account } = useWallet()
  const dispatch = useDispatch()
  const farms = useFarms()
  const pools = usePools(account)
  const sixPriceUSD = usePriceSixUsd()
  const finixPriceUSD = usePriceFinixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const kethPriceUsd = usePriceKethKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()
  const balances = useBalances(account)
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  // const [isPhrase1, setIsPhrase1] = useState(false)
  const [pageState, setPageState] = useState<{
    state: string
    data: any
  }>({
    state: 'list',
    data: null,
  }) // 'list', 'deposit', 'remove',
  const orderOptions = useRef<
    {
      id: string
      label: string
      orderBy: 'asc' | 'desc'
    }[]
  >([
    {
      id: 'sortOrder',
      label: 'sortOrder',
      orderBy: 'asc',
    },
    {
      id: 'apyValue',
      label: 'apr',
      orderBy: 'desc',
    },
    {
      id: 'totalStakedValue',
      label: 'totalStaked',
      orderBy: 'desc',
    },
  ])
  const [selectedOrderOptions, setSelectedOrderOptions] = useState(orderOptions.current[0])

  // const phrase1TimeStamp = process.env.REACT_APP_PHRASE_1_TIMESTAMP
  //   ? parseInt(process.env.REACT_APP_PHRASE_1_TIMESTAMP || '', 10) || new Date().getTime()
  //   : new Date().getTime()
  // const currentTime = new Date().getTime()

  const priceToKlay = useCallback(
    (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
      const tokenPriceKLAYTN = new BigNumber(tokenPrice)
      if (tokenName === 'KLAY') {
        return new BigNumber(1)
      }
      if (tokenPrice && quoteToken === QuoteToken.KUSDT) {
        return tokenPriceKLAYTN.div(klayPriceUSD)
      }
      return tokenPriceKLAYTN
    },
    [klayPriceUSD],
  )

  const getStakingTokenFarm = useCallback(
    (pool) => {
      let stakingTokenFarm = farms.find((farm) => farm.tokenSymbol === pool.stakingTokenName)
      if (pool.sousId >= 0 && pool.sousId <= 6) {
        stakingTokenFarm = farms.find((farm) => farm.pid === pool.sousId)
      }
      return stakingTokenFarm
    },
    [farms],
  )

  const getHighestToken = useCallback((stakingTokenFarm) => {
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
    return highestToken
  }, [])

  const getKlayBundle = useCallback((stakingTokenFarm) => {
    return (stakingTokenFarm.bundleRewards || []).find((br) => br.rewardTokenInfo.name === QuoteToken.WKLAY)
  }, [])

  const getTotalValue = useCallback(
    (currentTotalStaked, stakingTokenFarm) => {
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
      return totalValue
    },
    [klayPriceUSD, finixPriceUSD, kethPriceUsd, sixPriceUSD],
  )

  const getPoolsWithApy = useCallback(() => {
    return pools.map((pool) => {
      const isKlayPool = pool.poolCategory === PoolCategory.KLAYTN
      const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
      const stakingTokenFarm = getStakingTokenFarm(pool)

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
      const highestToken = getHighestToken(stakingTokenFarm)
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
            const klayBundle = getKlayBundle(stakingTokenFarm)
            if (klayBundle) {
              // @ts-ignore
              const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
              const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
              const yieldValue = klayPriceUSD.times(klayRewardPerYear)
              const totalValue = getTotalValue(currentTotalStaked, stakingTokenFarm)
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
            const klayBundle = getKlayBundle(stakingTokenFarm)
            if (klayBundle) {
              // @ts-ignore
              const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
              const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
              const yieldValue = klayPriceUSD.times(klayRewardPerYear)
              const totalValue = getTotalValue(currentTotalStaked, stakingTokenFarm)
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
      return {
        ...pool,
        isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
        apy: sumApy,
        farm: stakingTokenFarm,
        apyValue: getBalanceNumber(sumApy),
        totalStakedValue: getBalanceNumber(pool.totalStaked),
      }
    })
  }, [
    pools,
    block,
    ethPriceKlay,
    farms,
    finixPriceUSD,
    getHighestToken,
    getKlayBundle,
    getStakingTokenFarm,
    getTotalValue,
    klayPriceUSD,
    priceToKlay,
    sixPriceUSD,
  ])

  const poolsWithApy = useMemo(() => {
    if (!_.compact(pools.map((pool) => pool.totalStaked)).length) return []
    return getPoolsWithApy()
  }, [pools, getPoolsWithApy])
  const partitionedPools = useMemo(() => partition(poolsWithApy, (pool) => pool.isFinished), [poolsWithApy])
  const targetPools = useMemo(() => {
    const [finishedPools, openPools] = partitionedPools
    return liveOnly ? openPools : finishedPools
  }, [liveOnly, partitionedPools])
  const displayPools = useMemo(() => {
    if (!stackedOnly) return targetPools
    return targetPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))
  }, [stackedOnly, targetPools])
  const orderedPools = useMemo(() => {
    return orderBy(displayPools, [selectedOrderOptions.id], [selectedOrderOptions.orderBy])
  }, [displayPools, selectedOrderOptions])

  const onSelectAdd = useCallback((props: any) => {
    setPageState({
      state: 'deposit',
      data: props,
    })
  }, [])
  const onSelectRemove = useCallback((props: any) => {
    setPageState({
      state: 'withdraw',
      data: props,
    })
  }, [])

  const getMyBalanceInWallet = useCallback(
    (tokenName: string, tokenAddress: string) => {
      if (balances) {
        const address = tokenName === 'WKLAY' ? 'main' : tokenAddress
        return _.get(balances, address)
      }
      return null
    },
    [balances],
  )

  const fetchAllBalances = useCallback(() => {
    if (balances) return
    if (account && !!poolsWithApy.length) {
      const assetAddresses = poolsWithApy.map((pool) => {
        return getAddress({ [process.env.REACT_APP_CHAIN_ID]: pool.stakingTokenAddress })
      })
      dispatch(fetchBalances(account, assetAddresses))
    }
  }, [dispatch, account, poolsWithApy, balances])

  useEffect(() => {
    fetchAllBalances()
  }, [fetchAllBalances])

  // useEffect(() => {
  //   if (currentTime < phrase1TimeStamp) {
  //     setTimeout(() => {
  //       setIsPhrase1(true)
  //     }, phrase1TimeStamp - currentTime)
  //   } else {
  //     setIsPhrase1(true)
  //   }
  // }, [currentTime, phrase1TimeStamp])

  return (
    <>
      <Helmet>
        <title>Pool - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      {/* <TwoPanelLayout>
        <LeftPanel isShowRightPanel={false}>
          <MaxWidth>
            
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout> */}
      <Box className="mt-s28">
        {pageState.state === 'list' && (
          <>
            <TitleSet
              title="Pool"
              description={t('Deposit a single token')}
              linkLabel={t('Learn how to stake')}
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
              orderOptions={orderOptions.current}
              orderBy={(selectedOption) => setSelectedOrderOptions(selectedOption)}
            />

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
                  {orderedPools.map((pool) => (
                    <PoolCard
                      key={pool.sousId}
                      pool={pool}
                      myBalanceInWallet={getMyBalanceInWallet(pool.tokenName, pool.stakingTokenAddress)}
                      onSelectAdd={onSelectAdd}
                      onSelectRemove={onSelectRemove}
                    />
                  ))}
                </Route>
                {/* <Route path={`${path}/history`}>
                  {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
                  ))}
                </Route> */}
              </>
            )}
            {/* <TimerWrapper isPhrase1={!(currentTime < phrase1TimeStamp && isPhrase1 === false)} date={phrase1TimeStamp}>
            </TimerWrapper> */}
          </>
        )}
        {pageState.state === 'deposit' && (
          <>
            <Deposit
              sousId={pageState.data.sousId}
              isOldSyrup={pageState.data.isOldSyrup}
              isBnbPool={pageState.data.isBnbPool}
              tokenName={pageState.data.tokenName}
              totalStaked={pageState.data.totalStaked}
              myStaked={pageState.data.myStaked}
              max={pageState.data.max}
              apy={pageState.data.apy}
              onBack={() => {
                setPageState({
                  state: 'list',
                  data: null,
                })
              }}
            />
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
              apy={pageState.data.apy}
              onBack={() => {
                setPageState({
                  state: 'list',
                  data: null,
                })
              }}
            />
          </>
        )}
      </Box>
    </>
  )
}

// const TimerWrapper = ({ isPhrase1, date, children }) => {
//   return isPhrase1 ? (
//     children
//   ) : (
//     <>
//       <div>
//         <br />
//         <Flip date={date} />
//         <br />
//         <br />
//         <br />
//       </div>
//       {children}
//     </>
//   )
// }

export default Farm
