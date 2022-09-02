import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import React, { useMemo, useCallback } from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import { Text, BalanceInput, Box, ColorStyles, Flex, Noti, NotiType } from '@fingerlabs/definixswap-uikit-v2'
import BalanceText from 'components/Text/BalanceText'
import { mediaQueries, spacing } from 'uikitV2/base'
import { Button, Chip } from '@mui/material'
import { textStyle } from 'uikitV2/text'

const ButtonWrap = styled(Box)`
  margin-top: ${spacing.S_40}px;
  ${mediaQueries.mobileXl} {
    margin-top: ${spacing.S_24}px;
  }
`

const ModalInput: React.FC<{
  type: string // deposit, withdraw
  max: BigNumber
  value: string
  balanceLabel?: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  onSelectBalanceRateButton: (rate: number) => void
  buttonName?: string
  onClickButton?: () => void
}> = ({
  balanceLabel = 'Balance',
  type,
  max,
  onChange,
  value,
  onSelectBalanceRateButton,
  onClickButton,
  buttonName,
}) => {
  const maxValue = useMemo(() => getBalanceNumber(max), [max])
  const isEmptyBalance = useMemo(() => numeral(value).value() === 0, [value])
  const isGreaterThanMyBalance = useMemo(() => numeral(value).value() > maxValue, [value, maxValue])
  const isValidBalance = useMemo(() => new BigNumber(value).decimalPlaces() <= 18, [value])

  const hasError = useMemo(() => {
    return isEmptyBalance || isGreaterThanMyBalance || !isValidBalance
  }, [isEmptyBalance, isGreaterThanMyBalance, isValidBalance])

  const insufficientBalanceMessage = useMemo(() => {
    return type === 'deposit' ? 'Insufficient balance' : 'Insufficient deposit'
  }, [type])

  const errorMessage = useMemo(() => {
    if (isEmptyBalance) return insufficientBalanceMessage
    if (!isValidBalance) return 'The value entered is out of the valid range'
    if (isGreaterThanMyBalance) return 'insufficientBalanceMessage'
    return ''
  }, [isEmptyBalance, isGreaterThanMyBalance, isValidBalance, insufficientBalanceMessage])

  const handleButtonClick = useCallback(() => {
    if (hasError) return
    onClickButton()
  }, [hasError, onClickButton])

  return (
    <div>
      <Flex style={{ color: '#666' }}>
        <Text style={textStyle.R_14R}>{balanceLabel}</Text>
        <BalanceText value={maxValue} style={{ ...textStyle.R_14B, marginLeft: 6 }} />
      </Flex>

      <Box style={{ marginTop: 4, marginBottom: 8 }}>
        <BalanceInput onChange={onChange} placeholder="0" value={value} />
      </Box>

      <Flex>
        <Chip
          label="25%"
          size="small"
          variant="outlined"
          color={value === '25' ? 'primary' : 'info'}
          onClick={() => onSelectBalanceRateButton(25)}
          sx={{ mr: '6px', background: 'transparent' }}
        />
        <Chip
          label="50%"
          size="small"
          variant="outlined"
          color={value === '50' ? 'primary' : 'info'}
          onClick={() => onSelectBalanceRateButton(50)}
          sx={{ mr: '6px', background: 'transparent' }}
        />
        <Chip
          label="MAX"
          size="small"
          variant="outlined"
          color={value === '100' ? 'primary' : 'info'}
          onClick={() => onSelectBalanceRateButton(100)}
          sx={{ mr: '6px', background: 'transparent' }}
        />
      </Flex>

      {hasError && (
        <Box style={{ marginTop: 12 }}>
          <Noti type={NotiType.ALERT}>{errorMessage}</Noti>
        </Box>
      )}

      <ButtonWrap>
        <Button
          variant="contained"
          color="error"
          style={{ width: '100%' }}
          onClick={handleButtonClick}
          disabled={hasError || value === ''}
        >
          {buttonName}
        </Button>
      </ButtonWrap>
    </div>
  )
}

export default ModalInput
