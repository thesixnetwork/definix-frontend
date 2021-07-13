import React from 'react'
import { Text } from 'uikit-dev'
import { useWallet } from '@kanthakarn-test/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import usePoolEarning from 'hooks/usePoolEarning'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
}
`

const FinixHarvestPool = () => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const poolEarnings = usePoolEarning()

  const earningsPoolSum = poolEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)

  const earningsBusd = new BigNumber(earningsPoolSum).multipliedBy(usePriceFinixUsd()).toNumber()

  if (!account) {
    return (
      <Text fontSize="24px !important" color="textDisabled" style={{ lineHeight: '76px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={earningsPoolSum} lineHeight="1.5" color="textInvert" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

export default FinixHarvestPool
