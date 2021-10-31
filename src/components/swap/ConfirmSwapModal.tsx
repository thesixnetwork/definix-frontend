import { currencyEquals, Trade } from 'definixswap-sdk'
import { useActiveWeb3React } from 'hooks'
import React, { useCallback, useMemo } from 'react'
import { Button } from 'uikit-dev'
import swap from 'uikit-dev/animation/swap.json'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
  TransactionSubmittedContent,
} from '../TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
}: {
  isOpen: boolean
  trade: Trade | undefined
  originalTrade: Trade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onDismiss: () => void
}) {
  const { chainId } = useActiveWeb3React()

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade])

  const modalHeaderWithoutAction = useCallback(() => {
    return trade ? <SwapModalHeader trade={trade} onlyCurrency /> : null
  }, [trade])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
      />
    ) : null
  }, [allowedSlippage, onConfirm, showAcceptChanges, swapErrorMessage, trade])

  const confirmContent = useCallback(
    () => (
      <ConfirmationModalContent
        mainTitle="Confirm Swap"
        title=""
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    ),
    [modalBottom, modalHeader]
  )

  const submittedContent = useCallback(
    () => (
      <TransactionSubmittedContent
        title="Swap Complete"
        date={`${new Date().toDateString()}, ${new Date().toTimeString().split(" ")[0]}`}
        chainId={chainId}
        hash={txHash}
        content={modalHeaderWithoutAction}
        button={
          <Button onClick={onDismiss} radii="card" fullWidth>
            Back to Swap
          </Button>
        }
      />
    ),
    [chainId, modalHeaderWithoutAction, onDismiss, txHash]
  )

  const errorContent = useCallback(
    () => (
      <TransactionErrorContent
        title="Swap Failed"
        date={`${new Date().toDateString()}, ${new Date().toTimeString().split(" ")[0]}`}
        chainId={chainId}
        hash={txHash}
        content={modalHeaderWithoutAction}
        button={
          <Button onClick={onDismiss} radii="card" fullWidth>
            Back to Swap
          </Button>
        }
      />
    ),
    [chainId, modalHeaderWithoutAction, onDismiss, txHash]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      isPending={attemptingTxn}
      isSubmitted={!!txHash}
      isError={!!swapErrorMessage}
      confirmContent={confirmContent}
      pendingIcon={swap}
      submittedContent={submittedContent}
      errorContent={errorContent}
      onDismiss={onDismiss}
    />
  )
}
