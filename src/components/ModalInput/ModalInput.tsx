import React from 'react'
import {
  Text,
  BalanceInput,
  Box,
  ColorStyles,
  Flex,
  AnountButton,
} from 'definixswap-uikit'
// import { Button, Input, InputProps, Link, Text } from 'uikit-dev'
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
  const displayBalance = isBalanceZero ? '0' : parseFloat(max).toFixed(6)

  return (
    <div>
      <Flex color={ColorStyles.DEEPGREY}>
        <Text textStyle="R_14R">Balance</Text>
        <Text textStyle="R_14B" className="ml-s6">
          {displayBalance.toLocaleString()}
        </Text>
      </Flex>

      {/* <StyledTokenInput isWarning={isBalanceZero}>
        <StyledInput onChange={onChange} placeholder="0" value={value} />
        <Text fontSize="16px">{symbol}</Text>
      </StyledTokenInput> */}

      <Box className="mb-s8" style={{ marginTop: '4px' }}>
        <BalanceInput onChange={onChange} placeholder="0" value={value} />
      </Box>

      <Flex>
        <AnountButton onClick={() => onSelectBalanceRateButton(25)} className="mr-s6">
          25%
        </AnountButton>
        <AnountButton onClick={() => onSelectBalanceRateButton(50)} className="mr-s6">
          50%
        </AnountButton>
        <AnountButton onClick={() => onSelectBalanceRateButton(100)}>MAX</AnountButton>
      </Flex>

      {/* {isBalanceZero && (
        <div className="flex align-center justify-center mt-5">
          <Text color="failure" className="mr-3">
            Not enough LP to stake
          </Text>
          <Button size="sm" variant="secondary" as={Link} href={addLiquidityUrl}>
            Add Liquidity
          </Button>
        </div>
      )} */}
    </div>
  )
}

export default ModalInput
