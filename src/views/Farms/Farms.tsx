import { useWallet } from '@kanthakarn-test/klaytn-use-wallet'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/FlexLayout'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { fetchFarmUserDataAsync } from 'state/actions'
import { useFarms, usePriceKlayKusdt, usePriceKethKusdt, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { provider } from 'web3-core'
import Flip from '../../uikit-dev/components/Flip'
import FarmCard from './components/FarmCard/FarmCard'
import { FarmWithStakedValue } from './components/FarmCard/types'
import FarmTabButtons from './components/FarmTabButtons'
import FarmContext from './FarmContext'

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

const Farms: React.FC = () => {
  const { t } = useTranslation()
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
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier === '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
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
        let klayApy = new BigNumber(0)
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
          .times(farm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        // const totalKlayRewardPerBlock = new BigNumber(KLAY_PER_BLOCK)
        const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

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
        const sumApy = BigNumber.sum(finixApy, klayApy)
        // console.log('farm', farm.lpSymbol)
        // console.log('sumApy', sumApy.toNumber())
        // console.log('finixApy', finixApy.toNumber())
        // console.log('klayApy', klayApy.toNumber())
        return { ...farm, apy: sumApy, finixApy, klayApy }
      })

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
        />
      ))
    },
    [sixPrice, klayPrice, kethPriceUsd, finixPrice, klaytn, account, listView],
  )

  const handlePresent = useCallback((node: React.ReactNode) => {
    setModalNode(node)
    setIsOpenModal(true)
    window.scrollTo(0, 0)
  }, [])

  const handleDismiss = useCallback(() => {
    setModalNode(undefined)
    setIsOpenModal(false)
  }, [])

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
      setModalNode(undefined)
      setIsOpenModal(false)
    }
  }, [])

  return (
    <FarmContext.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      <Helmet>
        <title>{t('Farm - Definix - Advance Your Crypto Assets')}</title>
      </Helmet>
      <TwoPanelLayout style={{ display: isOpenModal ? 'none' : 'block' }}>
        <LeftPanel isShowRightPanel={false}>
          <MaxWidth>
            <div className="mb-5">
              <div className="flex align-center mb-2">
                <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                  {t('Farm')}
                </Heading>

                {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
                  Help
                </HelpButton> */}
              </div>
              <Text>
                {t(
                  'Farm is a place you can stake your LP tokens in order to generate high returns in the form of FINIX.',
                )}
                <br />
                {t('The amount of returns will be calculated by the annual percentage rate (APR).')}
              </Text>
            </div>

            <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
              <FarmTabButtons
                stackedOnly={stackedOnly}
                setStackedOnly={setStackedOnly}
                listView={listView}
                setListView={setListView}
              />

              <FlexLayout cols={listView ? 1 : 3}>
                <Route exact path={`${path}`}>
                  {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsList(activeFarms, false)}
                </Route>
                <Route exact path={`${path}/history`}>
                  {farmsList(inactiveFarms, true)}
                </Route>
              </FlexLayout>
            </TimerWrapper>
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout>

      {isOpenModal && React.isValidElement(modalNode) && (
        <ModalWrapper>
          {React.cloneElement(modalNode, {
            onDismiss: handleDismiss,
          })}
        </ModalWrapper>
      )}
    </FarmContext.Provider>
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
