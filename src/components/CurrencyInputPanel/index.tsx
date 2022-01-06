import { Currency, Pair } from 'definixswap-sdk'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import {
  Text,
  Flex,
  Box,
  AnountButton,
  SmallDownIcon,
  ColorStyles,
  Noti,
  NotiType,
  useModal,
  Coin,
  Lp,
} from '@fingerlabs/definixswap-uikit-v2'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { Input as NumericalInput } from '../NumericalInput'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'

interface CurrencyInputPanelProps {
  isMobile: boolean
  value: string
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  onMax?: () => void
  onQuarter?: () => void
  onHalf?: () => void
  onUserInput: (value: string) => void
  onCurrencySelect?: (currency: Currency) => void
  isInsufficientBalance?: boolean
  maxTokenAmount?: string
}

const CurrencySelect = styled.button<{ selected: boolean }>`
  padding: 0;
  align-items: center;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
`

export default React.memo(function CurrencyInputPanel({
  isMobile,
  value,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  onMax,
  onQuarter,
  onHalf,
  onUserInput,
  onCurrencySelect,
  isInsufficientBalance,
  maxTokenAmount,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account } = useCaverJsReact()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const [isMaxKlayNoti, setIsMaxKlayNoti] = useState<boolean>(false)
  const [balance, setBalance] = useState<string>('')

  const [onPresentCurrencySearchModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
    />,
    false
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
    if (isInsufficientBalance) {
      return (
        <Noti type={NotiType.ALERT} mt="12px">
          {t('Insufficient balance')}
        </Noti>
      )
    }
    if (isMaxKlayNoti) {
      return (
        <Noti type={NotiType.ALERT} mt="12px">
          {t('Full payment of KLAY')}
        </Noti>
      )
    }
    return null
  }, [isInsufficientBalance, isMaxKlayNoti, t, overDp])

  useEffect(() => {
    if (!hideBalance && !!currency && selectedCurrencyBalance) {
      setBalance(selectedCurrencyBalance?.toFixed(5))
      return
    }
    setBalance('-')
  }, [hideBalance, currency, selectedCurrencyBalance])

  useEffect(() => {
    if (currency?.symbol === 'KLAY') {
      if (Number(value) >= Number(balance)) {
        setIsMaxKlayNoti(true)
        return
      }
    }
    setIsMaxKlayNoti(false)
  }, [value, balance, maxTokenAmount, currency?.symbol])


  return (
    <>
      <Box id={id} mb="12px">
        <Flex justifyContent="space-between">
          {!hideInput && (
            <Flex flexDirection="row" flex="1 1 0" pr="20px">
              <Flex flexDirection="column" flex="1" position="relative">
                <Flex mb="4px">
                  <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} mr="4px">
                    {t('Balance')}
                  </Text>
                  <Text textStyle="R_14B" color={ColorStyles.DEEPGREY}>
                    {balance}
                  </Text>
                </Flex>
                <NumericalInput value={value} onUserInput={(val) => onUserInput(val)} />
                {account && currency && onQuarter && onHalf && onMax && (
                  <>
                    <Flex mt="8px">
                      <AnountButton onClick={onQuarter} mr="6px">
                        {t('25%')}
                      </AnountButton>
                      <AnountButton onClick={onHalf} mr="6px">
                        {t('50%')}
                      </AnountButton>
                      <AnountButton onClick={onMax}>{t('MAX')}</AnountButton>
                    </Flex>
                    {renderNoti()}
                  </>
                )}
              </Flex>
            </Flex>
          )}

          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencySearchModal()
              }
            }}
          >
            <Flex>
              <Flex alignItems="center" height={isMobile ? '32px' : '40px'} mr="6px">
                <Flex>{!disableCurrencySelect && <SmallDownIcon />}</Flex>
              </Flex>
              <Flex flexDirection="column" alignItems="center">
                <Flex mb="5px">
                  {pair && <Lp lpSymbols={[pair.token0?.symbol, pair.token1?.symbol]} size="16px" />}
                  {!pair && currency && <Coin symbol={currency?.symbol} size={isMobile ? '32px' : '40px'} />}
                  {!pair && !currency && <Coin symbol="UNSELECT" size={isMobile ? '32px' : '40px'} />}
                </Flex>
                {pair && (
                  <Text textStyle={isMobile ? 'R_12B' : 'R_14B'} color={ColorStyles.BLACK}>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                )}
                {!pair && (
                  <Text textStyle="R_14B" color={ColorStyles.BLACK}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length
                        )}`
                      : currency?.symbol) || (
                      <Text textStyle="R_14B" color={ColorStyles.BLACK}>
                        {t('Token')}
                      </Text>
                    )}
                  </Text>
                )}
              </Flex>
            </Flex>
          </CurrencySelect>
        </Flex>
      </Box>
    </>
  )
})
