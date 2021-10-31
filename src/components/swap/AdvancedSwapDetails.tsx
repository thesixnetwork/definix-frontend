import { Trade, TradeType } from 'definixswap-sdk'
import React from 'react'
import { Text } from 'uikit-dev'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

function TradeSummary({
  trade,
  allowedSlippage,
  className,
}: {
  trade: Trade
  allowedSlippage: number
  className?: string
}) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <div className={className}>
      <RowBetween align="baseline">
        <RowFixed>
          <Text fontSize="12px" color="textSubtle">
            {isExactIn ? 'Minimum received' : 'Maximum sold'}
          </Text>
          <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px" fontWeight="600" textAlign="right">
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>

      <RowBetween align="baseline">
        <RowFixed margin="0">
          <Text fontSize="12px" color="textSubtle">
            Price Impact
          </Text>
          <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </RowBetween>

      <RowBetween>
        <RowFixed marginBottom="0 !important">
          <Text fontSize="12px" color="textSubtle">
            Liquidity Provider Fee
          </Text>
          <QuestionHelper
            text="For each trade a 0.2% fee is paid.
0.15% goes to liquidity providers and 0.05% goes to the Definix Swap treasury"
          />
        </RowFixed>
        <Text fontSize="14px" fontWeight="600" textAlign="right">
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </Text>
      </RowBetween>
    </div>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return trade ? (
    <div className={`flex ${trade ? 'mb-5' : ''}`}>
      {showRoute && (
        <AutoColumn className="col-6">
          <RowFixed className="mb-3">
            <Text fontSize="14px" bold>
              Routing
            </Text>
            <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
          </RowFixed>
          <SwapRoute trade={trade} />
        </AutoColumn>
      )}

      <TradeSummary trade={trade} allowedSlippage={allowedSlippage} className={showRoute ? 'col-6 pl-6' : 'col-12'} />
    </div>
  ) : (
    <></>
  )
}
