import React from 'react'
import styled from 'styled-components'
import { Card, useMatchBreakpoints } from 'uikit-dev'
import bannerLarge from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-01.jpg'
import banner from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-02.jpg'
import bannerMobile from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-19.jpg'

const BannerStyle = styled.div`
  position: relative;

  img {
    display: block;
    width: 100%;
  }

  a,
  button {
    width: 142px;
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translate(-50%, 0);
  }
`

const TradingChallengeBanner = ({ large = false, children = null }) => {
  const { isSm } = useMatchBreakpoints()

  const Banner = () => (
    <BannerStyle>
      {/* eslint-disable-next-line no-nested-ternary */}
      <img src={isSm ? bannerMobile : large ? bannerLarge : banner} alt="" />
      {children}
    </BannerStyle>
  )

  if (large) {
    return <Banner />
  }

  return (
    <Card>
      <Banner />
    </Card>
  )
}

export default TradingChallengeBanner
