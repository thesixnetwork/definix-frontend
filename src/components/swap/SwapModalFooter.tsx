import { Trade, TradeType } from 'definixswap-sdk'
import React, { useMemo, useState } from 'react'
import { Button, Text } from 'uikit-dev'
import { Field } from '../../state/swap/actions'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SwapCallbackError } from './styleds'
import TradePrice from './TradePrice'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <AutoColumn gap="16px" className="mb-6">
        <RowBetween>
          <Text fontSize="14px" color="textSubtle">
            Price Rate
          </Text>
          <TradePrice price={trade?.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
        </RowBetween>

        <RowBetween>
          <RowFixed mb="0 !important">
            <Text fontSize="14px" color="textSubtle">
              {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </Text>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed mb="0 !important">
            <Text fontSize="14px" bold>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="14px" marginLeft="4px" bold>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed mb="0 !important">
            <Text fontSize="14px" color="textSubtle">
              Price Impact
            </Text>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed mb="0 !important">
            <Text fontSize="14px" color="textSubtle">
              Liquidity Provider Fee
            </Text>
            <QuestionHelper
              text="For each trade a 0.2% fee is paid.
0.15% goes to liquidity providers and 0.05% goes to the Definix Swap treasury"
            />
          </RowFixed>
          <Text fontSize="14px" bold>
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <Button
          onClick={onConfirm}
          disabled={disabledConfirm}
          variant={severity > 2 ? 'danger' : 'primary'}
          radii="card"
          id="confirm-swap-or-send"
          fullWidth
        >
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
