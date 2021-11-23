import React from 'react'
import styled, { css } from 'styled-components'
import { ColorStyles, Flex, Grid, Text, textStyle } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'

interface Props {
  title: string
  apr: string
  Images: React.ReactElement
  totalAssetValue?: number
}

const WrapGrid = styled(Grid)`
  width: 100%;
  grid-template-columns: repeat(2, 80%, 20%);
  grid-template-areas:
    'image image'
    'lp apr'
    'total apr';

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    grid-template-areas:
      'lp lp'
      'total total'
      'apr image';
  }
`

const WrapImage = styled(Flex)`
  grid-area: image;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 16px;
  }
`

const LpName = styled(Flex)`
  ${css(textStyle.R_18B)}
  margin-top: 20px;
  grid-area: lp;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${css(textStyle.R_16B)}
    margin-top: 0;
  }
`

const TotalLiquidity = styled(Flex)`
  margin-top: 4px;
  grid-area: total;

  .label {
    ${css(textStyle.R_14R)}
  }

  .value {
    ${css(textStyle.R_14B)}
  }
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 2px;

    .label {
      ${css(textStyle.R_12R)}
    }

    .value {
      ${css(textStyle.R_12B)}
    }
  }
`

const Apr = styled(Flex)`
  grid-area: apr;
  justify-content: flex-end;
  margin-top: 20px;

  .value {
    ${css(textStyle.R_28B)}
  }
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    justify-content: flex-start;
    margin-top: 16px;

    .value {
      ${css(textStyle.R_26B)}
    }
  }
`

const FormAPR: React.FC<Props> = ({ title, apr, totalAssetValue, Images }) => {
  const { t } = useTranslation()

  return (
    <WrapGrid mt="S_20">
      <WrapImage>{Images}</WrapImage>
      <LpName>
        <Text color={ColorStyles.BLACK}>{title}</Text>
      </LpName>
      <TotalLiquidity>
        <Text className="label" color={ColorStyles.MEDIUMGREY}>
          {t('Total Liquidity')}
        </Text>
        <Text className="value" ml="S_8" color={ColorStyles.MEDIUMGREY}>
          $ {totalAssetValue}
        </Text>
      </TotalLiquidity>
      <Apr>
        <Flex flexDirection="column">
          <Text className="label" textStyle="R_12M" color={ColorStyles.ORANGE}>
            {t('APR')}
          </Text>
          <Text className="value" color={ColorStyles.BLACK}>
            {apr} %
          </Text>
        </Flex>
      </Apr>
    </WrapGrid>
  )
}

export default FormAPR
