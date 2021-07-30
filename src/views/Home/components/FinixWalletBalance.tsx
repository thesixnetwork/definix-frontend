import React from 'react'
import { Text } from 'uikit-dev'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useTokenBalance from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceFinixKusdt } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const FinixWalletBalance = () => {
  const { t } = useTranslation()
  const finixBalance = useTokenBalance(getFinixAddress())
  const busdBalance = new BigNumber(getBalanceNumber(finixBalance)).multipliedBy(usePriceFinixKusdt()).toNumber()
  const { account } = useWallet()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '54px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <>
      <CardValue value={getBalanceNumber(finixBalance)} decimals={4} fontSize="24px" lineHeight="36px" />
      <CardBusdValue value={busdBalance} />
    </>
  )
}

export default FinixWalletBalance
