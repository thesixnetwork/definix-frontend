import React from 'react'
import styled from 'styled-components'
import { Card, useMatchBreakpoints } from 'uikit-dev'
import bannerLarge from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-01.jpg'
import banner from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-02.jpg'
import bannerMobile from 'uikit-dev/images/for-trading-challenge/TT-Banner-for-dashboard.jpg'

const BannerStyle = styled.div`
  position: relative;

  img {
    display: block;
    width: 100%;
  }

  a,
  button {
    position: absolute;

    left: 50%;
    transform: translate(-50%, 0);

    ${({ theme }) => theme.mediaQueries.xs} {
      bottom: 20px;
      padding: 0 12px;
      font-size: 11px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      bottom: 24px;
      padding: 0 16px;
      font-size: 14px;
    }
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
