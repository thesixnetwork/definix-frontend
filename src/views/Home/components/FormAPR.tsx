import React from 'react'
import styled from 'styled-components'
import { ColorStyles, Flex, Grid, Text } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'

interface Props {
  isFarm?: boolean
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

  @media screen and (max-width: 1280px) {
    grid-template-areas:
      'lp lp'
      'total total'
      'apr image';
  }
`

const WrapImage = styled(Flex)`
  grid-area: image;
  @media screen and (max-width: 1280px) {
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 16px;
  }
`

const LpName = styled(Flex)`
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  margin-top: 20px;
  grid-area: lp;

  @media screen and (max-width: 1280px) {
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    margin-top: 0;
  }
`

const TotalLiquidity = styled(Flex)`
  margin-top: 4px;
  grid-area: total;

  .label {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
  }

  .value {
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
  }
  @media screen and (max-width: 1280px) {
    margin-top: 2px;

    .label {
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
    }

    .value {
      font-size: 12px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
    }
  }
`

const Apr = styled(Flex)`
  grid-area: apr;
  justify-content: flex-end;
  margin-top: 20px;

  .value {
    font-size: 28px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
  }
  @media screen and (max-width: 1280px) {
    justify-content: flex-start;
    margin-top: 16px;

    .value {
      font-size: 26px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
    }
  }
`

const FormAPR: React.FC<Props> = ({ isFarm = true, title, apr, totalAssetValue, Images }) => {
  return (
    <WrapGrid marginTop="20px">
      <WrapImage>{Images}</WrapImage>
      <LpName>
        <Text color={ColorStyles.BLACK}>{title}</Text>
      </LpName>
      <TotalLiquidity>
        <Text className="label" color="#999">
          {isFarm ? 'Total Liquidity' : 'Total Asset Value'}
        </Text>
        <CurrencyText marginLeft="8px" className="value" color="#999" value={totalAssetValue} />
      </TotalLiquidity>
      <Apr>
        <Flex flexDirection="column">
          <Text
            className="label"
            style={{
              fontSize: '12px',
              fontWeight: 500,
              fontStretch: 'normal',
              fontStyle: 'normal',
              lineHeight: 1.5,
              letterSpacing: 'normal',
            }}
            color="#ff6828"
          >
            APR
          </Text>
          <Text className="value" color="#222">
            {apr} %
          </Text>
        </Flex>
      </Apr>
    </WrapGrid>
  )
}

export default FormAPR
