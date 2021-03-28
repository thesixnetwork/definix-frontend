import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from 'uikit-dev'
import useI18n from '../../hooks/useI18n'
import exclamation from '../../assets/images/exclamation.png'

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem;
  width: 100%;
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

const StyledErrorMessage = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  margin-top: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.backgroundBox};

  img {
    width: 16px;
    flex-shrink: 0;
  }

  a {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white} !important;
    padding: 0.15rem 1rem;
    border-radius: 32px;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
}) => {
  const TranslateString = useI18n()
  const isBalanceZero = max === '0' || !max

  const displayBalance = isBalanceZero ? '0' : parseFloat(max).toFixed(4)

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" mb="1rem">
          <Text fontSize="14px">{inputTitle}</Text>
          <Text fontSize="14px">
            {TranslateString(1120, 'Balance')}: {displayBalance.toLocaleString()}
          </Text>
        </Flex>
        <Flex alignItems="center">
          <StyledInput onChange={onChange} placeholder="0" value={value} />
          <Button size="sm" onClick={onSelectMax} mr="8px" variant="text" style={{ borderRadius: '6px' }}>
            {TranslateString(452, 'Max')}
          </Button>
          <Text fontSize="16px">{symbol}</Text>
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage>
          <div className="flex align-center">
            <img src={exclamation} alt="" className="mr-2" />
            <Text>No tokens to stake</Text>
          </div>

          {/* <Link fontSize="14px" bold={false} href={addLiquidityUrl}>
            {TranslateString(999, 'Get')} {symbol}
          </Link> */}
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
