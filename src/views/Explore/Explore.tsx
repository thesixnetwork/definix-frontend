import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { useRebalanceAddress, useRebalances, useRebalanceBalances } from 'state/hooks'
import { Box, Flex, Text, TitleSet, Toggle, useModal } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import { getAddress } from 'utils/addressHelpers'

import { Rebalance } from '../../state/types'
import { fetchBalances, fetchRebalanceBalances } from '../../state/wallet'

import DisclaimersModal from './components/DisclaimersModal'
import ExploreCard from './components/ExploreCard'
import ExploreDetail from './ExploreDetail'
import Invest from './Invest'
import Withdraw from './Withdraw'

const Explore: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
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
          <Box marginBottom="48px">
            <TitleSet
              title={t('Rebalancing Farm')}
              description={t('A Farm that automatically performs')}
              linkLabel={t('Learn how to invest')}
              link="https://sixnetwork.gitbook.io/definix-on-klaytn-en/rebalancing-farm/how-to-start-investing-in-rebalancing-farm"
            />
          </Box>

          <Flex alignItems="center" mb="S_28">
            <Flex alignItems="center">
              <Text textStyle="R_14R" color="deepgrey" mr="S_8">
                {t('Staked only Farm')}
              </Text>
              <Toggle checked={isInvested} onChange={() => setIsInvested(!isInvested)} />
            </Flex>
          </Flex>

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
