import { Currency, CurrencyAmount } from 'definixswap-sdk'
import React from 'react'
import { Text, Flex, Coin } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useWallet from 'hooks/useWallet';

import Loader from '../Loader'
import { MenuItem } from './styleds'

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

interface IProps {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
}

const Balance = React.memo(({ balance }: { balance: CurrencyAmount }) => {
  return (
    <StyledBalanceText textStyle="R_16R" title={balance.toExact()}>
      {balance.toSignificant(4)}
    </StyledBalanceText>
  )
})

const CurrencyItem: React.FC<IProps> = ({ currency, onSelect, isSelected, otherSelected }) => {
  const { account } = useWallet()
  const balance = useCurrencyBalance(account ?? undefined, currency)

  return (
    <MenuItem onClick={() => (isSelected ? null : onSelect())} disabled={isSelected} selected={otherSelected}>
      <Flex alignItems="center">
        <Coin size="32px" symbol={currency?.symbol} />
        <Text ml="12px">{currency.symbol}</Text>
      </Flex>
      <Flex justifySelf="flex-end">{!account ? <></> : balance ? <Balance balance={balance} /> : <Loader />}</Flex>
    </MenuItem>
  )
}

export default React.memo(CurrencyItem)
