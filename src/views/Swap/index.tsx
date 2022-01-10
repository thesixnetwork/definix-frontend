import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { CurrencyAmount, JSBI, Trade } from 'definixswap-sdk'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import AdvancedSwapDetailsDropdown from 'components/SwapComponent/AdvancedSwapDetailsDropdown'
import ConfirmSwapModal from 'components/SwapComponent/ConfirmSwapModal'
import TradePrice from 'components/SwapComponent/TradePrice'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { SWAP_STATE, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import {
  Button,
  IconButton,
  Text,
  useMatchBreakpoints,
  useModal,
  Flex,
  TitleSet,
  ButtonScales,
  ColorStyles,
  ChangeIcon,
  Noti,
  NotiType,
  Box,
  Divider,
  ButtonVariants,
  Coin,
} from '@fingerlabs/definixswap-uikit-v2'

import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { useAllTokens } from 'hooks/Tokens'
import { allTokenAddresses, LIMITED_PRICE_IMPACT } from 'config/constants/index'
import { useLocation } from 'react-router'
import qs from 'querystring'
import useWallet from 'hooks/useWallet'

const Swap: React.FC = () => {
  const [isApprovePending, setIsApprovePending] = useState<boolean>(false)

  const location = useLocation()
  const currencyQuerystring = useMemo(() => qs.parse(location.search), [location.search])
  const outputQs = useMemo(
    () => String(currencyQuerystring['?outputCurrency'] || currencyQuerystring.outputCurrency),
    [currencyQuerystring],
  )

  const { t, i18n } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  const gitbookLink = useMemo(
    () =>
      i18n.language === 'ko'
        ? 'https://sixnetwork.gitbook.io/definix-on-klaytn-kr/exchange/how-to-swap'
        : 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/exchange/how-to-trade-on-definix-exchange',
    [i18n.language],
  )

  const { account, chainId } = useWallet()

  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    swapState,
  } = useDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    loading: wrapLoading,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = useMemo(() => wrapType !== WrapType.NOT_APPLICABLE, [wrapType])
  const trade: Trade = useMemo(() => v2Trade, [v2Trade])

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade?.inputAmount, trade?.outputAmount],
  )

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const isValid = useMemo(() => !swapInputError, [swapInputError])
  const dependentField: Field = useMemo(
    () => (independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT),
    [independentField],
  )

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = useMemo(() => {
    return {
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }
  }, [dependentField, independentField, parsedAmounts, showWrap, typedValue])

  const route = useMemo(() => trade?.route, [trade?.route])
  const userHasSpecifiedInputOutput = useMemo(
    () =>
      Boolean(
        currencies[Field.INPUT] &&
          currencies[Field.OUTPUT] &&
          parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
      ),
    [currencies, independentField, parsedAmounts],
  )

  const [approval, approveCallback] = useApproveCallbackFromTrade(chainId, trade, allowedSlippage)

  const onClickApproveBtn = useCallback(async () => {
    setIsApprovePending(true)
    await approveCallback()
    setIsApprovePending(false)
  }, [approveCallback, setIsApprovePending])

  const maxAmountInput: CurrencyAmount | undefined = useMemo(
    () => maxAmountSpend(currencyBalances[Field.INPUT]),
    [currencyBalances],
  )

  // const atMaxAmountInput = useMemo(
  //   () => Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)),
  //   [maxAmountInput, parsedAmounts]
  // )

  const { error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, deadline, recipient)
  console.log('~~~swapCallbackError', swapCallbackError)

  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = useMemo(() => warningSeverity(priceImpactWithoutFee), [priceImpactWithoutFee])
  const isPriceImpactCaution = useMemo(
    () => priceImpactWithoutFee?.lessThan(LIMITED_PRICE_IMPACT),
    [priceImpactWithoutFee],
  )

  const showApproveFlow = useMemo(
    () => !swapInputError && approval === ApprovalState.NOT_APPROVED,
    [approval, swapInputError],
  )

  const initSwapData = useCallback(() => {
    onUserInput(Field.INPUT, '')
    onUserInput(Field.OUTPUT, '')
  }, [onUserInput])

  const handleConfirmDismiss = useCallback(() => {
    onUserInput(Field.INPUT, '')
    initSwapData()
  }, [onUserInput, initSwapData])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      if (window.localStorage.getItem('connector') === 'klip') {
        const floorDigit = 1000000
        const valueMax = +maxAmountInput.toExact()
        const max = Math.floor(valueMax * floorDigit) / floorDigit
        onUserInput(Field.INPUT, max.toString())
      } else {
        onUserInput(Field.INPUT, maxAmountInput.toExact())
      }
    }
  }, [maxAmountInput, onUserInput])

  const handleQuarterInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, numeral(parseFloat(maxAmountInput.toExact()) / 4).format('0.00'))
    }
  }, [maxAmountInput, onUserInput])

  const handleHalfInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, numeral(parseFloat(maxAmountInput.toExact()) / 2).format('0.00'))
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection],
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal recipient={recipient} onDismissModal={handleConfirmDismiss} />,
    false,
  )

  const onClickSwapButton = useCallback(() => {
    onPresentConfirmModal()
  }, [onPresentConfirmModal])

  const renderNoti = useCallback(() => {
    if (priceImpactSeverity > 3) {
      return (
        <Noti type={NotiType.ALERT} mt="12px">
          {t('Price Impact Too High')}
        </Noti>
      )
    }
    if (priceImpactSeverity > 2) {
      return (
        <Noti type={NotiType.ALERT} mt="12px">
          {t('This swap has a price impact of at least 5%')}
        </Noti>
      )
    }
    return null
  }, [priceImpactSeverity, t])

  const allTokens = useAllTokens()

  const onClickWrapButton = useCallback(async () => {
    await onWrap()
    onUserInput(Field.INPUT, '')
  }, [onUserInput, onWrap])

  useEffect(() => {
    if (chainId) {
      handleInputSelect(allTokens[allTokenAddresses.SIX[chainId]])
    }
  }, [chainId, outputQs, allTokens, handleInputSelect])

  useEffect(() => {
    if (outputQs) {
      handleInputSelect('')
      handleOutputSelect(allTokens[outputQs])
    }
  }, [outputQs, allTokens, handleInputSelect, handleOutputSelect])

  return (
    <Flex flexDirection="column" alignItems="center" pb={isMobile ? '40px' : '75px'}>
      <Box width={isMobile ? '100%' : '629px'}>
        <TitleSet
          title={t('Swap')}
          description={t('Swap it for any token')}
          link={gitbookLink}
          linkLabel={t('Learn how to Swap')}
        />
        <Flex
          flexDirection="column"
          width="100%"
          p={isMobile ? '20px' : '40px'}
          backgroundColor={ColorStyles.WHITE}
          mt={isMobile ? '28px' : '40px'}
          borderRadius="16px"
          border="1px solid #ffedcb"
          style={{ boxShadow: '0 12px 12px 0 rgba(254, 169, 72, 0.2)' }}
        >
          <Flex flexDirection="column" mb="20px">
            <Flex flexDirection="column">
              <CurrencyInputPanel
                isMobile={isMobile}
                value={formattedAmounts[Field.INPUT]}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onQuarter={handleQuarterInput}
                onHalf={handleHalfInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                isInsufficientBalance={swapState === SWAP_STATE.INSUFFICIENT_BALANCE}
                id="swap-currency-input"
                maxTokenAmount={maxAmountInput?.toExact()}
              />

              <Flex justifyContent="center">
                <IconButton
                  onClick={() => {
                    onSwitchTokens()
                  }}
                >
                  <ChangeIcon />
                </IconButton>
              </Flex>

              <CurrencyInputPanel
                isMobile={isMobile}
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />
            </Flex>

            {!showWrap && (
              <Flex>
                <Flex flex="1 1 0" justifyContent="space-between">
                  <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                    {t('Slippage Tolerance')}
                  </Text>
                  <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                    {allowedSlippage / 100}%
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>

          <Divider m={isMobile ? '24px 0px' : '32px 0px'} />

          <Flex flexDirection="column">
            <Flex>
              {!account && <ConnectWalletButton />}
              {account && (
                <>
                  {showWrap && (
                    <Button
                      width="100%"
                      scale={ButtonScales.LG}
                      disabled={Boolean(wrapInputError)}
                      onClick={onClickWrapButton}
                      isLoading={wrapLoading}
                    >
                      {wrapType === WrapType.WRAP && t('Wrap')}
                      {wrapType === WrapType.UNWRAP && t('Unwrap')}
                    </Button>
                  )}
                  {!showWrap && (
                    <>
                      {!route && userHasSpecifiedInputOutput && (
                        <Button
                          width="100%"
                          onClick={onClickSwapButton}
                          id="swap-button"
                          disabled={!isValid || !!swapCallbackError}
                          variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                          isLoading={Boolean(!route && userHasSpecifiedInputOutput)}
                        >
                          {t('Swap')}
                        </Button>
                      )}
                      {(route || !userHasSpecifiedInputOutput) && (
                        <Flex flexDirection="column" width="100%">
                          {showApproveFlow && (
                            <Flex
                              width="100%"
                              flexDirection={isMobile ? 'column' : 'row'}
                              justifyContent="space-between"
                              alignItems={isMobile ? 'flex-start' : 'center'}
                              mb="20px"
                            >
                              <Flex alignItems="center">
                                <Coin symbol={currencies[Field.INPUT]?.symbol} size="32px" />
                                <Text ml="12px" textStyle="R_16M" color={ColorStyles.MEDIUMGREY}>
                                  {`${currencies[Field.INPUT]?.symbol}`}
                                </Text>
                              </Flex>

                              <Button
                                scale={ButtonScales.MD}
                                onClick={onClickApproveBtn}
                                disabled={approval !== ApprovalState.NOT_APPROVED}
                                width={isMobile ? '100%' : '186px'}
                                mt={isMobile ? '8px' : '0px'}
                                isLoading={isApprovePending}
                                variant={ButtonVariants.BROWN}
                              >
                                {t('Approve {{Token}}', { Token: `${currencies[Field.INPUT]?.symbol}` })}
                              </Button>
                            </Flex>
                          )}
                          <Flex flexDirection="column" flex="1 1 0">
                            <Button
                              width="100%"
                              scale={ButtonScales.LG}
                              onClick={onClickSwapButton}
                              id="swap-button"
                              disabled={!isValid || !!swapCallbackError || showApproveFlow || priceImpactSeverity > 3}
                            >
                              {t('Swap')}
                            </Button>
                            {renderNoti()}
                          </Flex>
                        </Flex>
                      )}
                    </>
                  )}
                </>
              )}
            </Flex>

            {trade && (
              <Flex flexDirection="column" mt="24px">
                <Text textStyle={isMobile ? 'R_14M' : 'R_16M'} color={ColorStyles.DEEPGREY} mb="12px">
                  {t('Estimated Returns')}
                </Text>

                {Boolean(trade) && (
                  <Flex
                    flexDirection={isMobile ? 'column' : 'row'}
                    flex="1 1 0"
                    justifyContent="space-between"
                    mb="12px"
                  >
                    <Text mb="4px" textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                      {t('Price Rate')}
                    </Text>
                    <TradePrice price={trade?.executionPrice} isPriceImpactCaution={!isPriceImpactCaution} />
                  </Flex>
                )}
                <AdvancedSwapDetailsDropdown
                  trade={trade}
                  isMobile={isMobile}
                  isPriceImpactCaution={!isPriceImpactCaution}
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default Swap
