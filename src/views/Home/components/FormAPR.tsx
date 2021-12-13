import React from 'react'
import styled from 'styled-components'
import { ColorStyles, Flex, Grid, Text } from 'definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import CurrencyText from 'components/CurrencyText'

interface Props {
  title: string
  apr: string
  Images: React.ReactElement
  totalAssetValue?: number
}

const WrapGrid = styled(Grid)`
  width: 100%;
  margin-top: 0;
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
  ${({ theme }) => theme.textStyle.R_18B}
  margin-top: 20px;
  grid-area: lp;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16B}
    margin-top: 0;
  }
`

const TotalLiquidity = styled(Flex)`
  margin-top: 4px;
  grid-area: total;

  .label {
    ${({ theme }) => theme.textStyle.R_14R}
  }

  .value {
    ${({ theme }) => theme.textStyle.R_14B}
  }
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 2px;

    .label {
      ${({ theme }) => theme.textStyle.R_12R}
    }

    .value {
      ${({ theme }) => theme.textStyle.R_12B}
    }
  }
`

const Apr = styled(Flex)`
  grid-area: apr;
  justify-content: flex-end;
  margin-top: 20px;

  .value {
    ${({ theme }) => theme.textStyle.R_28B}
  }
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    justify-content: flex-start;
    margin-top: 16px;

    .value {
      ${({ theme }) => theme.textStyle.R_26B}
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
        <CurrencyText ml="S_8" className="value" color={ColorStyles.MEDIUMGREY} value={totalAssetValue} />
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
