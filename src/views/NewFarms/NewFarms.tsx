import _ from 'lodash'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import useConverter from 'hooks/useConverter'
import { fetchFarmUserDataAsync, fetchBalances } from 'state/actions'
import {
  useFarms,
  usePriceKlayKusdt,
  usePriceKethKusdt,
  usePriceFinixUsd,
  usePriceSixUsd,
  useBalances,
} from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import { getTokenSymbol } from 'utils/getTokenSymbol'
import { getBalanceNumber } from 'utils/formatBalance'
import { TitleSet, Box, DropdownOption } from 'definixswap-uikit'
// import Flip from '../../uikit-dev/components/Flip'
import FarmCard from './components/FarmCard/FarmCard'
import { FarmWithStakedValue } from './components/FarmCard/types'
import FarmTabButtons from './components/FarmTabButtons'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

const Farms: React.FC = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const dispatch = useDispatch()
  const { convertToPriceFromToken } = useConverter()
  const farmsLP = useFarms()
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const kethPriceUsd = usePriceKethKusdt()
  const { fastRefresh } = useRefresh()
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const balances = useBalances(account)

  // const [listView, setListView] = useState(true)
  // const [isPhrase2, setIsPhrase2] = useState(false)
  const [stackedOnly, setStackedOnly] = useState(false)
  const [pageState, setPageState] = useState<{
    state: string
    data: any
  }>({
    state: 'list',
    data: null,
  }) // 'list', 'deposit', 'remove',
  const orderFilter = useRef<{
    defaultIndex: number
    options: DropdownOption[]
  }>({
    defaultIndex: 0,
    options: [
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
        id: 'totalLiquidityValue',
        label: 'totalLiquidity',
        orderBy: 'desc',
      },
    ],
  })
  const [selectedOrderOptionIndex, setSelectedOrderOptionIndex] = useState<DropdownOption>()

  // const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
  //   ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
  //   : new Date().getTime()
  // const currentTime = new Date().getTime()

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  // console.log('--------------------------------')
  const getFarmsWithApy = useCallback(
    (removed: boolean) => {
      const finixPriceVsKlay = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)
      return farmsLP.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return {
            ...farm,
            apyValue: 0,
            totalLiquidityValue: 0,
          }
        }
        const klayApy = new BigNumber(0)
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
          .times(farm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        // const totalKlayRewardPerBlock = new BigNumber(KLAY_PER_BLOCK)
        const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

        /*
        // DO NOT DELETE THIS CODE 
        // DESCRIPTION THIS CODE CALCULATE BUNDLE APR 
        // One day we may have a new bundle.
        // START FN CAL APR BUNDLE

        if ((farm.bundleRewards || []).length > 0) {
          const klayBundle = (farm.bundleRewards || []).find((br) => br.rewardTokenInfo.name === QuoteToken.WKLAY)
          if (klayBundle) {
            // @ts-ignore
            const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
            const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
            const yieldValue = klayPrice.times(klayRewardPerYear)
            let totalValue = farm.lpTotalInQuoteToken
            if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
              totalValue = klayPrice.times(farm.lpTotalInQuoteToken)
            }
            if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
              totalValue = finixPrice.times(farm.lpTotalInQuoteToken)
            }
            if (farm.quoteTokenSymbol === QuoteToken.KETH) {
              totalValue = kethPriceUsd.times(farm.lpTotalInQuoteToken)
            }
            if (farm.quoteTokenSymbol === QuoteToken.SIX) {
              totalValue = sixPrice.times(farm.lpTotalInQuoteToken)
            }
            klayApy = yieldValue.div(totalValue)
          }
        }
        // END FN CAL APR BUNDLE
        */

        // finixPriceInQuote * finixRewardPerYear / lpTotalInQuoteToken

        let apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        if (farm.quoteTokenSymbol === QuoteToken.KUSDT || farm.quoteTokenSymbol === QuoteToken.KDAI) {
          apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
          apy = finixPrice.div(klayPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.KETH) {
          apy = finixPrice.div(kethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
          apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const finixApy =
            farm && finixPriceVsKlay.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = finixApy && dualApy && finixApy.plus(dualApy)
        }

        const finixApy = apy
        /* 
        // DO NOT DELETE THIS CODE 
        // DESCRIPTION THIS CODE CALCULATE BUNDLE APR 
        // One day we may have a new bundle.
        // START FN CAL APR BUNDLE

        const sumApy = BigNumber.sum(finixApy, klayApy)
        */

        let totalLiquidityValue = null
        if (farm.lpTotalInQuoteToken) {
          totalLiquidityValue = convertToPriceFromToken(farm.lpTotalInQuoteToken, farm.quoteTokenSymbol)
        }

        return {
          ...farm,
          apy: finixApy,
          finixApy,
          klayApy,
          apyValue: getBalanceNumber(finixApy),
          totalLiquidityValue: Number(totalLiquidityValue),
        }
      })
    },
    [sixPrice, klayPrice, kethPriceUsd, finixPrice, farmsLP, convertToPriceFromToken],
  )
  const farmsWithApy = useMemo(() => {
    if (!_.compact(farmsLP.map((farm) => farm.lpTotalInQuoteToken)).length) return []
    return getFarmsWithApy(false)
  }, [farmsLP, getFarmsWithApy])
  const targetFarms = useMemo(() => {
    return farmsWithApy.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')
  }, [farmsWithApy])
  const filteredFarms = useMemo(() => {
    return stackedOnly
      ? targetFarms.filter((farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
      : targetFarms
  }, [stackedOnly, targetFarms])
  const orderedFarms = useMemo(() => {
    if (typeof selectedOrderOptionIndex !== 'number') return filteredFarms
    const currentOrder = orderFilter.current.options[selectedOrderOptionIndex]
    return _.orderBy(filteredFarms, currentOrder.id, currentOrder.orderBy)
  }, [filteredFarms, selectedOrderOptionIndex])

  const onSelectAddLP = useCallback((props: any) => {
    setPageState({
      state: 'deposit',
      data: props,
    })
  }, [])
  const onSelectRemoveLP = useCallback((props: any) => {
    setPageState({
      state: 'withdraw',
      data: props,
    })
  }, [])

  const getMyBalancesInWallet = useCallback(
    (tokens: string[]) => {
      return tokens.reduce((result, token) => {
        const obj = {}
        const realTokenAddress = getAddress(token)
        obj[getTokenSymbol(realTokenAddress)] = balances ? _.get(balances, realTokenAddress) : null
        return { ...result, ...obj }
      }, {})
    },
    [balances],
  )

  const fetchAllBalances = useCallback(() => {
    if (balances) return
    if (account && !!targetFarms.length) {
      const allLPaddresses = targetFarms.reduce((addressArray, farm) => {
        return [...addressArray, getAddress(farm.firstToken), getAddress(farm.secondToken)]
      }, [])
      dispatch(fetchBalances(account, _.uniq(allLPaddresses)))
    }
  }, [account, targetFarms, balances, dispatch])

  // useEffect(() => {
  //   if (currentTime < phrase2TimeStamp) {
  //     setTimeout(() => {
  //       setIsPhrase2(true)
  //     }, phrase2TimeStamp - currentTime)
  //   } else {
  //     setIsPhrase2(true)
  //   }
  // }, [currentTime, phrase2TimeStamp])

  useEffect(() => {
    fetchAllBalances()
  }, [fetchAllBalances])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    return () => {
      setStackedOnly(false)
      // setListView(true)
      // setIsPhrase2(false)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Farm - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box className="mt-s28">
        {pageState.state === 'list' && (
          <>
            <TitleSet
              title="Farm"
              description={t('Pairing coins to create LP')}
              linkLabel={t('Learn how to stake')}
              link="https://sixnetwork.gitbook.io/definix-on-klaytn-en/yield-farming/how-to-yield-farm-on-definix"
            />
            <FarmTabButtons
              stackedOnly={stackedOnly}
              setStackedOnly={setStackedOnly}
              defaultOptionIndex={orderFilter.current.defaultIndex}
              orderOptions={orderFilter.current.options}
              orderBy={(index) => setSelectedOrderOptionIndex(index)}
            />
            <Route exact path={`${path}`}>
              {/* {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsList(activeFarms, false)} */}
              {orderedFarms.map((farm) => (
                <FarmCard
                  key={farm.pid}
                  farm={farm}
                  myBalancesInWallet={getMyBalancesInWallet([farm.firstToken, farm.secondToken])}
                  removed={false}
                  klaytn={klaytn}
                  account={account}
                  onSelectAddLP={onSelectAddLP}
                  onSelectRemoveLP={onSelectRemoveLP}
                />
              ))}
            </Route>
            {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
              Help
            </HelpButton> */}
            {/* <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
              <Route exact path={`${path}/history`}>
                {farmsList(inactiveFarms, true)}
              </Route>
            </TimerWrapper> */}
          </>
        )}
        {pageState.state === 'deposit' && (
          <Deposit
            {...pageState.data}
            onBack={() => {
              setPageState({
                state: 'list',
                data: null,
              })
            }}
          />
        )}
        {pageState.state === 'withdraw' && (
          <Withdraw
            {...pageState.data}
            onBack={() => {
              setPageState({
                state: 'list',
                data: null,
              })
            }}
          />
        )}
      </Box>
    </>
  )
}

// const TimerWrapper = ({ isPhrase2, date, children }) => {
//   return isPhrase2 ? (
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
//       <div
//         tabIndex={0}
//         role="button"
//         style={{ opacity: 0.4, pointerEvents: 'none' }}
//         onClick={(e) => {
//           e.preventDefault()
//         }}
//         onKeyDown={(e) => {
//           e.preventDefault()
//         }}
//       >
//         {children}
//       </div>
//     </>
//   )
// }

export default Farms
