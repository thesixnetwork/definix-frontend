import React, { useMemo } from 'react'
import { Currency, CurrencyAmount, Fraction, Percent } from 'definixswap-sdk'
import styled from 'styled-components'
import { Flex, Button, Text, ColorStyles, ButtonScales, NotiIcon, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { Field } from 'state/mint/actions'

const TitleText = styled(Text)`
  ${({ theme }) => theme.textStyle.R_16M}
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.mobileSwap} {
    ${({ theme }) => theme.textStyle.R_16M}
  }
`

const StyledNotiIcon = styled(NotiIcon)`
  flex-shrink: 0;
`

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
  allowedSlippage,
  isPending,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
  allowedSlippage: number;
  isPending: boolean;
}) {
  const { t } = useTranslation();
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <TitleText color={ColorStyles.DEEPGREY} mb="12px">
          {t('Estimated Returns')}
        </TitleText>

        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          mb="8px"
        >
          <Text 
            textStyle="R_14R"
            color={ColorStyles.MEDIUMGREY}
            mb={isMobile ? "4px" : "0px"}
          >
            {t('Deposited')}
          </Text>

          <Flex
            flexDirection="column"
            alignItems={isMobile ? "flex-start" : "flex-end"}
          >
            <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
              {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} {currencies[Field.CURRENCY_A]?.symbol}
            </Text>
            <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
              {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} {currencies[Field.CURRENCY_B]?.symbol}
            </Text>
          </Flex>
        </Flex>

        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          mb="8px"
        >
          <Text 
            textStyle="R_14R"
            color={ColorStyles.MEDIUMGREY}
            mb={isMobile ? "4px" : "0px"}
          >
            {t('Price Rate')}
          </Text>
          <Flex 
            flexDirection="column"
            alignItems={isMobile ? "flex-start" : "flex-end"}
          >
            <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
                  currencies[Field.CURRENCY_B]?.symbol
                }`}
            </Text>
            <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
              {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
                currencies[Field.CURRENCY_A]?.symbol
              }`}
            </Text>
          </Flex>
        </Flex>

        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
        >
          <Text 
            textStyle="R_14R"
            color={ColorStyles.MEDIUMGREY}
            mb={isMobile ? "4px" : "0px"}
          >
            {t('Share of Pool')}
          </Text>
          <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
            {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
          </Text>
        </Flex>
      </Flex>

      {!noLiquidity && (
        <Flex alignItems="flex-start" mt="20px">
          <StyledNotiIcon />
          <Text
            mt="-1px"
            ml="4px"
            textStyle="R_12R"
            color={ColorStyles.MEDIUMGREY}
            style={{whiteSpace:'pre-line'}}
          >
            {t('Output is estimated {{N}}', { N: `${allowedSlippage / 100}`})}
          </Text>
        </Flex>
      )}

      <Button onClick={onAdd} width="100%" scale={ButtonScales.LG} isLoading={isPending} mt="32px">
        {t(noLiquidity ? 'Create Pool & Supply' : 'Add Liquidity')}
      </Button>
    </Flex>
  )
}

export default ConfirmAddModalBottom
