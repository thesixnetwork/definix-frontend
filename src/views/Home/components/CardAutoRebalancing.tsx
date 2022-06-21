import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, Heading, Text, useModal, useMatchBreakpoints } from 'uikit-dev'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useTheme from 'hooks/useTheme'
import { usePrivateData } from 'hooks/useLongTermStake'
import SuperStakeModal from 'uikit-dev/widgets/WalletModal/SuperStakeModal'
import StartLongTermStakeModal from 'uikit-dev/widgets/WalletModal/StartLongTermStakeModal'
import lady from 'uikit-dev/images/for-ui-v2/AUTO-RE-BALANCING-MUTUAL-FUNDS.png'
import definixLongTerm from 'uikit-dev/images/for-ui-v2/definix-long-term-stake-with-voting-system.png'
import velo from 'uikit-dev/images/for-ui-v2/banner/velo-banner.png'
import dingoxSix from 'uikit-dev/images/for-ui-v2/banner/dingoxsix.png'
import superStakeWhite from 'uikit-dev/images/for-ui-v2/banner/super-stake-white.png'
import superStakeBlack from 'uikit-dev/images/for-ui-v2/banner/super-stake-black.png'
import logoDingoxSixBlack from 'uikit-dev/images/for-ui-v2/banner/logo-dingoxsix-black.png'
import logoDingoxSixWhite from 'uikit-dev/images/for-ui-v2/banner/logo-dingoxsix-white.png'
import logoVoteBannerWhite from 'uikit-dev/images/for-ui-v2/banner/logo-banner-white.png'
import logoVoteBannerDark from 'uikit-dev/images/for-ui-v2/banner/logo-banner-dark.png'
import logoFinixHavingBanner from 'uikit-dev/images/for-ui-v2/banner/logo-banner-finix.png'
import logoDefinixSixProtocol from 'uikit-dev/images/for-ui-v2/banner/logo-definix-six-protocol.png'

