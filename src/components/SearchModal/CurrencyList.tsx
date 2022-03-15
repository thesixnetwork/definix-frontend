import React from 'react'
import { Currency, currencyEquals } from 'definixswap-sdk'
import { Box } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyItem from './CurrencyItem'
import styled from 'styled-components'

const Wrap = styled(Box)`
  height: auto;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 0 20px;
  }
`

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
    <Wrap>
      {currencies.map((item) => {
        const currency = item
        return (
          <CurrencyItem
            key={item.symbol}
            currency={currency}
            isSelected={Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))}
            onSelect={() => onCurrencySelect(currency)}
            otherSelected={Boolean(otherCurrency && currencyEquals(otherCurrency, currency))}
          />
        )
      })}
    </Wrap>
  )
}
