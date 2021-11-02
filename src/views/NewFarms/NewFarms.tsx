import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { useFarms, usePriceKlayKusdt, usePriceKethKusdt, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'
import styled from 'styled-components'
import FlexLayout from 'components/layout/FlexLayout'
import { Heading, Text, Link } from 'uikit-dev'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import Flip from '../../uikit-dev/components/Flip'
import FarmCard from './components/FarmCard/FarmCard'
import { FarmWithStakedValue } from './components/FarmCard/types'
// import FarmContext from './FarmContext'
import FarmTabButtons from './components/FarmTabButtons'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  background: url(${({ theme }) => theme.colors.backgroundPolygon});
  background-size: cover;
  background-repeat: no-repeat;
`

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`
const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const kethPriceUsd = usePriceKethKusdt()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()

  const [stackedOnly, setStackedOnly] = useState(false)
  const [listView, setListView] = useState(true)
  const [isPhrase2, setIsPhrase2] = useState(false)
  // const [isOpenModal, setIsOpenModal] = useState(false)
  const [pageState, setPageState] = useState<{
    state: string
    data: any
  }>({
    state: 'list',
    data: null,
  }) // 'list', 'deposit', 'remove',
  // const [modal, setModal] =
  //   useState<{
  //     node: React.ReactNode
  //     title: string
  //     description: string
  //   }>()

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')
  // const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier === '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const onSelectAddLP = useCallback((props: any) => {
    console.log('onSelectAddLP', props)
    setPageState({
      state: 'deposit',
      data: props,
    })
  }, [])
  const onSelectRemoveLP = useCallback((props: any) => {
    console.log('onSelectRemoveLP', props)
    setPageState({
      state: 'withdraw',
      data: props,
    })
  }, [])

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  // console.log('--------------------------------')
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const finixPriceVsKlay = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
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

        return { ...farm, apy: finixApy, finixApy, klayApy }
      })

      console.log('>>> farmsToDisplayWithAPY', farmsToDisplayWithAPY)

      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          klayPrice={klayPrice}
          kethPrice={kethPriceUsd}
          sixPrice={sixPrice}
          finixPrice={finixPrice}
          klaytn={klaytn}
          account={account}
          isHorizontal={listView}
          onSelectAddLP={onSelectAddLP}
          onSelectRemoveLP={onSelectRemoveLP}
        />
      ))
    },
    [sixPrice, klayPrice, kethPriceUsd, finixPrice, klaytn, account, listView, onSelectAddLP, onSelectRemoveLP],
  )

  // const handlePresent = useCallback((node: React.ReactNode, options) => {
  //   setModal({
  //     node,
  //     ...options,
  //   })
  //   setIsOpenModal(true)
  //   window.scrollTo(0, 0)
  // }, [])

  // const handleDismiss = useCallback(() => {
  //   setModal(undefined)
  //   setIsOpenModal(false)
  // }, [])

  useEffect(() => {
    if (currentTime < phrase2TimeStamp) {
      setTimeout(() => {
        setIsPhrase2(true)
      }, phrase2TimeStamp - currentTime)
    } else {
      setIsPhrase2(true)
    }
  }, [currentTime, phrase2TimeStamp])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    return () => {
      setStackedOnly(false)
      setListView(true)
      setIsPhrase2(false)
      // setModal(undefined)
      // setIsOpenModal(false)
    }
  }, [])

  return (
    // <FarmContext.Provider
    //   value={{
    //     onPresent: handlePresent,
    //     onDismiss: handleDismiss,
    //   }}
    // >

    //   {isOpenModal && React.isValidElement(modal.node) && (
    //     <ModalWrapper>
    //       <h1>{modal.title}</h1>
    //       <p>{modal.description}</p>
    //       {React.cloneElement(modal.node, {
    //         onDismiss: handleDismiss,
    //       })}
    //     </ModalWrapper>
    //   )}
    // </FarmContext.Provider>
    <>
      <Helmet>
        <title>Farm - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanel isShowRightPanel={false}>
          <MaxWidth>
            {pageState.state === 'list' && (
              <>
                <div className="mb-5">
                  <div className="flex align-center mb-2">
                    <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                      Farm
                    </Heading>
                    <div className="mt-2 flex align-center justify-center">
                      <TutorailsLink
                        href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/yield-farming/how-to-yield-farm-on-definix"
                        target="_blank"
                      >
                        Learn to stake.
                      </TutorailsLink>
                    </div>

                    {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
                        Help
                      </HelpButton> */}
                  </div>
                  <Text>LP를 예치하여 FINIX를 얻으세요.</Text>
                </div>

                <TimerWrapper
                  isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)}
                  date={phrase2TimeStamp}
                >
                  <FarmTabButtons stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} />
                  <FlexLayout cols={listView ? 1 : 3}>
                    <Route exact path={`${path}`}>
                      {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsList(activeFarms, false)}
                    </Route>
                    {/* <Route exact path={`${path}/history`}>
                        {farmsList(inactiveFarms, true)}
                      </Route> */}
                  </FlexLayout>
                </TimerWrapper>
              </>
            )}
            {pageState.state === 'deposit' && (
              <Deposit
                pid={pageState.data.pid}
                tokenName={pageState.data.tokenName}
                tokenBalance={pageState.data.tokenBalance}
                addLiquidityUrl={pageState.data.addLiquidityUrl}
                totalLiquidity={pageState.data.totalLiquidity}
                myLiquidity={pageState.data.myLiquidity}
                myLiquidityUSDPrice={pageState.data.myLiquidityUSDPrice}
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
                pid={pageState.data.pid}
                tokenName={pageState.data.tokenName}
                tokenBalance={pageState.data.tokenBalance}
                addLiquidityUrl={pageState.data.addLiquidityUrl}
                totalLiquidity={pageState.data.totalLiquidity}
                myLiquidity={pageState.data.myLiquidity}
                myLiquidityUSDPrice={pageState.data.myLiquidityUSDPrice}
                onBack={() => {
                  setPageState({
                    state: 'list',
                    data: null,
                  })
                }}
              />
            )}
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout>
    </>
  )
}

const TimerWrapper = ({ isPhrase2, date, children }) => {
  return isPhrase2 ? (
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
      <div
        tabIndex={0}
        role="button"
        style={{ opacity: 0.4, pointerEvents: 'none' }}
        onClick={(e) => {
          e.preventDefault()
        }}
        onKeyDown={(e) => {
          e.preventDefault()
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Farms
