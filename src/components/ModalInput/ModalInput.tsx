import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import {
  Text,
  BalanceInput,
  Box,
  ColorStyles,
  Flex,
  AnountButton,
  Noti,
  NotiType,
  Button,
  ButtonVariants,
} from 'definixswap-uikit-v2'
import BalanceText from 'components/BalanceText'

const ButtonWrap = styled(Box)`
  margin-top: ${({ theme }) => theme.spacing.S_40}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: ${({ theme }) => theme.spacing.S_24}px;
  }
`

const ModalInput: React.FC<{
  max: BigNumber
  symbol: string
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  onSelectBalanceRateButton: (rate: number) => void
  buttonName?: string
  onClickButton?: () => void
}> = ({ max, onChange, value, onSelectBalanceRateButton, onClickButton, buttonName }) => {
  const { t } = useTranslation()

  const maxValue = useMemo(() => getBalanceNumber(max), [max])
  const isEmptyBalance = useMemo(() => !value || numeral(value).value() === 0, [value])
  const isGreaterThanMyBalance = useMemo(() => numeral(value).value() > maxValue, [value, maxValue])
  const isValidBalance = useMemo(() => new BigNumber(value).decimalPlaces() <= 18, [value])

  const hasError = useMemo(() => {
    return isEmptyBalance || isGreaterThanMyBalance || !isValidBalance
  }, [isEmptyBalance, isGreaterThanMyBalance, isValidBalance])

  const errorMessage = useMemo(() => {
    if (isEmptyBalance) return t('Insufficient balance')
    if (!isValidBalance) return t('The value entered is out of the valid range')
    if (isGreaterThanMyBalance) return t('Insufficient balance')
    return ''
  }, [t, isEmptyBalance, isGreaterThanMyBalance, isValidBalance])

  const handleButtonClick = useCallback(() => {
    if (hasError) return
    onClickButton()
  }, [hasError, onClickButton])

  return (
    <div>
      <Flex color={ColorStyles.DEEPGREY}>
        <Text textStyle="R_14R">Balance</Text>
        <BalanceText value={maxValue} textStyle="R_14B" ml="S_6" />
      </Flex>

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

      {hasError && (
        <Box className="mt-s12">
          <Noti type={NotiType.ALERT}>{errorMessage}</Noti>
        </Box>
      )}

      <ButtonWrap>
        <Button variant={ButtonVariants.RED} lg onClick={handleButtonClick} width="100%" disabled={hasError}>
          {buttonName}
        </Button>
      </ButtonWrap>
    </div>
  )
}

export default ModalInput
