import { Trade, TradeType } from 'definixswap-sdk'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Flex, ColorStyles, Helper, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

function TradeSummary({
  trade,
  allowedSlippage,
  className,
  isPriceImpactCaution,
}: {
  trade: Trade
  allowedSlippage: number
  className?: string
  isPriceImpactCaution?: boolean;
}) {
  const { t } = useTranslation();
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  return (
    <Flex flexDirection="column">
      <Flex
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
        mb="12px"
      >
        <Flex mb={isMobile ? "4px" : "0px"}>
          <Text
            textStyle="R_14R"
            color={ColorStyles.MEDIUMGREY}
          >
            {t(isExactIn ? 'Minimum Received' : 'Maximum sold')}
          </Text>
          <Helper ml="4px" text={t('Your transaction will revert if there')} />
        </Flex>
        <Text
          textStyle="R_14M"
          color={ColorStyles.DEEPGREY}
          textAlign={isMobile ? "left" : "right"}
          style={{whiteSpace: "pre"}}
        >
          {!isPriceImpactCaution && (
            <>
              {isExactIn ? 
              `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-' : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? 
                '-'}
            </>
          )}
          {isPriceImpactCaution && (
            <>
              - {trade.outputAmount.currency.symbol}
            </>
          )}
        </Text>
      </Flex>
      
      <Flex
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        mb="12px"
      >
        <Flex mb={isMobile ? "4px" : "0px"}>
          <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
            {t('Price Impact')}
          </Text>
          <Helper ml="4px" text={t('The difference between the market')} />
        </Flex>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </Flex>

      <Flex
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
      >
        <Flex
          mb={isMobile ? "4px" : "0px"}
        >
          <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
            {t('Liquidity Provider Fee')}
          </Text>
          <Helper ml="4px"
            text={t('For each trade a 0.2%')}
          />
        </Flex>
        <Text
          textStyle="R_14M"
          color={ColorStyles.DEEPGREY}
          textAlign={isMobile ? "left" : "right"}
          style={{whiteSpace: "pre"}}
        >
          {!isPriceImpactCaution && (
            <>
              {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
            </>
          )}
          {isPriceImpactCaution && `- ${trade.inputAmount.currency.symbol}`}
        </Text>
      </Flex>
    </Flex>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
  isMobile?: boolean;
  isRoute?: boolean;
  isPriceImpactCaution?: boolean;
}

export function AdvancedSwapDetails({
  trade,
  isMobile,
  isRoute = true,
  isPriceImpactCaution
}: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const { t } = useTranslation();

  const showRoute = Boolean(trade && trade.route.path.length > 2 && isRoute)

  return trade ? (
    <Flex flexDirection="column">
      <TradeSummary 
        trade={trade}
        allowedSlippage={allowedSlippage}
        className={showRoute ? 'col-6' : 'col-12'}
        isPriceImpactCaution={isPriceImpactCaution}
      />
      {showRoute && (
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems="flex-start"
          mt="8px"
        >
          <Flex mb={isMobile ? "8px" : "0px"}>
            <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
              {t('Routing')}
            </Text>
            <Helper ml="4px" text={t('Routing through these tokens')} />
          </Flex>
          <SwapRoute 
            trade={trade}
            isMobile={isMobile}
            isPriceImpactCaution={isPriceImpactCaution}
          />
        </Flex>
      )}
    </Flex>
  ) : (
    <></>
  )
}
