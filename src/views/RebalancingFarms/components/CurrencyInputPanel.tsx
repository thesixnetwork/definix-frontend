/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { rgba } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { AnountButton, Flex, Noti, NotiType, Text, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { getTokenName } from 'utils/getTokenSymbol'
import useWallet from 'hooks/useWallet'
import { Input as NumericalInput } from './NumericalInput'
import CoinWrap from './CoinWrap'

interface CurrencyInputPanelProps {
  value: string
  showMaxButton: boolean
  balance?: BigNumber
  id: string
  currency: any
  hideBalance?: boolean
  hideInput?: boolean
  className?: string
  max?: BigNumber
  decimals?: number
  onUserInput: (value: string) => void
  setError?: (error: boolean, currency: any) => void
}

const Container = styled.div<{ hideInput: boolean }>``

const InputBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .token-amount-input {
    color: ${({ theme }) => theme.colors.black};
  }
`

const StyledAnountButton = styled(AnountButton)`
  margin-left: ${({ theme }) => theme.spacing.S_6}px;
  background: ${({ theme }) => rgba(theme.colors.lightgrey, 0.3)};
`

const CurrencyInputPanel = ({
  value,
  showMaxButton,
  balance,
  currency,
  hideBalance = false,
  hideInput = false,
  id,
  className,
  max,
  decimals = 18,
  onUserInput,
  setError,
}: CurrencyInputPanelProps) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const { isMaxSm } = useMatchBreakpoints()
  const isMobile = isMaxSm

  const thisName = useMemo(() => getTokenName(currency?.symbol), [currency.symbol])
  const overDp = useMemo(() => new BigNumber(value).decimalPlaces() > decimals, [value, decimals])
  const isGreaterThanMyBalance = useMemo(() => new BigNumber(value).gt(max), [value, max])
  const error = useMemo(() => isGreaterThanMyBalance || overDp, [isGreaterThanMyBalance, overDp])

  const handleInput = useCallback(
    (str: string) => {
      onUserInput(str)
    },
    [onUserInput],
  )

  const handleClick = useCallback(
    (ratio: number) => {
      onUserInput(ratio === 1 ? max.toFixed(5, 1) : String(+max.toFixed(5, 1) * ratio))
    },
    [max, onUserInput],
  )

  useEffect(() => {
    if (typeof setError === 'function') {
      setError(error, currency)
    }
  }, [error, setError, currency])

  return (
    <Container id={id} hideInput={hideInput} className={className}>
      {!hideInput && (
        <Flex justifyContent="space-between" alignItems="center" mb={isMobile ? 'S_8' : 'S_12'}>
          {!currency.hide && (
            <CoinWrap symbol={currency.symbol} size="lg" spacing="S_12">
              <Text textStyle="R_16M">{thisName}</Text>
            </CoinWrap>
          )}
          {account && !!hideBalance === false && (
            <Text textStyle="R_14R" color="text">
              {isMobile || t('Balance')}
              <Text as="span" textStyle="R_14B" marginLeft="4px">
                {!hideBalance && !!currency && balance
                  ? balance.toNumber() > 0
                    ? numeral(balance.toFixed(5, 1)).format('0,0.0[00000]')
                    : '0'
                  : ' -'}
              </Text>
            </Text>
          )}
        </Flex>
      )}

      <InputBox style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}>
        {!hideInput && (
          <>
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={handleInput}
              style={isMobile && currency && showMaxButton ? { width: '100%', marginBottom: '4px' } : { width: 'auto' }}
            />
            {account && currency && showMaxButton && (
              <div className="flex align-center justify-end" style={{ width: isMobile ? '100%' : 'auto' }}>
                <StyledAnountButton onClick={() => handleClick(0.25)}>25%</StyledAnountButton>
                <StyledAnountButton onClick={() => handleClick(0.5)}>50%</StyledAnountButton>
                <StyledAnountButton onClick={() => handleClick(1)}>MAX</StyledAnountButton>
              </div>
            )}
          </>
        )}
      </InputBox>
      {overDp ? (
        <Noti mt="S_12" type={NotiType.ALERT}>
          {t('The value entered is out of the valid range')}
        </Noti>
      ) : (
        isGreaterThanMyBalance && (
          <Noti mt="S_12" type={NotiType.ALERT}>
            {t('Insufficient balance')}
          </Noti>
        )
      )}
    </Container>
  )
}

export default CurrencyInputPanel
