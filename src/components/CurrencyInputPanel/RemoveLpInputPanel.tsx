import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import {
  Text,
  Flex,
  Box,
  AnountButton,
  ColorStyles,
  Noti,
  NotiType,
  useMatchBreakpoints,
  Coin,
  Lp,
  textStyle,
} from '@fingerlabs/definixswap-uikit-v2'
import { escapeRegExp } from 'utils'
import styled from 'styled-components'
import { Currency } from 'definixswap-sdk'

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  ${textStyle.R_14M}
  ${ColorStyles.BLACK}
`

interface IProps {
  value: string
  currency?: Currency | null
  currencyA?: Currency | null
  currencyB?: Currency | null
  onMax?: () => void
  onQuarter?: () => void
  onHalf?: () => void
  onUserInput: (value: string) => void
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
const RemoveLpInputPanel: React.FC<IProps> = ({
  onMax,
  onHalf,
  onQuarter,
  onUserInput,
  value,
  currency,
  currencyA,
  currencyB,
}) => {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])
  const { t } = useTranslation()
  const enforcer = useCallback(
    (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        onUserInput(nextUserInput)
      }
    },
    [onUserInput]
  )

  const onChangeInput = useCallback(
    (event) => {
      enforcer(event.target.value.replace(/,/g, '.'))
    },
    [enforcer]
  )

  const decimals = useMemo(() => 18, [])
  const overDp = useMemo(() => new BigNumber(value).decimalPlaces() > decimals, [value, decimals])

  const renderNoti = useCallback(() => {
    if (overDp) {
      return (
        <Noti type={NotiType.ALERT} mt="12px">
          {t('The value entered is out of the valid range')}
        </Noti>
      )
    }
    return null
  }, [t, overDp])

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" mb={isMobile ? '8px' : '12px'}>
        {currencyA && currencyB && (
          <>
            <Box mr={isMobile ? '12px' : '10px'}>
              <Lp lpSymbols={[currencyA?.symbol, currencyB?.symbol]} size="32px" />
            </Box>
            <Text textStyle="R_16M" color={ColorStyles.DEEPGREY}>
              {currencyA?.symbol}-{currencyB?.symbol}
            </Text>
          </>
        )}
        {currency && (
          <>
            <Box mr={isMobile ? '12px' : '10px'}>
              <Coin size="32px" symbol={currency?.symbol} />
            </Box>
            <Text textStyle="R_16M" color={ColorStyles.DEEPGREY}>
              {currency?.symbol}
            </Text>
          </>
        )}
      </Flex>
      <Flex
        width="100%"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-end' : 'center'}
        borderRadius="8px"
        border="solid 1px #e0e0e0"
        p="14px 12px 14px 16px"
      >
        <Input placeholder="0.0" value={value} onChange={onChangeInput} />
        <Flex flexWrap={isMobile ? 'wrap' : 'nowrap'} mt={isMobile ? '2px' : '0px'}>
          <AnountButton onClick={onQuarter} mr="6px" backgroundColor="rgba(224, 224, 224, 0.3)">
            {t('25%')}
          </AnountButton>
          <AnountButton onClick={onHalf} mr="6px" backgroundColor="rgba(224, 224, 224, 0.3)">
            {t('50%')}
          </AnountButton>
          <AnountButton onClick={onMax} backgroundColor="rgba(224, 224, 224, 0.3)">
            {t('MAX')}
          </AnountButton>
        </Flex>
      </Flex>
      {renderNoti()}
    </Flex>
  )
}

export default React.memo(RemoveLpInputPanel)