const StyledBannerFinixToken = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  height: 326px;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: ${({ theme }) => (theme.isDark ? `url(${logoFinixHavingBanner})` : `url(${logoFinixHavingBanner})`)};
    background-size: contain;
    background-position: right center;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 28px;
  }

  h3 {
    font-size: 14px !important;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 100px 24px;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 90px 40% 48px 24px;
    border-radius: unset;
    height: 304px;

    &:before {
      width: 40%;
      opacity: 1;
      margin-right: 40px;
    }

    h2 {
      font-size: 42px !important;
    }

    h3 {
      font-size: 18px !important;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 90px 40% 48px 50px !important;
    &:before {
      margin-right: 50px !important;
    }
  }
`

const StyledBannerVoting = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  height: 326px;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: ${({ theme }) => (theme.isDark ? `url(${logoVoteBannerDark})` : `url(${logoVoteBannerWhite})`)};
    background-size: contain;
    background-position: right center;
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

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 38px 24px;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 70px 40% 48px 24px;
    border-radius: unset;
    height: 304px;

    &:before {
      width: 40%;
      opacity: 1;
      margin-right: 10px;
    }

    h2 {
      font-size: 28px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }
`
const StyledBannerSuperStake = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  height: 326px;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: ${({ theme }) => (theme.isDark ? `url(${superStakeBlack})` : `url(${superStakeWhite})`)};
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

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 24px;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 48px 40% 48px 24px;
    border-radius: unset;
    height: 304px;

    &:before {
      width: 42%;
      opacity: 1;
      background-position: center;
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
  height: 326px;

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

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 30px 24px;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 50px 40% 48px 24px;
    border-radius: unset;
    height: 304px;

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

const StyledBannerLady = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  height: 326px;

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

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 20px 24px;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 32px 40% 48px 24px;
    border-radius: unset;
    height: 304px;

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

const StyledBannerSixProtocol = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  height: 326px;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: ${({ theme }) => (theme.isDark ? `url(${logoDefinixSixProtocol})` : `url(${logoDefinixSixProtocol})`)};
    background-size: contain;
    background-position: right center;
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

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 80px 24px;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 90px 42% 48px 24px;
    border-radius: unset;
    height: 304px;

    &:before {
      width: 40%;
      opacity: 1;
      margin-right: 40px;
    }

    h2 {
      font-size: 32px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 90px 40% 48px 40px !important;
    &:before {
      margin-right: 40px !important;
    }
  }
`

const SpecialButton = styled(Button)`
  position: relative;
  padding: 12px 40px;
  background: linear-gradient(rgb(250, 217, 97), rgb(247, 107, 28));
  // background: linear-gradient(#f3d36c, #e27d3a);
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
  ${({ theme }) => theme.mediaQueries.xs} {
    .slick-prev {
      width: 5rem;
      height: 4rem;
      left: -3rem;
    }
    .slick-next {
      width: 6rem;
      height: 4rem;
      right: -3rem;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
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
  }
`

const CardAutoRebalancing = ({ className = '' }) => {
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

  const { isDark } = useTheme()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg && !isMd
  const { balancevfinix } = usePrivateData()

  // Super Stake
  const [onPresentConnectModal] = useModal(
    !!balancevfinix && balancevfinix > 0 ? <SuperStakeModal /> : <StartLongTermStakeModal />,
  )

  return (
    <div>
      <StyledSlider {...settings}>
        <div>
          <a
            href="https://sixnetwork.medium.com/official-announcement-2nd-finix-token-halving-en-c8cadbafadf4"
            target="_blank"
            rel="noreferrer"
          >
            <StyledBannerFinixToken className={className}>
              <div className="pos-relative" style={{ zIndex: 1 }}>
                <Heading className="mb-2" color="primary">
                  FINIX Token’s
                </Heading>
                <Text color="text" fontSize="22px !important" bold lineHeight="1" className="mb-2">
                  2nd Halving
                </Text>
                <Text color="textSubtle" fontSize="12px !important">
                  21 June 2022 at 07.00 P.M. (GMT +9)
                </Text>
              </div>
            </StyledBannerFinixToken>
          </a>
        </div>
        <div>
          <StyledBannerVoting className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Heading color="primary" lineHeight="0.5">
                DECENTRALIZED VOTING
              </Heading>
              <Text color="text" fontSize="22px" bold lineHeight="1" className="mb-2">
                CHANGES THAT CAN BE MADE BY YOU
              </Text>
              <Text color="textSubtle" fontSize="12px">
                Community Proposal is a great way to say your words and to reflects the community feeling about your
                ideas.
              </Text>
              <div className="mt-6">
                <SpecialButton as="a" href="/voting">
                  <span>Interesting, I want to vote</span>
                </SpecialButton>
              </div>
            </div>
          </StyledBannerVoting>
        </div>
        <div>
          <StyledBannerSuperStake className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Text bold fontSize="22px">
                NEW ADDED FEATURE
              </Text>
              <Heading className="mb-2" color="primary">
                SUPER STAKE
              </Heading>
              <Text color="textSubtle" fontSize="12px">
                Super Stake can help you harvest all of your FINIX reward to stake in Long-term stake with no minimum
                amount.
              </Text>
              <Text bold fontSize="12px">
                You can stake as much as FINIX you prefer under the same lock period within 28 days, your lock period
                will not be extended.
              </Text>
              <div className="mt-4">
                <SpecialButton
                  onClick={() => {
                    onPresentConnectModal()
                  }}
                >
                  <span>Start Super Stake</span>
                </SpecialButton>
              </div>
            </div>
          </StyledBannerSuperStake>
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
                <SpecialButton as={Link} to="/long-term-stake">
                  <span>Go to stake</span>
                </SpecialButton>
              </div>
            </div>
          </StyledBannerLongTerm>
        </div>
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
          <a href="https://sixprotocol.com/" target="_blank" rel="noreferrer">
            <StyledBannerSixProtocol className={className}>
              <div className="pos-relative" style={{ zIndex: 1 }}>
                <Heading className="mb-2" color="primary">
                  BE PREPARE FOR THE USE OF DEFINIX
                </Heading>
                <Text
                  color="text"
                  fontSize={isMobile ? '16px !important' : '22px !important'}
                  bold
                  lineHeight="1"
                  className="mb-2"
                >
                  On SIX Protocol
                </Text>
                <Text color="textSubtle" fontSize="14px">
                  (Update for Definix community is coming soon)
                </Text>
              </div>
            </StyledBannerSixProtocol>
          </a>
        </div>
      </StyledSlider>
    </div>
  )
}

export default CardAutoRebalancing
