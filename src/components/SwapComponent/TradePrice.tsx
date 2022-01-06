import { Price } from 'definixswap-sdk'
import React, { useMemo } from 'react'
import { Box, Flex, Text, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface TradePriceProps {
  price?: Price
  isPriceImpactCaution?: boolean
}

const StyledText = styled(Text)`
  ${({ theme }) => theme.textStyle.R_14M}
  color: ${({ theme }) => theme.colors.deepgrey};
  white-space: pre-line;
`

export default function TradePrice({ price, isPriceImpactCaution = false }: TradePriceProps) {
  const show = Boolean((price?.baseCurrency && price?.quoteCurrency))
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])
  
  return (
    <Flex
      alignItems="center"
      justifyContent={isMobile ? "flex-start" : "flex-end"}
      flexWrap="wrap"
    >
      {show && !isPriceImpactCaution ? (
        <Box>
          <Flex justifyContent={isMobile ? "flex-start" : "flex-end"}>
            <StyledText>
              1 {price?.baseCurrency?.symbol} = {price?.toSignificant(6) ?? '-'} {price?.quoteCurrency?.symbol}
            </StyledText>
          </Flex>
          <Flex justifyContent={isMobile ? "flex-start" : "flex-end"}>
            <StyledText>
              1 {price?.quoteCurrency?.symbol} = {price?.invert()?.toSignificant(6) ?? '-'} {price?.baseCurrency?.symbol}
            </StyledText>
          </Flex>
        </Box>
      ) : (
        '-'
      )}
    </Flex>
  )
}
