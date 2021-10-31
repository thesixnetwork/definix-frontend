import { Currency, Pair } from 'definixswap-sdk'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, Text, useMatchBreakpoints } from 'uikit-dev'
import AnountButton from 'uikit-dev/components/AnountButton'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { TranslateString } from '../../utils/translateTextHelpers'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Input as NumericalInput } from '../NumericalInput'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import TranslatedText from '../TranslatedText'

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
const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 32px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: ${({ theme }) => theme.radii.default};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
interface CurrencyInputPanelProps {
  value: string
  showMaxButton: boolean
  label?: string
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  className?: string
  onMax?: () => void
  onQuarter?: () => void
  onHalf?: () => void
  onUserInput: (value: string) => void
  onCurrencySelect?: (currency: Currency) => void
}

export default function CurrencyInputPanel({
  value,
  showMaxButton,
  label = TranslateString(132, 'Input'),
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  className,
  onMax,
  onQuarter,
  onHalf,
  onUserInput,
  onCurrencySelect,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <>
      <Container id={id} hideInput={hideInput} className={className}>
        {!hideInput && (
          <div className="flex justify-space-between mb-1">
            <Text fontSize="14px" color="textSubtle">
              {label}
            </Text>
            {account && (
              <Text fontSize="14px" color="textSubtle">
                Balance:{' '}
                {!hideBalance && !!currency && selectedCurrencyBalance
                  ? selectedCurrencyBalance?.toSignificant(6)
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
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length
                      )}`
                    : currency?.symbol) || <TranslatedText translationId={82}>Select Token</TranslatedText>}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Aligner>
          </CurrencySelect>
        </InputBox>
      </Container>

      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </>
  )
}
