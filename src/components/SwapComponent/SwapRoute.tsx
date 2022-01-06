import { Trade } from 'definixswap-sdk'
import React, { memo } from 'react'
import { Text, Flex, ArrowDoubleArrowIcon, ColorStyles, Coin } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

export default memo(function SwapRoute({ trade, isMobile, isPriceImpactCaution }: { 
  trade: Trade; 
  isMobile: boolean; 
  isPriceImpactCaution?:boolean; 
}) {
  const { t } = useTranslation();
  return (
    <Flex 
      alignItems="center"
      justifyContent={isMobile ? "flex-start" :"flex-end"}
      flexWrap="wrap"
    >
      {!isPriceImpactCaution && trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          <Flex 
            alignItems="center"
            key={token?.symbol}
            mr={isLastItem ? "0px" : "10px"}
            mb={isMobile ? "8px" : "0px"}
          >
            <Coin
              size={isMobile ? "20px" : "22px"}
              symbol={token?.symbol}
              mr={isMobile ? "9px" : "6px"}
            />
            <Text
              textStyle="R_14M"
              color={ColorStyles.DEEPGREY}
              mr={isLastItem ? "0px" : isMobile ? "14px" : "10px"}
            >
              {token.symbol}
            </Text>
            {!isLastItem && (
              <Flex>
                <ArrowDoubleArrowIcon />
              </Flex>
            )}
          </Flex>
        )
      })}
      {isPriceImpactCaution && <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>{t('There are no routes.')}</Text>}
    </Flex>
  )
})
