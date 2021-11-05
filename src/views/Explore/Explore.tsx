import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/FlexLayout'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { useRebalanceAddress, useRebalances, useRebalanceBalances } from 'state/hooks'
import styled from 'styled-components'
import { Flex, Text, Toggle } from 'definixswap-uikit'
import { Link } from 'uikit-dev'
import Heading from 'uikit-dev/components/Heading/Heading'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import { getAddress } from 'utils/addressHelpers'
import { Rebalance } from '../../state/types'
import { fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import DisclaimersModal from './components/DisclaimersModal'
import ExploreCard from './components/ExploreCard'
import ExploreDetail from './ExploreDetail'
import Invest from './Invest'
import Withdraw from './Withdraw'

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const Explore: React.FC = () => {
  const { path } = useRouteMatch()
  const [isInvested, setIsInvested] = useState(false)
  const [selectedRebalance, setSelectedRebalance] = useState<Rebalance | undefined>()
  const rebalances = useRebalances()
  const targetRebalance = useRebalanceAddress(selectedRebalance ? getAddress(selectedRebalance.address) : undefined)
  const dispatch = useDispatch()
  const { account } = useWallet()
  const rebalanceBalances = useRebalanceBalances(account) || {}
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
        <>
          <div className="mb-5">
            <div className="flex align-center mb-2">
              <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                Rebalancing Farm
              </Heading>
              <div className="mt-2 flex align-center justify-center">
                <Text paddingRight="1">I’m new to this,</Text>
                <TutorailsLink
                  href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/rebalancing-farm/how-to-start-investing-in-rebalancing-farm"
                  target="_blank"
                >
                  Learn to invest.
                </TutorailsLink>
              </div>
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

          <Flex alignItems="center" className="mb-5">
            <Text textStyle="R_14R" paddingRight="2">
              Staked only
            </Text>
            <Toggle checked={isInvested} onChange={() => setIsInvested(!isInvested)} />
          </Flex>

          <FlexLayout cols={1}>
            {(rebalances || [])
              .filter((r) =>
                !isInvested ? true : (rebalanceBalances[getAddress(r.address)] || new BigNumber(0)).toNumber() > 0,
              )
              .map((rebalance) => {
                return (
                  <ExploreCard
                    key={rebalance.title}
                    isHorizontal
                    rebalance={rebalance}
                    balance={rebalanceBalances[getAddress(rebalance.address)] || new BigNumber(0)}
                    onClickViewDetail={() => {
                      setSelectedRebalance(rebalance)
                    }}
                  />
                )
              })}
          </FlexLayout>
        </>
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
