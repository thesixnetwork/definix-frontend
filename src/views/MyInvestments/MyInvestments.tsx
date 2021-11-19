import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import FlexLayout from 'components/layout/FlexLayout'
import useRefresh from 'hooks/useRefresh'
import useFarmsList from 'hooks/useFarmsList'
import usePoolsList from 'hooks/usePoolsList'
import {
  useBalances,
  useRebalances,
  useRebalanceBalances,
  useFarms,
  usePools,
} from 'state/hooks'
import { fetchFarmUserDataAsync } from 'state/actions'
import { fetchBalances, fetchRebalanceBalances } from 'state/wallet'
import { getAddress } from 'utils/addressHelpers'
// import styled from 'styled-components'
import { Text, Box, TitleSet } from 'definixswap-uikit'
// import Flip from '../../uikit-dev/components/Flip'
import CardSummary from './components/CardSummary'
import MyFarmsAndPools from './components/MyFarmsAndPools'

const MyInvestments: React.FC = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const { account }: { account: string; klaytn: provider } = useWallet()

  const dispatch = useDispatch()
  // const { fastRefresh } = useRefresh()

  // const [isPhrase2, setIsPhrase2] = useState(false)

  // const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
  //   ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
  //   : new Date().getTime()
  // const currentTime = new Date().getTime()

  // useEffect(() => {
  //   if (currentTime < phrase2TimeStamp) {
  //     setTimeout(() => {
  //       setIsPhrase2(true)
  //     }, phrase2TimeStamp - currentTime)
  //   } else {
  //     setIsPhrase2(true)
  //   }
  // }, [currentTime, phrase2TimeStamp])

  // farms
  const farms = useFarms()
  const farmsWithApy = useFarmsList(farms)
  const stakedFarms = useMemo(() => {
    return farmsWithApy.reduce((result, farm) => {
      let arr = result
      if (farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)) {
        arr = [
          ...result,
          {
            type: 'farm',
            data: farm,
          },
        ]
      }
      return arr
    }, [])
  }, [farmsWithApy])

  // pools
  const pools = usePools(account)
  const poolsWithApy = usePoolsList({ farms, pools })
  const stakedPools = useMemo(() => {
    return poolsWithApy.reduce((result, pool) => {
      let arr = result
      if (pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)) {
        arr = [
          ...result,
          {
            type: 'pool',
            data: pool,
          },
        ]
      }
      return arr
    }, [])
  }, [poolsWithApy])

  // rebalances
  const rebalances = useRebalances()
  const rebalanceBalances = useRebalanceBalances(account) || {}
  const getRebalanceAddress = (address) => {
    return typeof address === 'string' ? address : getAddress(address)
  }
  const stakedRebalances = rebalances.reduce((result, rebalance) => {
    let arr = result
    const myRebalanceBalance = rebalanceBalances[getRebalanceAddress(rebalance.address)] || new BigNumber(0)
    if ((myRebalanceBalance).toNumber() > 0) {
      arr = [
        ...result,
        {
          type: 'rebalance',
          data: {
            ...rebalance,
            myRebalanceBalance
          },
        },
      ]
    }
    return arr
  }, [])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch])

  useEffect(() => {
    if (account && rebalances) {
      const addressObject = {}
      rebalances.forEach((rebalance) => {
        const assets = rebalance.ratio
        assets.forEach((a) => {
          addressObject[getAddress(a.address)] = true
        })
      })
      dispatch(
        fetchBalances(account, [
          ...Object.keys(addressObject),
          ...rebalances.map((rebalance) => getAddress(rebalance.address)),
        ]),
      )
      dispatch(fetchRebalanceBalances(account, rebalances))
    }
  }, [dispatch, account, rebalances])


  // useEffect(() => {
  //   return () => {
  //     setIsPhrase2(false)
  //     setModalNode(undefined)
  //     setIsOpenModal(false)
  //   }
  // }, [])

  return (
    <>
      <Helmet>
        <title>My investments - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box className="">
        <TitleSet title={t('My Investment')} description={t('Check your investment history and profit')} />
        <Route exact path={`${path}`}>
          <CardSummary />
          <MyFarmsAndPools
            farms={stakedFarms}
            pools={stakedPools}
            rebalances={stakedRebalances}
          />
        </Route>
      </Box>
      {/* <TwoPanelLayout style={{ display: isOpenModal ? 'none' : 'block' }}>
        <LeftPanel isShowRightPanel={false}>
          <MaxWidth>
            <div className="mb-5">
              <div className="flex align-center mb-2">
                <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                  My investments
                </Heading>
              </div>
              <Text>디피닉스에서 예치한 상품들을 모두 확인하세요.</Text>
            </div>

            <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
              <FlexLayout cols={1}>
                <Route exact path={`${path}`}>
                  <CardSummary />
                  <MyFarmsAndPools />
                </Route>
              </FlexLayout>
            </TimerWrapper>
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout> */}
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

export default MyInvestments
