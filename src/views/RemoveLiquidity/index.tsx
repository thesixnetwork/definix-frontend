import ConnectWalletButton from 'components/ConnectWalletButton'
import { currencyEquals, ETHER, Percent, WETH } from 'definixswap-sdk'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import useWallet from 'hooks/useWallet'
import {
  Button,
  CardBody,
  ColorStyles,
  Flex,
  Text,
  Box,
  ButtonScales,
  TitleSet,
  useMatchBreakpoints,
  useModal,
  Divider,
  ChangeBottomIcon,
  ChangePlusIcon,
  ArrowChangeIcon,
  BackIcon,
  textStyle,
  ButtonVariants,
  CheckBIcon,
  Lp,
  Coin,
} from '@fingerlabs/definixswap-uikit-v2'
import { useTokenBalance } from 'state/wallet/hooks'
import { useTranslation } from 'react-i18next'
import Slider from 'components/Slider'
import styled from 'styled-components'
import { ROUTER_ADDRESS } from 'config/constants'
import RemoveLpInputPanel from 'components/CurrencyInputPanel/RemoveLpInputPanel'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { Field } from '../../state/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import ConfirmRemoveModal from './ConfirmRemoveModal'

const StyledInternalLink = styled(Link)`
  ${textStyle.R_14R}
  color: #999999;
  cursor: pointer;
`
const PercentInput = styled.span`
  ${textStyle.R_28M};
  color: #222222;
  border: none;
  outline: none;
`

