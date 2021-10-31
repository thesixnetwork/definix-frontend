import numeral from 'numeral'
import AddressInputPanel from 'components/AddressInputPanel'
import { GreyCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import ExchangeTab from 'components/ExchangeTab'
import Loader from 'components/Loader'
import ProgressSteps from 'components/ProgressSteps'
import { AutoRow, RowBetween } from 'components/Row'
import { LinkStyledButton } from 'components/Shared'
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from 'components/swap/ConfirmSwapModal'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/swap/styleds'
import TradePrice from 'components/swap/TradePrice'
import SyrupWarningModal from 'components/SyrupWarningModal'
import TokenWarningModal from 'components/TokenWarningModal'
import TransactionHistoryBox from 'components/TransactionHistoryBox'
import { INITIAL_ALLOWED_SLIPPAGE, SIX_ADDRESS, FINIX_ADDRESS, WBNB_ADDRESS, USDT_ADDRESS, BUSD_ADDRESS  } from 'config/constants'
import { CurrencyAmount, JSBI, Token, Trade } from 'definixswap-sdk'
import { useActiveWeb3React } from 'hooks'
import { useCurrency, useAllTokens } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import styled, { ThemeContext } from 'styled-components'
import { ArrowDownIcon, Button, Card, CardBody, Heading, IconButton, Text, useMatchBreakpoints, Link } from 'uikit-dev'
import { Overlay } from 'uikit-dev/components/Overlay'
import { LeftPanel, MaxWidthLeft, MaxWidthRight, RightPanel, ShowHideButton } from 'uikit-dev/components/TwoPanelLayout'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { TranslateString } from 'utils/translateTextHelpers'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { getBscScanLink } from 'utils'
import { RouteComponentProps } from 'react-router-dom'
import Flip from '../../uikit-dev/components/Flip'
import AppBody from '../AppBody'

const TimerWrapper = ({ isPhrase2, date, children }) => {
  return isPhrase2 ? (
    children
  ) : (
    <>
      <div>
        <br />
        <Flip date={date} />
        <br />
        <br />
        <br />
      </div>
      <div
        tabIndex={0}
        role="button"
        style={{ opacity: 0.4, pointerEvents: 'none' }}
        onClick={(e) => {
          e.preventDefault()
        }}
        onKeyDown={(e) => {
          e.preventDefault()
        }}
      >
        {children}
      </div>
    </>
  )
}

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

export default function Swap({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { isXl } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl

  const allTransactions = useAllTransactions()
  const allTokens = useAllTokens()

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs
      .filter(isTransactionRecent)
      .filter((t) => t.type === 'swap')
      .sort(newTransactionsFirst)
  }, [allTransactions])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const [isSyrup, setIsSyrup] = useState<boolean>(false)
  const [isShowRightPanel, setIsShowRightPanel] = useState(false)
  const [syrupTransactionType, setSyrupTransactionType] = useState<string>('')
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const handleConfirmSyrupWarning = useCallback(() => {
    setIsSyrup(false)
    setSyrupTransactionType('')
  }, [])

  const [isPhrase2, setIsPhrase2] = useState(false)
  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()
  useEffect(() => {
    if (currentTime < phrase2TimeStamp) {
      setTimeout(() => {
        setIsPhrase2(true)
      }, phrase2TimeStamp - currentTime)
    } else {
      setIsPhrase2(true)
    }
  }, [currentTime, phrase2TimeStamp])

  const { account, chainId = '' } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState((prevState) => ({ ...prevState, attemptingTxn: true, swapErrorMessage: undefined, txHash: undefined }))
    swapCallback()
      .then((hash) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: undefined,
          txHash: hash,
        }))
      })
      .catch((error) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: error.message,
          txHash: undefined,
        }))
      })
  }, [priceImpactWithoutFee, swapCallback, setSwapState])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }))

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  // This will check to see if the user has selected Syrup to either buy or sell.
  // If so, they will be alerted with a warning message.
  const checkForSyrup = useCallback(
    (selected: string, purchaseType: string) => {
      if (selected === 'syrup') {
        setIsSyrup(true)
        setSyrupTransactionType(purchaseType)
      }
    },
    [setIsSyrup, setSyrupTransactionType]
  )

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      if (inputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(inputCurrency.symbol.toLowerCase(), 'Selling')
      }
    },
    [onCurrencySelection, setApprovalSubmitted, checkForSyrup]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
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
      if (outputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(outputCurrency.symbol.toLowerCase(), 'Buying')
      }
    },
    [onCurrencySelection, checkForSyrup]
  )

  useEffect(() => {
    if (isMobileOrTablet) {
      setIsShowRightPanel(false)
    }
  }, [isMobileOrTablet])

  useEffect(() => {
    return () => {
      setIsShowRightPanel(false)
    }
  }, [])

  return (
    <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
      {!showConfirm ? (
        <LeftPanel isShowRightPanel={isShowRightPanel}>
          <Overlay
            show={isShowRightPanel && isMobileOrTablet}
            style={{ position: 'absolute', zIndex: 6 }}
            onClick={() => {
              setIsShowRightPanel(false)
            }}
          />

          <MaxWidthLeft>
            <AppBody
              title={
                <Heading as="h1" fontSize="32px !important" className="mb-5" textAlign="left">
                  EXCHANGE
                </Heading>
              }
            >
              <ExchangeTab current="/swap" />

              <Wrapper id="swap-page">
                <CardBody p={isMobileOrTablet ? '24px !important' : '32px !important'}>
                  <Heading textAlign="center" className="mb-4">
                    Trade tokens in an instant
                  </Heading>

                  <div>
                    <CurrencyInputPanel
                      className="mb-4"
                      label={
                        independentField === Field.OUTPUT && !showWrap && trade
                          ? 'From (estimated)'
                          : TranslateString(76, 'From')
                      }
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onQuarter={handleQuarterInput}
                      onHalf={handleHalfInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />

                    <AutoColumn justify="space-between">
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <ArrowWrapper clickable>
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setApprovalSubmitted(false) // reset 2 step UI for approvals
                              onSwitchTokens()
                            }}
                            size="sm"
                          >
                            <ArrowDownIcon />
                          </IconButton>
                        </ArrowWrapper>
                        {recipient === null && !showWrap && isExpertMode ? (
                          <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                            + Add a send (optional)
                          </LinkStyledButton>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>

                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={
                        independentField === Field.INPUT && !showWrap && trade
                          ? 'To (estimated)'
                          : TranslateString(80, 'To')
                      }
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                    />

                    {recipient !== null && !showWrap ? (
                      <>
                        <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                          <ArrowWrapper clickable={false}>
                            <ArrowDown size="16" color={theme.colors.textSubtle} />
                          </ArrowWrapper>
                          <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                            - Remove send
                          </LinkStyledButton>
                        </AutoRow>
                        <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                      </>
                    ) : null}

                    {showWrap
                      ? null
                      : (Boolean(trade) || allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE) && (
                          <div className="flex mt-5 justify-end">
                            {Boolean(trade) && (
                              <div className="flex flex-wrap align-baseline justify-space-between col-6">
                                <Text fontSize="14px" color="textSubtle">
                                  Price Rate
                                </Text>
                                <TradePrice
                                  price={trade?.executionPrice}
                                  showInverted={showInverted}
                                  setShowInverted={setShowInverted}
                                />
                              </div>
                            )}
                            {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                              <div
                                className={`flex flex-wrap align-baseline justify-space-between col-6 ${
                                  isMobileOrTablet ? 'pl-5' : 'pl-6'
                                }`}
                              >
                                <Text fontSize="14px" color="textSubtle">
                                  Slippage Tolerance
                                </Text>
                                <Text fontSize="14px" textAlign="right" bold>
                                  {allowedSlippage / 100}%
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                  </div>
                </CardBody>

                <div className={`${isMobileOrTablet ? 'pa-5' : 'pa-6'} bd-t`}>
                  <AdvancedSwapDetailsDropdown trade={trade} />

                  <BottomGrouping>
                    {!account ? (
                      <ConnectWalletButton fullWidth />
                    ) : showWrap ? (
                      <Button disabled={Boolean(wrapInputError)} onClick={onWrap} fullWidth>
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </Button>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard style={{ textAlign: 'center' }}>
                        <Text>Insufficient liquidity for this trade.</Text>
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween className="mb-3">
                        <Button
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          style={{ width: '48%' }}
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            'Approved'
                          ) : (
                            `Approve ${currencies[Field.INPUT]?.symbol}`
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                showConfirm: true,
                                txHash: undefined,
                              })
                            }
                          }}
                          radii="card"
                          style={{ width: '48%' }}
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                        >
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact High`
                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              showConfirm: true,
                              txHash: undefined,
                            })
                          }
                        }}
                        id="swap-button"
                        radii="card"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        fullWidth
                      >
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact Too High`
                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}
                      </Button>
                    )}
                    <div className="mt-5 flex align-center justify-center">
                      <Text paddingRight="1">I’m new to swap,</Text>
                      <TutorailsLink
                        href="https://sixnetwork.gitbook.io/definix/exchange/how-to-swap-token"
                        target="_blank"
                      >
                        Teach me how.
                      </TutorailsLink>
                    </div>
                    {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
                    {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                  </BottomGrouping>
                </div>
              </Wrapper>
            </AppBody>
          </MaxWidthLeft>
        </LeftPanel>
      ) : (
        <ConfirmSwapModal
          isOpen={showConfirm}
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={recipient}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          swapErrorMessage={swapErrorMessage}
          onDismiss={handleConfirmDismiss}
        />
      )}
      <RightPanel isShowRightPanel={isShowRightPanel}>
        {!showConfirm && (
          <ShowHideButton
            isShow={isShowRightPanel}
            action={() => {
              setIsShowRightPanel(!isShowRightPanel)
            }}
          />
        )}

        {isShowRightPanel && (
          <MaxWidthRight>
            <Heading fontSize="20px !important" className="mb-3">
              SWAP HISTORY
            </Heading>
            <Card style={{ overflow: 'auto', flexGrow: 1 }}>
              {sortedRecentTransactions.length > 0 ? (
                sortedRecentTransactions
                  .filter((tx) => {
                    const firstToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.firstToken)
                    const secondToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.secondToken)
                    return !!firstToken && !!secondToken
                  })
                  .map((tx) => {
                    const firstToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.firstToken)
                    const secondToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.secondToken)
                    return (
                      <TransactionHistoryBox
                        href={chainId ? getBscScanLink(chainId, tx.hash, 'transaction') : '/'}
                        firstCoin={firstToken}
                        firstCoinAmount={tx.data?.firstTokenAmount}
                        secondCoin={secondToken}
                        secondCoinAmount={tx.data?.secondTokenAmount}
                        title="Swap"
                        withText="to"
                        isFailed={!tx.confirmedTime}
                        date={
                          tx.confirmedTime
                            ? new Date(tx.confirmedTime || 0).toLocaleString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                              })
                            : ''
                        }
                      />
                    )
                  })
              ) : (
                <div className="flex align-center justify-center" style={{ height: '100%' }}>
                  <Text color="textSubtle" fontSize="14px" textAlign="center">
                    No Swap History
                  </Text>
                </div>
              )}
            </Card>
          </MaxWidthRight>
        )}
      </RightPanel>

      <TokenWarningModal
        isOpen={
          urlLoadedTokens.filter(
            (x) =>
              x.address.toLowerCase() !== SIX_ADDRESS[chainId].toLowerCase() &&
              x.address.toLowerCase() !== FINIX_ADDRESS[chainId].toLowerCase() &&
              x.address.toLowerCase() !== WBNB_ADDRESS[chainId].toLowerCase() &&
              x.address.toLowerCase() !== BUSD_ADDRESS[chainId].toLowerCase() &&
              x.address.toLowerCase() !== USDT_ADDRESS[chainId].toLowerCase()
          ).length > 0 && !dismissTokenWarning
        }
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SyrupWarningModal
        isOpen={isSyrup}
        transactionType={syrupTransactionType}
        onConfirm={handleConfirmSyrupWarning}
      />
    </TimerWrapper>
  )
}
