import React from 'react'
import styled from 'styled-components'
import { CardBody, Text, ColorStyles } from '@fingerlabs/definixswap-uikit-v2'
import Card from 'uikitV2/components/Card'
import { Timeline } from 'react-twitter-widgets'

const WrapCardBody = styled(CardBody)`
  padding: 40px;

  @media screen and (max-width: 1280px) {
    padding: 20px;
  }
`

const Title = styled(Text)`
  font-size: 26px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.38;
  letter-spacing: normal;
  color: #222;

  @media screen and (max-width: 1280px) {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
  }
`

const Inner = styled.div`
  margin-top: 24px;
  height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;

  > div {
    margin-top: -1px;
  }

  @media screen and (max-width: 1280px) {
    margin-top: 20px;
  }
`

const CardTweet = () => {
  return (
    <Card>
      <WrapCardBody>
        <Title>Check out the latest information of Definix</Title>
        <Inner>
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: 'DefinixOfficial',
            }}
            options={{
              id: 'profile:DefinixOfficial',
              chrome: 'noheader, nofooter',
              height: '402',
              borderColor: 'transparent',
            }}
          />
        </Inner>
      </WrapCardBody>
    </Card>
  )
}

export default CardTweet
