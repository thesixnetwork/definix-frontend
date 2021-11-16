import React, { useMemo } from 'react'
import { Text, BalanceInput, Box, ColorStyles, Flex, AnountButton, Noti, NotiType } from 'definixswap-uikit'

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
  onChange,
  value,
  onSelectBalanceRateButton,
}) => {
  const isBalanceZero = max === '0' || !max
  const displayBalance = isBalanceZero ? '0' : parseFloat(max).toFixed(6)

  const isGreaterThanMyBalance = useMemo(() => value > max, [value, max])

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

      {
        isGreaterThanMyBalance && (
          <Box className="mt-s20">
            <Noti type={NotiType.ALERT}>Insufficient balance</Noti>
          </Box>
        )
      }

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
