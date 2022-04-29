import { Currency, CurrencyAmount } from 'definixswap-sdk'
import React, { useCallback, useRef } from 'react'
import { Text, Flex, Coin, AnountButton } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useWallet from 'hooks/useWallet'
import { addCustomToken } from 'utils/caver'

import Loader from '../Loader'
import { MenuItem } from './styleds'
import { useTranslation } from 'react-i18next'
import { AvailableConnectors } from '@fingerlabs/klaytn-wallets'

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

const StyledButton = styled(AnountButton)`
  color: ${({ theme }) => theme.colors.deepgrey};

`

const CurrencyItem: React.FC<IProps> = ({ currency, onSelect, isSelected, otherSelected }) => {
  const { t } = useTranslation()
  const { account, connector } = useWallet()
  const itemRef = useRef(null)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  const addToken = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    addCustomToken((currency as any).address, currency.symbol, currency.decimals, itemRef.current.querySelector('img').src)
  }, [currency, connector])

  return (
    <MenuItem onClick={() => (isSelected ? null : onSelect())} disabled={isSelected} selected={otherSelected}>
      <Flex alignItems="center" ref={itemRef}>
        <Flex alignItems="center" width="110px" className="selected-opacity">
          <Coin size="32px" symbol={currency?.symbol} />
          <Text ml="12px">{currency.symbol}</Text>
        </Flex>
        {(currency as any).address && connector === AvailableConnectors.KAIKAS && <StyledButton onClick={addToken}>{t('Add Token')}</StyledButton>}
      </Flex>
      <Flex justifySelf="flex-end" className="selected-opacity">
        {!account ? <></> : balance ? <Balance balance={balance} /> : <Loader />}
      </Flex>
    </MenuItem>
  )
}

export default React.memo(CurrencyItem)