export default function RemoveLiquidity() {
  const history = useHistory()
  const { currencyIdA, currencyIdB } = useParams<{ currencyIdA: string; currencyIdB: string }>()

  const [isApprovePending, setIsApprovePending] = useState<boolean>(false)
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  const { t, i18n } = useTranslation()

  const gitbookLink = useMemo(
    () =>
      i18n.language === 'ko'
        ? 'https://sixnetwork.gitbook.io/definix-on-klaytn-kr/exchange/how-to-add-liquidity'
        : 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/exchange/how-to-add-liquidity',
    [i18n.language],
  )

  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId } = useWallet()
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [chainId, currencyA, currencyB],
  )

  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  const [showDetailed, setShowDetailed] = useState<boolean>(false)

  const formattedAmounts = useMemo(() => {
    return {
      [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
        ? '0'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
        ? '<1'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
      [Field.LIQUIDITY]:
        independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
      [Field.CURRENCY_A]:
        independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
      [Field.CURRENCY_B]:
        independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    }
  }, [independentField, parsedAmounts, typedValue])

  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    ROUTER_ADDRESS[chainId || parseInt(process.env.REACT_APP_CHAIN_ID || '0')],
  )

  const onClickApproveButton = useCallback(async () => {
    try {
      setIsApprovePending(true)
      await approveCallback()
    } catch (err) {
      setIsApprovePending(false)
    }
    setIsApprovePending(false)
  }, [approveCallback, setIsApprovePending])

  const onUserInput = useCallback(
    (field: Field, val: string) => {
      setSignatureData(null)
      return _onUserInput(field, val)
    },
    [_onUserInput],
  )

  const onLiquidityInput = useCallback((val: string): void => onUserInput(Field.LIQUIDITY, val), [onUserInput])
  const onCurrencyAInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_A, val), [onUserInput])
  const onCurrencyBInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_B, val), [onUserInput])

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const oneCurrencyIsETH = useMemo(() => currencyA === ETHER || currencyB === ETHER, [currencyA, currencyB])
  const oneCurrencyIsWETH = useMemo(
    () =>
      Boolean(
        chainId &&
          ((currencyA && currencyEquals(WETH(chainId), currencyA)) ||
            (currencyB && currencyEquals(WETH(chainId), currencyB))),
      ),
    [chainId, currencyA, currencyB],
  )

  const handleDismissConfirmation = useCallback(() => {
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    onUserInput(Field.LIQUIDITY_PERCENT, '0')
  }, [onUserInput])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  useEffect(() => {
    if (!account) {
      history.replace('/liquidity')
    }
  }, [account, history])

  useEffect(() => {
    return () => {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
      onCurrencyAInput('0')
      onCurrencyBInput('0')
    }
  }, [onUserInput, onCurrencyAInput, onCurrencyBInput])

  const userPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const [onPresentConfirmRemoveModal] = useModal(
    <ConfirmRemoveModal
      {...{
        currencyA,
        currencyB,
        parsedAmounts,
        pair,
        tokenA,
        tokenB,
        signatureData,
        onDismissModal: handleDismissConfirmation,
        onUserInput,
      }}
    />,
  )

  return (
    <Flex width="100%" flexDirection="column" alignItems="center">
      <Flex flexDirection="column" width={isMobile ? '100%' : '629px'} mb="40px">
        <Flex mb="20px" onClick={() => history.replace('/liquidity')} style={{ cursor: 'pointer' }}>
          <BackIcon />
          <Text
            ml="6px"
            textStyle={isMobile ? 'R_14M' : 'R_16M'}
            color={ColorStyles.MEDIUMGREY}
            mt={isMobile ? '0px' : '-2px'}
          >
            {t('Back')}
          </Text>
        </Flex>
        <TitleSet
          title={t('Liquidity')}
          description={t('Remove LP and take back tokens')}
          link={gitbookLink}
          linkLabel={t('Learn how to add Liquidity')}
        />
      </Flex>
      {account && (
        <Flex
          backgroundColor={ColorStyles.WHITE}
          borderRadius="16px"
          width={isMobile ? '100%' : '629px'}
          border="1px solid #ffe5c9"
          style={{ boxShadow: '0 12px 12px 0 rgba(227, 132, 0, 0.1)' }}
          mb={isMobile ? '40px' : '80px'}
        >
          <Flex flexDirection="column" width="100%">
            <CardBody p={isMobile ? '20px' : '40px'}>
              <Flex flexDirection="column" mb="20px">
                <Flex justifyContent={isMobile ? 'flex-start' : 'flex-start'} alignItems="center" mb="20px">
                  <Lp size={isMobile ? '36px' : '40px'} lpSymbols={[currencyA?.symbol, currencyB?.symbol]} />
                  <Flex
                    ml="10px"
                    flexDirection={isMobile ? 'column' : 'row'}
                    justifyContent={isMobile ? 'flex-start' : 'space-between'}
                    flex="1 1 0"
                  >
                    <Text textStyle={isMobile ? 'R_16M' : 'R_18M'} color={ColorStyles.BLACK}>
                      {currencyA?.symbol}-{currencyB?.symbol}
                    </Text>
                    <Flex alignItems="center">
                      <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} mr="5px">
                        {t('Balance')}
                      </Text>
                      <Text textStyle="R_14B" color={ColorStyles.DEEPGREY}>
                        {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>

                <Flex width="100%" flexDirection="column">
                  <Flex justifyContent="space-between">
                    <Flex alignItems="flex-end">
                      {/* <PercentInput value={innerLiquidityPercentage} /> */}
                      <PercentInput role="textbox" contentEditable={false}>
                        {innerLiquidityPercentage}
                      </PercentInput>
                      <Text textStyle="R_20M" color={ColorStyles.MEDIUMGREY} mb="2.5px" ml="4px">
                        %
                      </Text>
                    </Flex>

                    <Box
                      onClick={() => {
                        setShowDetailed(!showDetailed)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY} style={{ textDecoration: 'underline' }}>
                        {showDetailed ? t('Simple') : t('Detail')}
                      </Text>
                    </Box>
                  </Flex>
                  <Slider
                    min={0}
                    max={100}
                    value={innerLiquidityPercentage}
                    onValueChanged={setInnerLiquidityPercentage}
                    valueLabel={String(innerLiquidityPercentage)}
                  />
                </Flex>
              </Flex>
              {showDetailed && (
                <>
                  <Flex flexDirection="column">
                    <RemoveLpInputPanel
                      value={formattedAmounts[Field.LIQUIDITY]}
                      onUserInput={onLiquidityInput}
                      onMax={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '100')
                      }}
                      onQuarter={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '25')
                      }}
                      onHalf={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '50')
                      }}
                      currencyA={currencyA}
                      currencyB={currencyB}
                    />

                    <Flex justifyContent="center">
                      <ChangeBottomIcon />
                    </Flex>

                    <RemoveLpInputPanel
                      value={formattedAmounts[Field.CURRENCY_A]}
                      onUserInput={onCurrencyAInput}
                      onMax={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '100')
                      }}
                      onQuarter={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '25')
                      }}
                      onHalf={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '50')
                      }}
                      currency={currencyA}
                    />

                    <Flex justifyContent="center">
                      <ChangePlusIcon />
                    </Flex>

                    <RemoveLpInputPanel
                      value={formattedAmounts[Field.CURRENCY_B]}
                      onUserInput={onCurrencyBInput}
                      onMax={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '100')
                      }}
                      onQuarter={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '25')
                      }}
                      onHalf={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '50')
                      }}
                      currency={currencyB}
                    />
                  </Flex>
                </>
              )}

              <Divider mt={isMobile ? '24px' : '32px'} mb={isMobile ? '24px' : '32px'} />

              <Flex width="100%" flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center" mb="14px">
                  <Text textStyle="R_16M" color={ColorStyles.DEEPGREY}>
                    {t('You will receive')}
                  </Text>
                  {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) && (
                    <Flex alignItems="center">
                      {oneCurrencyIsETH ? (
                        <StyledInternalLink
                          to={`/liquidity/remove/${currencyA === ETHER ? WETH(chainId).address : currencyIdA}/${
                            currencyB === ETHER ? WETH(chainId).address : currencyIdB
                          }`}
                        >
                          <Flex alignItems="center">
                            <Text mr="4px" style={{ textDecoration: 'underline' }}>
                              {t('Receive')} WKLAY
                            </Text>
                            <ArrowChangeIcon />
                          </Flex>
                        </StyledInternalLink>
                      ) : oneCurrencyIsWETH ? (
                        <StyledInternalLink
                          to={`/liquidity/remove/${
                            currencyA && currencyEquals(currencyA, WETH(chainId)) ? 'KLAY' : currencyIdA
                          }/${currencyB && currencyEquals(currencyB, WETH(chainId)) ? 'KLAY' : currencyIdB}`}
                        >
                          <Flex alignItems="center">
                            <Text mr="4px" style={{ textDecoration: 'underline' }}>
                              {t('Receive')} KLAY
                            </Text>
                            <ArrowChangeIcon />
                          </Flex>
                        </StyledInternalLink>
                      ) : null}
                    </Flex>
                  )}
                </Flex>

                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  mb={isMobile ? '10px' : '0'}
                  p={isMobile ? '5px 0' : '14px 0'}
                >
                  <Flex alignItems="center">
                    <Coin size={isMobile ? '30px' : '32px'} symbol={currencyA?.symbol} />
                    <Text
                      textStyle={isMobile ? 'R_14M' : 'R_16M'}
                      color={ColorStyles.BLACK}
                      ml="10px"
                      id="remove-liquidity-tokena-symbol"
                    >
                      {currencyA?.symbol}
                    </Text>
                  </Flex>
                  <Text>{formattedAmounts[Field.CURRENCY_A] || '0'}</Text>
                </Flex>

                <Flex alignItems="center" justifyContent="space-between" p={isMobile ? '5px 0' : '14px 0'}>
                  <Flex alignItems="center">
                    <Coin size={isMobile ? '30px' : '32px'} symbol={currencyB?.symbol} />
                    <Text
                      textStyle={isMobile ? 'R_14M' : 'R_16M'}
                      color={ColorStyles.BLACK}
                      ml="10px"
                      id="remove-liquidity-tokenb-symbol"
                    >
                      {currencyB?.symbol}
                    </Text>
                  </Flex>
                  <Text>{formattedAmounts[Field.CURRENCY_B] || '0'}</Text>
                </Flex>
              </Flex>

              <Divider mt={isMobile ? '24px' : '20px'} mb={isMobile ? '24px' : '32px'} />

              <Flex>
                {!account ? (
                  <ConnectWalletButton />
                ) : (
                  <Flex flexDirection="column" width="100%">
                    {approval !== ApprovalState.APPROVED && formattedAmounts[Field.LIQUIDITY_PERCENT] !== '0' && (
                      <Flex
                        flexDirection={isMobile ? 'column' : 'row'}
                        justifyContent="space-between"
                        mb={isMobile ? '32px' : '16px'}
                      >
                        <Flex alignItems="center" mb={isMobile ? '8px' : '0px'}>
                          <Box mr="12px">
                            <Lp size="32px" lpSymbols={[currencyA?.symbol, currencyB?.symbol]} />
                          </Box>
                          <Text textStyle={isMobile ? 'R_16M' : 'R_18M'} color={ColorStyles.MEDIUMGREY}>
                            {currencyA?.symbol}-{currencyB?.symbol}
                          </Text>
                        </Flex>

                        <Button
                          onClick={onClickApproveButton}
                          textStyle="R_14B"
                          scale={ButtonScales.LG}
                          width={isMobile ? '100%' : '186px'}
                          xs={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                          disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                          isLoading={isApprovePending}
                          variant={
                            approval !== ApprovalState.NOT_APPROVED || signatureData !== null
                              ? 'line'
                              : ButtonVariants.BROWN
                          }
                        >
                          {(approval !== ApprovalState.NOT_APPROVED || signatureData !== null) && (
                            <Box style={{ opacity: 0.5 }} mt="4px">
                              <CheckBIcon />
                            </Box>
                          )}
                          <Text ml="6px">{t('Approve to LP')}</Text>
                        </Button>
                      </Flex>
                    )}

                    <Button
                      onClick={() => {
                        onPresentConfirmRemoveModal()
                      }}
                      disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                      scale={ButtonScales.LG}
                      width="100%"
                      textStyle="R_16B"
                    >
                      {t('Remove')}
                    </Button>
                  </Flex>
                )}
              </Flex>

              {pair && (
                <Flex flexDirection="column" width="100%" mt="24px">
                  <Text textStyle="R_16M" color={ColorStyles.DEEPGREY} mb="12px">
                    {t('Estimated Returns')}
                  </Text>
                  <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
                    <Text mb={isMobile ? '4px' : '0px'} textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                      {t('Price Rate')}
                    </Text>
                    <Flex flexDirection="column" alignItems="flex-end">
                      <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                        1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'}{' '}
                        {currencyB?.symbol}
                      </Text>
                      <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                        1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'}{' '}
                        {currencyA?.symbol}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              )}
            </CardBody>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
