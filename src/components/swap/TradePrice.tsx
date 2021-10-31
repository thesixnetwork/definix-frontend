import { Price } from 'definixswap-sdk'
import React from 'react'
import { IconButton, SyncAltIcon, Text } from 'uikit-dev'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted ? (
    <>
      <Text fontSize="14px" bold>
        {price?.quoteCurrency?.symbol}
      </Text>
      <Text fontSize="14px" color="textSubtle" className="mx-1">
        per
      </Text>
      <Text fontSize="14px" bold>
        {price?.baseCurrency?.symbol}
      </Text>
    </>
  ) : (
    <>
      <Text fontSize="14px" bold>
        {price?.baseCurrency?.symbol}
      </Text>
      <Text fontSize="14px" color="textSubtle" className="mx-1">
        per
      </Text>
      <Text fontSize="14px" bold>
        {price?.quoteCurrency?.symbol}
      </Text>
    </>
  )

  return (
    <div className="flex align-center justify-end flex-wrap">
      {show ? (
        <>
          <Text fontSize="14px" className="mr-1" bold>
            {formattedPrice ?? '-'}
          </Text>
          {label}
          <IconButton size="xs" onClick={() => setShowInverted(!showInverted)} variant="tertiary" className="ml-2">
            <SyncAltIcon width="14px" color="primary" />
          </IconButton>
        </>
      ) : (
        '-'
      )}
    </div>
  )
}
