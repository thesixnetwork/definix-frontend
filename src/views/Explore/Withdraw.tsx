/* eslint-disable no-nested-ternary */
import { get } from 'lodash'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import { useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { BackIcon, Box, Button, Flex, Text, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import PageTitle from 'components/PageTitle'
import useWallet from 'hooks/useWallet'
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
  const [, setTx] = useState({})
  const [, setIsInputting] = useState(true)

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
      <PageTitle text={t('Withdraw')} desc={t('Withdraw your investment and get')} small={isMobile} />

      <div>
        <SummaryCard
          items={[SummaryItem.SHARES, SummaryItem.SHARE_PRICE, SummaryItem.TOTAL_VALUE]}
          rebalance={rebalance}
          isMobile={isMobile}
          currentBalanceNumber={currentBalanceNumber}
          typeB
        />
        <WithdrawInputCard
          isMobile={isMobile}
          setTx={setTx}
          rebalance={rebalance}
          balances={balances}
          rebalanceBalances={rebalanceBalances}
          currentBalance={currentBalance}
          onNext={() => {
            setIsInputting(false)
            history.goBack()
          }}
        />
      </div>
    </Box>
  )
}

export default Withdraw
