import { Trade, TradeType } from 'definixswap-sdk'
import { useTranslation } from 'react-i18next'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Button, Text, Flex, Box, ChangeBottomIcon, Noti, NotiType, Coin } from '@fingerlabs/definixswap-uikit-v2'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'

const BalanceText = styled(Text)<{ isAcceptChange: boolean }>`
  ${({ theme }) => theme.textStyle.R_16R}
  color: ${({ isAcceptChange, theme }) => (isAcceptChange ? theme.colors.red : theme.colors.black)};
`

const WrapIcon = styled(Flex)`
  margin-top: -30px;
  transform: translateY(20px);
  justify-content: center;
`

const WrapPriceUpdate = styled(Flex)`
  margin-top: 20px;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: solid 1px ${({ theme }) => theme.colors.lightGrey50};
  background-color: rgba(224, 224, 224, 0.1);
}
`

const SwapTokenInfo = ({
  isInput,
  trade,
  showAcceptChanges,
  priceImpactSeverity,
}: {
  isInput: boolean
  trade: Trade
  showAcceptChanges?: boolean
  priceImpactSeverity?: 0 | 1 | 2 | 3 | 4
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" height="60px">
      <Flex alignItems="center">
        <Box mr="12px" mt="2px">
          {isInput && <Coin size="32px" symbol={trade.inputAmount.currency?.symbol} />}
          {!isInput && <Coin size="32px" symbol={trade.outputAmount.currency?.symbol} />}
        </Box>
        <Text textStyle="R_16M">
          {isInput && trade.inputAmount.currency.symbol}
          {!isInput && trade.outputAmount.currency.symbol}
        </Text>
      </Flex>
      {isInput && (
        <BalanceText isAcceptChange={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT}>
          {trade.inputAmount.toSignificant(6)}
        </BalanceText>
      )}
      {!isInput && (
        <BalanceText
          // isAcceptChange={priceImpactSeverity > 2}
          isAcceptChange={showAcceptChanges}
        >
          {trade.outputAmount.toSignificant(6)}
        </BalanceText>
      )}
    </Flex>
  )
}

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
  const { t } = useTranslation()
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage,
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <SwapTokenInfo isInput trade={trade} showAcceptChanges={showAcceptChanges} />
        <WrapIcon>
          <ChangeBottomIcon />
        </WrapIcon>
        <SwapTokenInfo
          isInput={false}
          trade={trade}
          showAcceptChanges={showAcceptChanges}
          priceImpactSeverity={priceImpactSeverity}
        />
      </Flex>

      {!onlyCurrency && showAcceptChanges && (
        <WrapPriceUpdate>
          <Noti type={NotiType.ALERT}>{t('Price update')}</Noti>
          <Button minWidth="107px" p="7px 20px" style={{ whiteSpace: 'pre' }} onClick={onAcceptChanges}>
            {t('Accept')}
          </Button>
        </WrapPriceUpdate>
      )}
    </Flex>
  )
}
