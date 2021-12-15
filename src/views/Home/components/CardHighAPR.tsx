import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  ColorStyles,
  Text,
  Flex,
  ImgHomeFarmFinix1x,
  ImgHomeFarmFinix2x,
  ImgHomeFarmFinix3x,
  ImageSet,
} from '@fingerlabs/definixswap-uikit-v2'
import FarmHighAPR from './FarmHighAPR'
import ExploreHighAPR from './ExploreHighAPR'

const Title = styled(Text)`
  align-self: center;
  ${({ theme }) => theme.textStyle.R_26B}
  color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_20B}
  }
`

const InnerBox = styled(Link)`
  display: flex;
  padding: 24px;
  border-radius: 8px;
  min-height: 166px;
  background-color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px;
  }
`

const WrapCardBody = styled(CardBody)`
  padding: 40px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px;
  }
`

const StyledRebalanceTitle = styled(Flex)`
  position: relative;
  padding-top: 40px;
  padding-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-top: 28px;
    padding-bottom: 20px;
  }
`

const Character = styled(ImageSet)`
  /* flex-direction: column;
  align-items: center;
  justify-content: flex-end; */
  width: 184px;
  height: 100px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 120px;
    height: 65px;
  }
`

const CardHighAPR = () => {
  const { t } = useTranslation()
  return (
    <Card bg={ColorStyles.ORANGE}>
      <WrapCardBody>
        <Flex alignItems="flex-end" justifyContent="space-between">
          <Title>{t('Stake Farms with high APR')}</Title>
          <Character
            srcSet={[ImgHomeFarmFinix1x, ImgHomeFarmFinix2x, ImgHomeFarmFinix3x]}
            alt=""
            width={184}
            height={100}
          />
          {/* <HomeFarmFinixIcon viewBox="0 0 184 100" /> */}
        </Flex>
        <InnerBox to="/farm">
          <FarmHighAPR />
        </InnerBox>
        <StyledRebalanceTitle>
          <Title>{t('Meet Rebalancing with Definix unique differentiation.')}</Title>
        </StyledRebalanceTitle>
        <InnerBox to="/rebalancing">
          <ExploreHighAPR />
        </InnerBox>
      </WrapCardBody>
    </Card>
  )
}

export default CardHighAPR
