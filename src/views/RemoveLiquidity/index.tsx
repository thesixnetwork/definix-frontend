/* eslint-disable react/jsx-no-bind */
import { BigNumber } from '@ethersproject/bignumber'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { BorderCard } from 'components/Card'
import ConnectWalletButton from 'components/ConnectWalletButton'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
  TransactionSubmittedContent,
} from 'components/TransactionConfirmationModal'
import { Currency, currencyEquals, ETHER, Percent, WETH } from 'definixswap-sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ArrowDown, Plus } from 'react-feather'
import { RouteComponentProps } from 'react-router'
import { ThemeContext } from 'styled-components'
import { Button, CardBody, Flex, Text } from 'uikit-dev'
import { LeftPanel, MaxWidthLeft } from 'uikit-dev/components/TwoPanelLayout'
import { ROUTER_ADDRESS } from 'config/constants'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'
import { StyledInternalLink } from '../../components/Shared'
import Slider from '../../components/Slider'
import { Dots } from '../../components/swap/styleds'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { usePairContract } from '../../hooks/useContract'
import { Field } from '../../state/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { ClickableText, Wrapper } from '../Pool/styleds'

export default function RemoveLiquidity({
  history,
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId],
  )

  const theme = useContext(ThemeContext)

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal, loading, error
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm
  const [errorMsg, setErrorMsg] = useState<string>('')

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
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

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS)
  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')
    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const deadlineForSignature: number = Math.ceil(Date.now() / 1000) + deadline

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'Definix LPs',
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadlineForSignature,
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadlineForSignature,
        })
      })
      .catch((e) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (e?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
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

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH
    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadlineFromNow,
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadlineFromNow,
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }
    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName, index) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((e) => {
            console.error(`estimateGas failed`, index, methodName, args, e)
            return undefined
          }),
      ),
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate),
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            type: 'removeLiquidity',
            data: {
              firstToken: currencyA?.symbol,
              firstTokenAmount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
              secondToken: currencyB?.symbol,
              secondTokenAmount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3),
            },
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          })

          setTxHash(response.hash)
        })
        .catch((e: Error) => {
          setAttemptingTxn(false)
          setErrorMsg(e.message)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(e)
        })
    }
  }

  const modalHeader = useCallback(() => {
    return (
      <div>
        <AutoColumn gap="24px">
          <AutoColumn gap="16px">
            <RowBetween align="flex-end">
              <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
              <RowFixed mb="0 !important">
                <CurrencyLogo currency={currencyA} size="24px" />
                <Text fontSize="24px" fontWeight="500" style={{ marginLeft: '12px' }}>
                  {currencyA?.symbol}
                </Text>
              </RowFixed>
            </RowBetween>
            <RowFixed>
              <Plus size="16" color={theme.colors.textSubtle} />
            </RowFixed>
            <RowBetween align="flex-end">
              <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
              <RowFixed mb="0 !important">
                <CurrencyLogo currency={currencyB} size="24px" />
                <Text fontSize="24px" fontWeight="500" style={{ marginLeft: '12px' }}>
                  {currencyB?.symbol}
                </Text>
              </RowFixed>
            </RowBetween>
          </AutoColumn>

          <Text small color="textSubtle" textAlign="left" padding="12px 0 0 0" style={{ fontStyle: 'italic' }}>
            {`Output is estimated. If the price changes by more than ${
              allowedSlippage / 100
            }% your transaction will revert.`}
          </Text>
        </AutoColumn>
      </div>
    )
  }, [allowedSlippage, currencyA, currencyB, parsedAmounts, theme.colors.textSubtle])

  const modalBottom = () => {
    return (
      <AutoColumn gap="16px">
        <RowBetween>
          <Text color="textSubtle">{`FLIP ${currencyA?.symbol}/${currencyB?.symbol}`} Burned</Text>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
            <Text>{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <Text color="textSubtle">Price</Text>
              <Text>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <Button
          disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
          onClick={onRemove}
          fullWidth
          radii="card"
        >
          Confirm
        </Button>
      </AutoColumn>
    )
  }

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB))),
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        history.push(`/remove/${currencyId(currency)}/${currencyIdA}`)
      } else {
        history.push(`/remove/${currencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, history],
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        history.push(`/remove/${currencyIdB}/${currencyId(currency)}`)
      } else {
        history.push(`/remove/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, history],
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
    setErrorMsg('')
  }, [onUserInput, txHash])

  const submittedContent = useCallback(
    () => (
      <TransactionSubmittedContent
        title="Remove Liquidity Complete"
        date={`${new Date().toDateString()}, ${new Date().toTimeString().split(' ')[0]}`}
        chainId={chainId}
        hash={txHash}
        content={modalHeader}
        button={
          <Button
            onClick={() => {
              console.log('Remove this Liquidity from Farm')
            }}
            radii="card"
            fullWidth
          >
            Remove this Liquidity from Farm
          </Button>
        }
      />
    ),
    [chainId, modalHeader, txHash],
  )

  const errorContent = useCallback(
    () => (
      <TransactionErrorContent
        title="Remove Liquidity Failed"
        date={`${new Date().toDateString()}, ${new Date().toTimeString().split(' ')[0]}`}
        chainId={chainId}
        hash={txHash}
        content={modalHeader}
        button={
          <Button
            onClick={() => {
              console.log('Remove Liquidity Again')
            }}
            radii="card"
            fullWidth
          >
            Remove Liquidity Again
          </Button>
        }
      />
    ),
    [chainId, modalHeader, txHash],
  )

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  return (
    <>
      {!showConfirm ? (
        <LeftPanel isShowRightPanel={false}>
          <MaxWidthLeft>
            <AppBody>
              <AddRemoveTabs adding={false} />

              <Wrapper>
                <CardBody p="32px !important">
                  <BorderCard className="mb-4">
                    <AutoColumn>
                      <RowBetween>
                        <Text>Amount</Text>
                        <ClickableText
                          onClick={() => {
                            setShowDetailed(!showDetailed)
                          }}
                        >
                          {showDetailed ? 'Simple' : 'Detailed'}
                        </ClickableText>
                      </RowBetween>
                      <Flex justifyContent="start">
                        <Text fontSize="64px">{formattedAmounts[Field.LIQUIDITY_PERCENT]}%</Text>
                      </Flex>
                      {!showDetailed && (
                        <>
                          <Flex mb="8px">
                            <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                          </Flex>
                          <Flex justifyContent="space-around">
                            <Button
                              variant="tertiary"
                              size="sm"
                              onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}
                            >
                              25%
                            </Button>
                            <Button
                              variant="tertiary"
                              size="sm"
                              onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}
                            >
                              50%
                            </Button>
                            <Button
                              variant="tertiary"
                              size="sm"
                              onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}
                            >
                              75%
                            </Button>
                            <Button
                              variant="tertiary"
                              size="sm"
                              onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                            >
                              Max
                            </Button>
                          </Flex>
                        </>
                      )}
                    </AutoColumn>
                  </BorderCard>

                  {!showDetailed && (
                    <>
                      <ColumnCenter className="mb-4">
                        <ArrowDown size="16" color={theme.colors.textSubtle} />
                      </ColumnCenter>

                      <BorderCard>
                        <AutoColumn gap="10px">
                          <RowBetween>
                            <Text fontSize="24px">{formattedAmounts[Field.CURRENCY_A] || '-'}</Text>
                            <RowFixed>
                              <CurrencyLogo currency={currencyA} style={{ marginRight: '12px' }} />
                              <Text fontSize="24px" id="remove-liquidity-tokena-symbol">
                                {currencyA?.symbol}
                              </Text>
                            </RowFixed>
                          </RowBetween>
                          <RowBetween>
                            <Text fontSize="24px">{formattedAmounts[Field.CURRENCY_B] || '-'}</Text>
                            <RowFixed>
                              <CurrencyLogo currency={currencyB} style={{ marginRight: '12px' }} />
                              <Text fontSize="24px" id="remove-liquidity-tokenb-symbol">
                                {currencyB?.symbol}
                              </Text>
                            </RowFixed>
                          </RowBetween>
                          {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                            <RowBetween style={{ justifyContent: 'flex-end' }}>
                              {oneCurrencyIsETH ? (
                                <StyledInternalLink
                                  to={`/remove/${currencyA === ETHER ? WETH[chainId].address : currencyIdA}/${
                                    currencyB === ETHER ? WETH[chainId].address : currencyIdB
                                  }`}
                                >
                                  Receive WBNB
                                </StyledInternalLink>
                              ) : oneCurrencyIsWETH ? (
                                <StyledInternalLink
                                  to={`/remove/${
                                    currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'ETH' : currencyIdA
                                  }/${currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'ETH' : currencyIdB}`}
                                >
                                  Receive BNB
                                </StyledInternalLink>
                              ) : null}
                            </RowBetween>
                          ) : null}
                        </AutoColumn>
                      </BorderCard>
                    </>
                  )}

                  {showDetailed && (
                    <>
                      <CurrencyInputPanel
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
                        showMaxButton={!atMaxAmount}
                        disableCurrencySelect
                        currency={pair?.liquidityToken}
                        pair={pair}
                        id="liquidity-amount"
                        className="mb-4"
                      />

                      <ColumnCenter className="mb-4">
                        <ArrowDown size="16" color={theme.colors.textSubtle} />
                      </ColumnCenter>

                      <CurrencyInputPanel
                        hideBalance
                        value={formattedAmounts[Field.CURRENCY_A]}
                        onUserInput={onCurrencyAInput}
                        onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                        onHalf={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}
                        onQuarter={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}
                        showMaxButton={!atMaxAmount}
                        currency={currencyA}
                        label="Output"
                        onCurrencySelect={handleSelectCurrencyA}
                        id="remove-liquidity-tokena"
                        className="mb-4"
                      />

                      <ColumnCenter className="mb-4">
                        <Plus size="16" color={theme.colors.textSubtle} />
                      </ColumnCenter>

                      <CurrencyInputPanel
                        hideBalance
                        value={formattedAmounts[Field.CURRENCY_B]}
                        onUserInput={onCurrencyBInput}
                        onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                        showMaxButton={!atMaxAmount}
                        currency={currencyB}
                        label="Output"
                        onCurrencySelect={handleSelectCurrencyB}
                        id="remove-liquidity-tokenb"
                      />
                    </>
                  )}

                  {pair && (
                    <div className="mt-4">
                      <Flex justifyContent="space-between" mb="8px">
                        Price:
                        <div>
                          1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'}{' '}
                          {currencyB?.symbol}
                        </div>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <div />
                        <div>
                          1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'}{' '}
                          {currencyA?.symbol}
                        </div>
                      </Flex>
                    </div>
                  )}
                </CardBody>

                <div className="pa-6 bd-t">
                  {!account ? (
                    <ConnectWalletButton fullWidth />
                  ) : (
                    <RowBetween>
                      <Button
                        onClick={onAttemptToApprove}
                        variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'success' : 'primary'}
                        disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                        mr="8px"
                      >
                        {approval === ApprovalState.PENDING ? (
                          <Dots>Approving</Dots>
                        ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                          'Approved'
                        ) : (
                          'Approve'
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowConfirm(true)
                        }}
                        disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                        variant={
                          !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                            ? 'danger'
                            : 'primary'
                        }
                      >
                        {error || 'Remove'}
                      </Button>
                    </RowBetween>
                  )}
                </div>
              </Wrapper>

              {pair ? (
                <div className="pa-6 bd-t">
                  <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                </div>
              ) : null}
            </AppBody>
          </MaxWidthLeft>
        </LeftPanel>
      ) : (
        <TransactionConfirmationModal
          isOpen={showConfirm}
          isPending={!!attemptingTxn}
          isSubmitted={!!txHash}
          isError={!!errorMsg}
          confirmContent={() => (
            <ConfirmationModalContent
              mainTitle="Confirm Liquidity"
              title="You will receive"
              topContent={modalHeader}
              bottomContent={modalBottom}
            />
          )}
          submittedContent={submittedContent}
          errorContent={errorContent}
          onDismiss={handleDismissConfirmation}
        />
      )}
    </>
  )
}
