import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/FlexLayout'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { useRebalanceAddress, useRebalanceBalances, useRebalanceRewards, useRebalances } from 'state/hooks'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import PageTitle from 'uikitV2/components/PageTitle'
import rebancingImg from 'uikitV2/images/rebalancing.png'
import { getAddress } from 'utils/addressHelpers'
import { Rebalance } from '../../state/types'
import { fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../state/wallet'
import DisclaimersModal from './components/DisclaimersModal'
import ExploreCard from './components/ExploreCard'
import ExploreTabButtons from './components/ExploreTabButtons'
import ExploreDetail from './ExploreDetail'
import Invest from './Invest'
import Withdraw from './Withdraw'

const Explore: React.FC = () => {
  const { path } = useRouteMatch()
  const [listView, setListView] = useState(true)
  const [isInvested, setIsInvested] = useState(false)
  const [selectedRebalance, setSelectedRebalance] = useState<Rebalance | undefined>()
  const rebalances = useRebalances()
  const targetRebalance = useRebalanceAddress(selectedRebalance ? getAddress(selectedRebalance.address) : undefined)
  const dispatch = useDispatch()
  const { account } = useWallet()
  const rebalanceBalances = useRebalanceBalances(account) || {}
  const rebalanceRewards = useRebalanceRewards(account) || {}
  const [onPresentDisclaimersModal] = useModal(<DisclaimersModal isConfirm />, false)
  useEffect(() => {
    if (account) {
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
      dispatch(fetchRebalanceRewards(account, rebalances))
    }
  }, [dispatch, account, rebalances])

  useEffect(() => {
    if (new Date(localStorage.getItem('disclaimerSkipped') || 0).getTime() < new Date().getTime() - 1209600000)
      onPresentDisclaimersModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Explore - Definix - Advance Your Crypto Assets</title>
        </Helmet>

        <PageTitle title="Rebalancing Farm" img={rebancingImg}>
          <ExploreTabButtons isInvested={isInvested} setIsInvested={setIsInvested} />
        </PageTitle>

        <FlexLayout cols={listView ? 1 : 3}>
          {(rebalances || [])
            .filter((r) =>
              !isInvested ? true : (rebalanceBalances[getAddress(r.address)] || new BigNumber(0)).toNumber() > 0,
            )
            .map((rebalance) => {
              return (
                <ExploreCard
                  key={rebalance.title}
                  isHorizontal={listView}
                  rebalance={rebalance}
                  balance={rebalanceBalances[getAddress(rebalance.address)] || new BigNumber(0)}
                  onClickViewDetail={() => {
                    setSelectedRebalance(rebalance)
                  }}
                  pendingReward={rebalanceRewards[getAddress(rebalance.address)] || new BigNumber(0)}
                />
              )
            })}
        </FlexLayout>
      </Route>

      <Route exact path={`${path}/detail`}>
        <ExploreDetail rebalance={selectedRebalance && targetRebalance} />
      </Route>

      <Route exact path={`${path}/invest`}>
        <Invest rebalance={selectedRebalance && targetRebalance} />
      </Route>

      <Route exact path={`${path}/withdraw`}>
        <Withdraw rebalance={selectedRebalance && targetRebalance} />
      </Route>
    </>
  )
}

export default Explore
