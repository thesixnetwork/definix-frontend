import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  CardBody,
  Text,
  Flex,
  ImgHomeFarmFinix1x,
  ImgHomeFarmFinix2x,
  ImgHomeFarmFinix3x,
  ImageSet,
} from '@fingerlabs/definixswap-uikit-v2'
import Card from 'uikitV2/components/Card'
import FarmHighAPR from './FarmHighAPR'
import ExploreHighAPR from './ExploreHighAPR'

const Title = styled(Text)`
  align-self: center;
  font-size: 26px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.38;
  letter-spacing: normal;
  color: #fff;
  @media screen and (max-width: 1280px) {
    font-size: 26px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
  }
`

const InnerBox = styled(Link)`
  display: flex;
  padding: 24px;
  border-radius: 8px;
  min-height: 166px;
  background-color: #fff;
  @media screen and (max-width: 1280px) {
    padding: 20px;
  }
`

const WrapCardBody = styled(CardBody)`
  padding: 40px;
  @media screen and (max-width: 1280px) {
    padding: 20px;
  }
`

const StyledRebalanceTitle = styled(Flex)`
  position: relative;
  padding-top: 40px;
  padding-bottom: 24px;
  @media screen and (max-width: 1280px) {
    padding-top: 28px;
    padding-bottom: 20px;
  }
`

const Character = styled(ImageSet)`
  flex-shrink: 0;
  width: 184px;
  height: 100px;
  @media screen and (max-width: 1280px) {
    width: 120px;
    height: 65px;
  }
`

const CardHighAPR = () => {
  return (
    <Card style={{ backgroundColor: '#ff6828' }}>
      <WrapCardBody>
        <Flex alignItems="flex-end" justifyContent="space-between">
          <Title>Stake Farms with high APR</Title>
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
          <Title>Meet Rebalancing with Definix unique differentiation.</Title>
        </StyledRebalanceTitle>
        <InnerBox to="/rebalancing">
          <ExploreHighAPR />
        </InnerBox>
      </WrapCardBody>
    </Card>
  )
}

export default CardHighAPR
