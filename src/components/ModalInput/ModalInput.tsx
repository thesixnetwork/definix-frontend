import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useConverter from 'hooks/useConverter'
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
} from 'definixswap-uikit'

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
}> = ({
  max,
  onChange,
  value,
  onSelectBalanceRateButton,
  onClickButton,
  buttonName,
}) => {
  const { t } = useTranslation()
  const { convertToBalanceFormat } = useConverter()

  const isGreaterThanMyBalance = useMemo(() => new BigNumber(value).isGreaterThan(max), [value, max])
  const isValidBalance = useMemo(() => {
    return new BigNumber(value).times(new BigNumber(10).pow(18)).isInteger()
  }, [value])

  return (
    <div>
      <Flex color={ColorStyles.DEEPGREY}>
        <Text textStyle="R_14R">Balance</Text>
        <Text textStyle="R_14B" className="ml-s6">
          {convertToBalanceFormat(getBalanceNumber(max))}
        </Text>
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

      {isGreaterThanMyBalance && (
        <Box className="mt-s20">
          <Noti type={NotiType.ALERT}>{t('Insufficient balance')}</Noti>
        </Box>
      )}

      <ButtonWrap>
        <Button
          variant={ButtonVariants.RED}
          lg
          onClick={() => onClickButton()}
          width="100%"
          disabled={!value || value === '0' || !isValidBalance}
        >
          {buttonName}
        </Button>
        {!isValidBalance && (
          <Box className="mt-s12">
            <Noti type={NotiType.ALERT}>{t('Less than a certain amount')}</Noti>
          </Box>
        )}
      </ButtonWrap>
    </div>
  )
}

export default ModalInput
