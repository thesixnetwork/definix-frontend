import React, { useCallback, useMemo, useState } from 'react'
import { currencyEquals, Trade } from 'definixswap-sdk'
import { Modal, Box, Divider, ModalBody, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { useDerivedSwapInfo } from 'state/swap/hooks'
import { useToast } from 'state/toasts/hooks'
import { useSwapCallback } from 'hooks/useSwapCallback'
import KlaytnScopeLink from 'components/KlaytnScopeLink'
import { useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { ALLOWED_PRICE_IMPACT_HIGH, BLOCKED_PRICE_IMPACT_NON_EXPERT } from 'constants/index'
import { computeTradePriceBreakdown } from 'utils/prices'
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
  recipient,
  onDismiss = () => null,
  onDismissModal,
}: {
  recipient: string | null
  onDismiss?: () => void
  onDismissModal: () => void
}) {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])
  const { v2Trade: trade } = useDerivedSwapInfo()
  const [originalTrade, setOriginalTrade] = useState(trade)
  const [isPending, setIsPending] = useState(false)
  const [txHash, setTxHash] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()
  const { toastSuccess, toastError } = useToast()
  const { callback: swapCallback } = useSwapCallback(trade, allowedSlippage, deadline, recipient)

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])

  const onAcceptChanges = useCallback(() => {
    setOriginalTrade(trade)
  }, [trade])

  const handleSwap = useCallback(() => {
    if (
      !priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH) &&
      priceImpactWithoutFee.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)
    ) {
      if (!window.confirm(t('This swap has a price impact of at least 5%'))) {
        return
      }
    }
    if (!swapCallback) {
      return
    }
    setIsPending(true)
    setTxHash(undefined)
    swapCallback()
      .then((hash) => {
        setTxHash(hash)
        toastSuccess(
          t('{{Action}} Complete', {
            Action: t('actionSwap'),
          }),
          <KlaytnScopeLink hash={hash} />
        )
        onDismiss()
        onDismissModal()
      })
      .catch((error) => {
        setErrorMessage(error.message)
        toastError(
          t('{{Action}} Failed', {
            Action: t('actionSwap'),
          })
        )
        onDismiss()
        onDismissModal()
      })
  }, [priceImpactWithoutFee, swapCallback, t, toastSuccess, onDismiss, onDismissModal, toastError])

  return (
    <Modal title={t('Confirm Swap')} mobileFull onDismiss={onDismiss}>
      <ModalBody isBody>
        <Box width={isMobile ? '100%' : '472px'} height={isMobile ? '100vh' : '100%'}>
          {!txHash && trade && (
            <>
              <SwapModalHeader
                trade={trade}
                allowedSlippage={allowedSlippage}
                recipient={recipient}
                showAcceptChanges={showAcceptChanges}
                onAcceptChanges={onAcceptChanges}
              />
              <Divider mt="20px" mb="24px" />
              <SwapModalFooter
                onConfirm={handleSwap}
                trade={trade}
                disabledConfirm={showAcceptChanges}
                swapErrorMessage={errorMessage}
                isPending={isPending}
              />
            </>
          )}
        </Box>
      </ModalBody>
    </Modal>
  )
}
