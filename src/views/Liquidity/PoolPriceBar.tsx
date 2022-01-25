import React, { useMemo } from 'react'
import { Currency, Percent, Price } from 'definixswap-sdk'
import { Text, Flex, ColorStyles, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { ONE_BIPS } from 'config/constants'
import { Field } from '../../state/mint/actions'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" mb="8px">
        <Flex mb={isMobile ? '4px' : '0px'}>
          <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
            {t('Price Rate')}
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Text textStyle="R_14M" color={ColorStyles.DEEPGREY} textAlign={isMobile ? 'left' : 'right'}>
            1 {currencies[Field.CURRENCY_A]?.symbol} = {price?.toSignificant(6) ?? '-'}{' '}
            {currencies[Field.CURRENCY_B]?.symbol}
          </Text>
          <Text textStyle="R_14M" color={ColorStyles.DEEPGREY} textAlign={isMobile ? 'left' : 'right'}>
            1 {currencies[Field.CURRENCY_B]?.symbol} = {price?.invert()?.toSignificant(6) ?? '-'}{' '}
            {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </Flex>
      </Flex>

      <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
        <Text mb={isMobile ? '4px' : '0px'} textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
          {t('Share of Pool')}
        </Text>
        <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(PoolPriceBar)
