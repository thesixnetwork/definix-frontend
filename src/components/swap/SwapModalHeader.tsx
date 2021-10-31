import { Trade, TradeType } from 'definixswap-sdk'
import React, { useContext, useMemo } from 'react'
import { ArrowDown } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { Button, ErrorIcon, Text } from 'uikit-dev'
import { Field } from '../../state/swap/actions'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'

const PriceInfoText = styled(Text)`
  span {
    font-weight: 600;
  }
`

export default function SwapModalHeader({
  trade,
  allowedSlippage = 0,
  recipient = null,
  showAcceptChanges = false,
  onlyCurrency = false,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage?: number
  recipient?: string | null
  showAcceptChanges?: boolean
  onlyCurrency?: boolean
  onAcceptChanges?: () => void
}) {
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage,
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap="24px">
      <AutoColumn gap="16px">
        <RowBetween align="flex-end">
          <RowFixed mb="0 !important">
            <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
            <Text
              fontSize="24px"
              fontWeight="500"
              color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.colors.primary : 'text'}
            >
              {trade.inputAmount.toSignificant(6)}
            </Text>
          </RowFixed>
          <RowFixed mb="0 !important">
            <Text fontSize="24px" fontWeight="500">
              {trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>

        <RowFixed mb="0 !important">
          <ArrowDown size="16" color={theme.colors.textSubtle} style={{ marginLeft: '4px', minWidth: '16px' }} />
        </RowFixed>

        <RowBetween align="flex-end">
          <RowFixed mb="0 !important">
            <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
            <Text fontSize="24px" fontWeight="500" color={priceImpactSeverity > 2 ? theme.colors.failure : 'text'}>
              {trade.outputAmount.toSignificant(6)}
            </Text>
          </RowFixed>
          <RowFixed mb="0 !important">
            <Text fontSize="24px" fontWeight="500">
              {trade.outputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </AutoColumn>

      {!onlyCurrency && (
        <>
          {showAcceptChanges ? (
            <RowBetween>
              <div className="flex align-center">
                <ErrorIcon className="mr-2" />
                <Text>Price Updated</Text>
              </div>
              <Button onClick={onAcceptChanges} size="sm" className="flex-shrink">
                Accept Price
              </Button>
            </RowBetween>
          ) : null}

          {trade.tradeType === TradeType.EXACT_INPUT ? (
            <PriceInfoText>
              {`Output is estimated. You will receive at least `}
              <span>
                {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
              </span>
              {' or the transaction will revert.'}
            </PriceInfoText>
          ) : (
            <PriceInfoText>
              {`Input is estimated. You will sell at most `}
              <span>
                {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
              </span>
              {' or the transaction will revert.'}
            </PriceInfoText>
          )}

          {recipient !== null ? (
            <Text>
              Output will be sent to{' '}
              <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
            </Text>
          ) : null}
        </>
      )}
    </AutoColumn>
  )
}
