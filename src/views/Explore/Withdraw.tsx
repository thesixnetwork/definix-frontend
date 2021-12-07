/* eslint-disable no-nested-ternary */
import { get } from 'lodash'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import { useDispatch } from 'react-redux'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { BackIcon, Box, Button, Flex, Text, useMatchBreakpoints } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import { useToast } from 'state/hooks'
import { useRebalanceBalances, useBalances } from '../../state/hooks'
import { fetchBalances } from '../../state/wallet'
import { Rebalance } from '../../state/types'

import WithdrawInputCard from './components/WithdrawInputCard'
import SummaryCard, { SummaryItem } from './components/SummaryCard'

interface WithdrawType {
  rebalance: Rebalance | any
}

const Withdraw: React.FC<WithdrawType> = ({ rebalance }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { isMaxSm } = useMatchBreakpoints()
  const isMobile = isMaxSm
  const [tx, setTx] = useState({})
  const { toastSuccess } = useToast()
  const [isInputting, setIsInputting] = useState(true)

  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    return () => {
      setIsInputting(true)
    }
  }, [])

  if (!rebalance) return <Redirect to="/rebalancing" />

  const thisBalance = get(rebalance, 'enableAutoCompound', false) ? rebalanceBalances : balances
  const currentBalance = get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  return (
    <Box maxWidth="630px" mx="auto">
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <Flex className="mb-s20">
        <Button
          variant="text"
          as={Link}
          to="/rebalancing/detail"
          height="24px"
          p="0"
          startIcon={<BackIcon color="textSubtle" />}
        >
          <Text textStyle="R_16R" color="textSubtle">
            {t('Back')}
          </Text>
        </Button>
      </Flex>
      <Text as="h2" textStyle="R_32B" className="mb-s40">
        {t('Withdraw')}
      </Text>

      <div>
        <SummaryCard
          items={[SummaryItem.SHARES, SummaryItem.SHARE_PRICE, SummaryItem.TOTAL_VALUE]}
          rebalance={rebalance}
          isMobile={isMobile}
          currentBalanceNumber={currentBalanceNumber}
          typeB
        />
        <WithdrawInputCard
          setTx={setTx}
          rebalance={rebalance}
          balances={balances}
          rebalanceBalances={rebalanceBalances}
          currentBalance={currentBalance}
          onNext={() => {
            setIsInputting(false)
            toastSuccess(t('Withdraw Complete'))
            history.goBack()
          }}
        />
      </div>
    </Box>
  )
}

export default Withdraw
