import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/FlexLayout'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { useRebalanceAddress, useRebalances, useRebalanceBalances, useRebalanceRewards } from 'state/hooks'
import styled from 'styled-components'
import Heading from 'uikit-dev/components/Heading/Heading'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import { getAddress } from 'utils/addressHelpers'
import { Rebalance } from '../../state/types'
import { fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../state/wallet'
import DisclaimersModal from './components/DisclaimersModal'
import ExploreCard from './components/ExploreCard'
import ExploreTabButtons from './components/ExploreTabButtons'
import ExploreDetail from './ExploreDetail'
import Invest from './Invest'
import Withdraw from './Withdraw'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

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
    // if (new Date(localStorage.getItem('disclaimerSkipped') || 0).getTime() < new Date().getTime() - 1209600000)
    onPresentDisclaimersModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Explore - Definix - Advance Your Crypto Assets</title>
        </Helmet>
        <TwoPanelLayout>
          <LeftPanel isShowRightPanel={false}>
            <MaxWidth>
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                    Rebalancing Farm
                  </Heading>

                  {/* <HelpButton
                    size="sm"
                    variant="secondary"
                    className="px-2"
                    startIcon={<HelpCircle className="mr-2" />}
                  >
                    Help
                  </HelpButton> */}
                </div>
                {/* <Text>
                  You can invest your tokens in our farms on this list. Every farms is administered by a
                  DEFINIX-certified farm manager.
                </Text> */}
              </div>

              <ExploreTabButtons
                listView={listView}
                setListView={setListView}
                isInvested={isInvested}
                setIsInvested={setIsInvested}
              />

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
            </MaxWidth>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>

      <Route exact path={`${path}/detail`}>
        <ExploreDetail rebalance={selectedRebalance && targetRebalance} />
      </Route>

      {/* <Route exact path={`${path}/invest`}>
        <Invest rebalance={selectedRebalance && targetRebalance} />
      </Route>

      <Route exact path={`${path}/withdraw`}>
        <Withdraw rebalance={selectedRebalance && targetRebalance} />
      </Route> */}
    </>
  )
}

export default Explore
