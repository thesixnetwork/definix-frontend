import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import lady from 'uikit-dev/images/for-ui-v2/AUTO-RE-BALANCING-MUTUAL-FUNDS.png'
import definixLongTerm from 'uikit-dev/images/for-ui-v2/definix-long-term-stake-with-voting-system.png'
import definixVoting from 'uikit-dev/images/for-ui-v2/voting-banner.png'

const StyledBannerLady = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: url(${lady});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 48px 40% 48px 24px;
    border-radius: unset;
    height: 327px;

    &:before {
      width: 40%;
      opacity: 1;
    }

    h2 {
      font-size: 32px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }
`

const StyledBannerLongTerm = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: url(${definixLongTerm});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 68px 40% 48px 24px;
    border-radius: unset;
    height: 327px;

    &:before {
      width: 40%;
      opacity: 1;
    }

    h2 {
      font-size: 32px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }
`

const StyledBannerVoting = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: url(${definixVoting});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 68px 40% 48px 24px;
    border-radius: unset;
    height: 327px;

    &:before {
      width: 40%;
      opacity: 1;
    }

    h2 {
      font-size: 28px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }
`

const SpecialButton = styled(Button)`
  position: relative;
  padding: 12px 24px;
  background: linear-gradient(#f3d36c, #e27d3a);
  overflow: hidden;
  border-radius: 40px;
  color: #fff;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    background: #f3d36c;
    transform: scaleX(0);
    transform-origin: 100%;
    transition: transform 0.6s ease;
    border-radius: 40px;
  }

  &:hover {
    &:before {
      transform-origin: 0;
      transform: scaleX(1);
      border-radius: 40px;
    }

    span {
      color: #e27d3a !important;
    }
  }

  span {
    position: relative;
    z-index: 1;
    transition: all 0.6s ease;
    border-radius: 40px;
  }
`

const SpecialOutline = styled(Button)`
  position: relative;
  padding: 10px 24px;
  background-color: unset;
  overflow: hidden;
  border-radius: 40px;
  border: 1px solid #1587c9;
  color: #1587c9;
  cursor: unset;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: scaleX(0);
    transform-origin: 100%;
    transition: transform 0.6s ease;
    border-radius: 40px;
  }

  &:hover {
    &:before {
      transform-origin: 0;
      transform: scaleX(1);
      // background: #d1eeff;
      border-radius: 40px;
    }

    span {
      color: #1587c9 !important;
    }
  }

  span {
    position: relative;
    z-index: 1;
    transition: all 0.6s ease;
  }
`

const StyledSlider = styled(Slider)`
  .slick-prev {
    width: 4rem;
    height: 4rem;
    left: -3rem;
  }
  .slick-next {
    width: 4rem;
    height: 4rem;
    right: -3rem;
  }
  .slick-prev:before,
  .slick-next:before {
    color: #0973b9;
    opacity: unset;
    font-size: xx-large;
  }
  .slick-dots {
    bottom: unset;
  }
  .slick-dots li button:before {
    background: #0973b9;
    border-radius: 6px;
  }
  .slick-dots li.slick-active button:before {
    opacity: unset;
  }
  .slick-list {
    border-radius: 8px;
  }
`

const CardAutoRebalancing = ({ className = '' }) => {
  // const openDate = new Date(1628841600000)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 10000,
    autoplay: true,
    dotsClass: 'slick-dots slick-thumb',
  }

  return (
    <div>
      <StyledSlider {...settings}>
        <div>
          <StyledBannerLady className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Text bold fontSize="22px">
                INTRODUCING
              </Text>
              <Heading className="mb-2" color="primary">
                DEFINIX REBALANCING FARM
              </Heading>
              <Text color="textSubtle" fontSize="12px">
                Rebalancing involves periodically buying or selling assets in a portfolio to maintain an original or
                desired level of asset allocation or risk.
              </Text>
              <Text bold fontSize="12px">
                Sound complicated? Don’t worry we will take care your investment automatically with our investment
                partner
              </Text>
              <div className="mt-6">
                <SpecialButton as={Link} to="/rebalancing">
                  <span>Interesting, I want to invest</span>
                </SpecialButton>
              </div>
            </div>
          </StyledBannerLady>
        </div>
        <div>
          <StyledBannerLongTerm className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Heading className="mb-2" color="primary">
                FINIX LONG-TERM STAKE WITH VOTING SYSTEM
              </Heading>
              <Text color="textSubtle" fontSize="12px">
                New financial product from DEFINIX. It is the single-sided pool stake FINIX earn vFINIX.{' '}
              </Text>
              <Text bold fontSize="12px">
                vFINIX can vote for rewarding fee return from a liquidity pool and discount fee conditioning for
                Rebalancing Farm.
              </Text>
              <div className="mt-6">
                <SpecialOutline as={Link} to="/">
                  <span>Coming soon!</span>
                </SpecialOutline>
              </div>
            </div>
          </StyledBannerLongTerm>
        </div>
        <div>
          <StyledBannerVoting className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Heading className="mb-2" color="primary">
                DRIVE FORWARD TOGETHER WITH DECENTRALIZED VOTING
              </Heading>
              <Text color="textSubtle" fontSize="12px">
                Community Proposal is a great way to say your words and to reflects the community feeling about your
                ideas.{' '}
              </Text>
              <div className="mt-6">
                <SpecialOutline as={Link} to="/">
                  <span>Coming soon!</span>
                </SpecialOutline>
              </div>
            </div>
          </StyledBannerVoting>
        </div>
      </StyledSlider>
    </div>
  )
}

export default CardAutoRebalancing
