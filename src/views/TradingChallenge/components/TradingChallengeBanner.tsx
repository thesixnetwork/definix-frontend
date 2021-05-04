import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit-dev'
import bannerLarge from 'uikit-dev/images/fund-manager/banner-large.png'
import banner from 'uikit-dev/images/fund-manager/banner.png'

const BannerStyle = styled.div<{ large: boolean }>`
  position: relative;

  img {
    display: block;
    width: 100%;
  }

  a,
  button {
    width: 142px;
    position: absolute;
    bottom: ${({ large }) => (large ? '56px' : '48px')};
    right: 96px;
  }
`

const TradingChallengeBanner = ({ large = false, children }) => {
  const Banner = () => (
    <BannerStyle large={large}>
      <img src={large ? bannerLarge : banner} alt="" />
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
