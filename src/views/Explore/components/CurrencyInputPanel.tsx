/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'uikit-dev'
import AnountButton from 'uikit-dev/components/AnountButton'
import { Input as NumericalInput } from './NumericalInput'

interface CurrencyInputPanelProps {
  value: string
  showMaxButton: boolean
  balance?: BigNumber
  id: string
  currency: any
  label?: string
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
  background: ${({ theme }) => theme.colors.backgroundBox};
  border-radius: ${({ theme }) => theme.radii.default};
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

const CurrencyInputPanel = ({
  value,
  showMaxButton,
  balance,
  label = 'Input',
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
          <div className="flex justify-space-between mb-1">
            <Text fontSize="14px" color="textSubtle">
              {label}
            </Text>
            {account && !!hideBalance === false && (
              <Text fontSize="14px" color="textSubtle">
                Balance:{' '}
                {!hideBalance && !!currency && balance
                  ? balance.toNumber().toLocaleString('en-US', { maximumFractionDigits: 4 })
                  : ' -'}
              </Text>
            )}
          </div>
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
                style={{ width: isMobile && currency && showMaxButton && label ? '100%' : 'auto' }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <div className="flex align-center justify-end" style={{ width: isMobile ? '100%' : 'auto' }}>
                  <AnountButton title="25%" onClick={onQuarter} />
                  <AnountButton title="50%" onClick={onHalf} />
                  <AnountButton title="MAX" onClick={onMax} />
                </div>
              )}
              {!currency.hide && (
                <Coin>
                  {currency.symbol && <img src={`/images/coins/${currency.symbol}.png`} alt="" />}
                  <Text>{thisName}</Text>
                </Coin>
              )}
            </>
          )}
        </InputBox>
      </Container>
    </>
  )
}

export default CurrencyInputPanel
