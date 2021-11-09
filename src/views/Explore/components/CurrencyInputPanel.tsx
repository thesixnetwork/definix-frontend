/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import React from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { rgba } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { AnountButton, Flex, Text, useMatchBreakpoints } from 'definixswap-uikit'
import { Input as NumericalInput } from './NumericalInput'

interface CurrencyInputPanelProps {
  value: string
  showMaxButton: boolean
  balance?: BigNumber
  id: string
  currency: any
  hideBalance?: boolean
  hideInput?: boolean
  className?: string
  onMax?: () => void
  onQuarter?: () => void
  onHalf?: () => void
  onUserInput: (value: string) => void
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
`
const Coin = styled.div`
  min-width: 80px;
  display: flex;
  align-items: center;
  margin: 4px 0;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`
const StyledAnountButton = styled(AnountButton)`
  margin-left: ${({ theme }) => theme.spacing.S_6}px;
  background: ${({ theme }) => rgba(theme.colors.lightgrey, 0.5)};
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
  onMax,
  onQuarter,
  onHalf,
  onUserInput,
}: CurrencyInputPanelProps) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg

  const thisName = (() => {
    if (currency.symbol === 'WKLAY') return 'KLAY'
    if (currency.symbol === 'WBNB') return 'BNB'
    return currency.symbol
  })()
  return (
    <>
      <Container id={id} hideInput={hideInput} className={className}>
        {!hideInput && (
          <Flex justifyContent="space-between" alignItems="center" className="mb-s12">
            {!currency.hide && (
              <Coin>
                {currency.symbol && <img src={`/images/coins/${currency.symbol}.png`} alt="" />}
                <Text textStyle="R_16M">{thisName}</Text>
              </Coin>
            )}
            {account && !!hideBalance === false && (
              <Text textStyle="R_14R" color="text">
                {t('Balance')}
                <Text as="span" textStyle="R_14B" marginLeft="4px">
                  {!hideBalance && !!currency && balance ? numeral(balance.toNumber()).format('0,0.[0000]') : ' -'}
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
                onUserInput={(val) => {
                  onUserInput(val)
                }}
                style={{ width: isMobile && currency && showMaxButton ? '100%' : 'auto' }}
              />
              {account && currency && showMaxButton && (
                <div className="flex align-center justify-end" style={{ width: isMobile ? '100%' : 'auto' }}>
                  <StyledAnountButton onClick={onQuarter}>25%</StyledAnountButton>
                  <StyledAnountButton onClick={onHalf}>50%</StyledAnountButton>
                  <StyledAnountButton onClick={onMax}>MAX</StyledAnountButton>
                </div>
              )}
            </>
          )}
        </InputBox>
      </Container>
    </>
  )
}

export default CurrencyInputPanel
