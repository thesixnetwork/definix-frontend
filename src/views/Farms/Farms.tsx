/* eslint-disable no-nested-ternary */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import FlexLayout from 'components/layout/FlexLayout'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { fetchFarmUserDataAsync } from 'state/actions'
import { useFarms, usePriceBnbBusd, usePriceEthBusd, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'
import styled from 'styled-components'
import PageTitle from 'uikitV2/components/PageTitle'
import farmImg from 'uikitV2/images/farm.png'
import { provider } from 'web3-core'
import Flip from '../../uikit-dev/components/Flip'
import FarmCard from './components/FarmCard/FarmCard'
import { FarmWithStakedValue } from './components/FarmCard/types'
import FarmTabButtons from './components/FarmTabButtons'
import FarmContext from './FarmContext'
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

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const bnbPrice = usePriceBnbBusd()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const ethPriceUsd = usePriceEthBusd()
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  const [liveOnly, setLiveOnly] = useState(true)
  const [stackedOnly, setStackedOnly] = useState(false)
  const [listView, setListView] = useState(true)
  const [isPhrase2, setIsPhrase2] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [search, setSearch] = useState('')
  const [modalNode, setModalNode] = useState<React.ReactNode>()
  const [allDisplayChiose, setAllDisplayChiose] = useState([
    { key: 'Recommend', value: 'sortOrder' },
    { key: 'APR', value: 'apr' },
    { key: 'Total staked', value: 'total' },
  ])
  const [selectDisplay, setSelectDisplay] = useState('sortOrder')

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 25 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 25 && farm.multiplier === '0X')
  const stackedOnlyFarms = farmsLP.filter(
    (farm) =>
      farm.userData && farm.pid !== 0 && farm.pid !== 25 && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const finixPriceVsBNB = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)
      let array = farmsToDisplay
      if (selectDisplay === 'apr') {
        array = _.sortBy(array, (farm) => {
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

          if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
            apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
          } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
            apy = finixPrice.div(ethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
          } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
            apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
          } else if (farm.quoteTokenSymbol === QuoteToken.BNB) {
            apy = finixPrice.div(bnbPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
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
          return apy.times(-1).toFixed()
        })
      }
      if (selectDisplay === 'total') {
        array = _.sortBy(array, (farm) => {
          if (!farm.lpTotalInQuoteToken) {
            return null
          }
          if (farm.quoteTokenSymbol === QuoteToken.BNB) {
            // console.log('farm.lpSymbol', farm.lpSymbol)
            // console.log(
            //   'return bnbPrice.times(farm.lpTotalInQuoteToken).toFixed()',
            //   bnbPrice.times(farm.lpTotalInQuoteToken).toFixed(),
            // )
            return bnbPrice.times(farm.lpTotalInQuoteToken).times(-1).toFixed()
          }
          if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
            // console.log('farm.lpSymbol', farm.lpSymbol)
            // console.log(
            //   'finixPrice.times(farm.lpTotalInQuoteToken).toFixed()',
            //   finixPrice.times(farm.lpTotalInQuoteToken).toFixed(),
            // )
            return finixPrice.times(farm.lpTotalInQuoteToken).times(-1).toFixed()
          }
          if (farm.quoteTokenSymbol === QuoteToken.ETH) {
            // console.log('farm.lpSymbol', farm.lpSymbol)
            // console.log(
            //   'ethPriceUsd.times(farm.lpTotalInQuoteToken).toFixed()',
            //   ethPriceUsd.times(farm.lpTotalInQuoteToken).toFixed(),
            // )
            return ethPriceUsd.times(farm.lpTotalInQuoteToken).times(-1).toFixed()
          }
          if (farm.quoteTokenSymbol === QuoteToken.SIX) {
            // console.log('farm.lpSymbol', farm.lpSymbol)
            // console.log(
            //   'sixPrice.times(farm.lpTotalInQuoteToken).toFixed()',
            //   sixPrice.times(farm.lpTotalInQuoteToken).toFixed(),
            // )
            return sixPrice.times(farm.lpTotalInQuoteToken).times(-1).toFixed()
          }
        })
      }
      if (search.length > 0) {
        array = array.filter((farm) => {
          return String(farm.lpSymbol).toLowerCase().includes(search)
        })
      }
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = array.map((farm) => {
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

        if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
          apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          apy = finixPrice.div(ethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          apy = finixPrice.div(bnbPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
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
          bnbPrice={bnbPrice}
          ethPrice={ethPriceUsd}
          sixPrice={sixPrice}
          finixPrice={finixPrice}
          ethereum={ethereum}
          account={account}
          isHorizontal={listView}
        />
      ))
    },
    [sixPrice, bnbPrice, ethPriceUsd, finixPrice, ethereum, account, listView, selectDisplay, search],
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

  const farmsLiveOnly = (live) => {
    return live ? farmsList(activeFarms, false) : farmsList(inactiveFarms, false)
  }

  const [pageState, setPageState] = useState('list')
  const [pageData, setPageData] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pageState])

  useEffect(() => {
    if (typeof account !== 'string') {
      setPageState('list')
      setPageData(null)
    }
  }, [account])

  return (
    <FarmContext.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
        pageState,
        pageData,
        goDeposit: (data) => {
          setPageState('deposit')
          setPageData(data)
        },
        goWithdraw: (data) => {
          setPageState('withdraw')
          setPageData(data)
        },
      }}
    >
      <Helmet>
        <title>Farm - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
        {pageState === 'list' && (
          <>
            <PageTitle
              title="Farm"
              caption="Pairing coins to create LP and depositing on the farm will give you a high rate of interest."
              linkLabel="Learn how to stake in Farm"
              link="https://sixnetwork.gitbook.io/definix/yield-farming/how-to-yield-farm-on-definix"
              img={farmImg}
            />
            <FarmTabButtons
              stackedOnly={stackedOnly}
              setStackedOnly={setStackedOnly}
              liveOnly={liveOnly}
              setLiveOnly={setLiveOnly}
              listView={listView}
              setListView={setListView}
              selectDisplay={selectDisplay}
              allDisplayChiose={allDisplayChiose}
              setSelectDisplay={setSelectDisplay}
              search={setSearch}
            />
            <FlexLayout cols={listView ? 1 : 3}>
              <Route exact path={`${path}`}>
                {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsLiveOnly(liveOnly)}
              </Route>
              <Route exact path={`${path}/history`}>
                {farmsList(inactiveFarms, true)}
              </Route>
            </FlexLayout>
          </>
        )}

        {pageState === 'deposit' && (
          <>
            <Deposit
              {...pageData}
              onBack={() => {
                setPageState('list')
                setPageData(null)
              }}
            />
          </>
        )}

        {pageState === 'withdraw' && (
          <>
            <Withdraw
              {...pageData}
              onBack={() => {
                setPageState('list')
                setPageData(null)
              }}
            />
          </>
        )}
      </TimerWrapper>

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
