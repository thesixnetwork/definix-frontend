import React from 'react'
import styled from 'styled-components'
import { Button, Input, InputProps, Link, Text } from 'uikit-dev'
import useI18n from '../../hooks/useI18n'

interface ModalInputProps {
  max: string
  symbol: string
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  onSelectBalanceRateButton: (rate: number) => void
}

const StyledTokenInput = styled.div<InputProps>`
  background: ${({ theme }) => theme.colors.backgroundBox};
  border-radius: ${({ theme }) => theme.radii.default};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ isWarning, theme }) => (isWarning ? theme.colors.failure : theme.colors.backgroundBox)};
  padding: 0.5rem 1rem;
  width: 100%;
  display: flex;
  align-items: center;
`

const StyledInput = styled(Input)`
  box-shadow: none !important;
  border: none;
  width: 60px;
  height: auto;
  margin: 0;
  padding: 0;
  background: transparent;
  ::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  value,
  addLiquidityUrl,
  inputTitle,
  onSelectBalanceRateButton,
}) => {
  const TranslateString = useI18n()
  const isBalanceZero = max === '0' || !max
  const displayBalance = isBalanceZero ? '0' : parseFloat(max).toFixed(4)

  return (
    <div>
      <div className="flex justify-space-between mb-1">
        <Text fontSize="14px" color="textSubtle">
          {inputTitle}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(1120, 'Balance')}: {displayBalance.toLocaleString()}
        </Text>
      </div>

      <StyledTokenInput isWarning={isBalanceZero}>
        <StyledInput onChange={onChange} placeholder="0" value={value} />

        {/* <Text fontSize="16px">{symbol}</Text> */}
      </StyledTokenInput>

      <Button
        size="sm"
        onClick={() => onSelectBalanceRateButton(25)}
        mr="8px"
        padding="0 12px"
        variant="tertiary"
        style={{ borderRadius: '6px' }}
      >
        25%
      </Button>
      <Button
        size="sm"
        onClick={() => onSelectBalanceRateButton(50)}
        mr="8px"
        padding="0 12px"
        variant="tertiary"
        style={{ borderRadius: '6px' }}
      >
        50%
      </Button>
      <Button
        size="sm"
        onClick={() => onSelectBalanceRateButton(100)}
        mr="8px"
        padding="0 12px"
        variant="tertiary"
        style={{ borderRadius: '6px' }}
      >
        {TranslateString(452, 'Max')}
      </Button>

      {isBalanceZero && (
        <div className="flex align-center justify-center mt-5">
          <Text color="failure" className="mr-3">
            Not enough LP to stake
          </Text>
          <Button size="sm" variant="secondary" as={Link} href={addLiquidityUrl}>
            Add Liquidity
          </Button>
        </div>
      )}
    </div>
  )
}

export default ModalInput
