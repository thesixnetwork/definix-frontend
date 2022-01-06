import { Currency, CurrencyAmount, currencyEquals } from 'definixswap-sdk'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Coin } from '@fingerlabs/definixswap-uikit-v2'

import Loader from '../Loader'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { MenuItem } from './styleds'

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return (
    <StyledBalanceText textStyle="R_16R" title={balance.toExact()}>
      {balance.toSignificant(4)}
    </StyledBalanceText>
  )
}

const CurrencyRow = React.memo(({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) => {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, currency)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <Flex alignItems="center">
        <Coin size="32px" symbol={currency?.symbol} />
        <Text ml="12px">{currency.symbol}</Text>
      </Flex>
      <Flex justifySelf="flex-end">{!account ? <></> : balance ? <Balance balance={balance} /> : <Loader />}</Flex>
    </MenuItem>
  )
});

export default function CurrencyList({
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
}: {
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
}) {
  return (
    <Box height="auto">
      {currencies.map((item) => {
        const currency = item
        return (
          <CurrencyRow
            key={item.symbol}
            style={{}}
            currency={currency}
            isSelected={Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))}
            onSelect={() => onCurrencySelect(currency)}
            otherSelected={Boolean(otherCurrency && currencyEquals(otherCurrency, currency))}
          />
        )
      })}
    </Box>
  )
}
