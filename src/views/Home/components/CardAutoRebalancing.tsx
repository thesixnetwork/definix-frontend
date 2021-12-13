import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, Heading, Text, useModal } from 'uikit-dev'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useTheme from 'hooks/useTheme'
import { usePrivateData } from 'hooks/useLongTermStake'
import SuperStakeModal from 'uikit-dev/widgets/WalletModal/SuperStakeModal'
import StartLongTermStakeModal from 'uikit-dev/widgets/WalletModal/StartLongTermStakeModal'
import lady from 'uikit-dev/images/for-ui-v2/AUTO-RE-BALANCING-MUTUAL-FUNDS.png'
import definixLongTerm from 'uikit-dev/images/for-ui-v2/definix-long-term-stake-with-voting-system.png'
import definixVoting from 'uikit-dev/images/for-ui-v2/voting-banner.png'
import velo from 'uikit-dev/images/for-ui-v2/banner/velo-banner.png'
import dingoxSix from 'uikit-dev/images/for-ui-v2/banner/dingoxsix.png'
import superStakeWhite from 'uikit-dev/images/for-ui-v2/banner/super-stake-white.png'
import superStakeBlack from 'uikit-dev/images/for-ui-v2/banner/super-stake-black.png'
import logoDingoxSixBlack from 'uikit-dev/images/for-ui-v2/banner/logo-dingoxsix-black.png'
import logoDingoxSixWhite from 'uikit-dev/images/for-ui-v2/banner/logo-dingoxsix-white.png'

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
      width: 46%;
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

const StyledBannerVelo = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: url(${velo});
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
      width: 46%;
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

const StyledBannerDingoXSix = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: url(${dingoxSix});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.1;
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
    padding: 44px 40% 48px 24px;
    border-radius: unset;
    height: 327px;
    &:before {
      width: 42%;
      opacity: 1;
      background-position: center;
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

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 48px 40% 48px 24px;
    border-radius: unset;
    height: 327px;

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
  const settings = {
    dots: true,
    infinite: true,
    // speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplaySpeed: 10000,
    // autoplay: true,
    dotsClass: 'slick-dots slick-thumb',
  }

  const { isDark } = useTheme()
  const { lockAmount, finixEarn, balancefinix, balancevfinix } = usePrivateData()
  // Super Stake
  const [onPresentConnectModal] = useModal(
    !!balancevfinix && balancevfinix > 0 ? <SuperStakeModal /> : <StartLongTermStakeModal />,
  )

  return (
    <div>
      <StyledSlider {...settings}>
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
              <div className="mt-6">
                {/* <SpecialButton as={Link} to="/long-term-stake/top-up"> */}
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
          <StyledBannerDingoXSix className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <img src={isDark ? logoDingoxSixWhite : logoDingoxSixBlack} alt="logoDingoxSix" width="90%" />
              <Text color={isDark ? 'white' : 'black'} fontSize="20px" bold mt="6px">
                Reveals NFT Project for T-ARA’s Comeback
              </Text>
              <Text color="textSubtle" fontSize="14px">
                NFT based on Binance Smart Chain, sale in SIX token expands utility convenience via Swap feature on
                Definix DEX.
              </Text>
              <div className="mt-6">
                <SpecialButton as="a" href="https://dingoxt-ara.com/" target="_blank" rel="noreferrer">
                  <span>Go to official website</span>
                </SpecialButton>
              </div>
            </div>
          </StyledBannerDingoXSix>
        </div>
        <div>
          <StyledBannerVelo className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Heading className="mb-2" color="primary">
                VELO POOL IS NOW ON DEFINIX’S PARTNERSHIP POOL
              </Heading>
              <Text color="textSubtle" fontSize="12px">
                Get chance to earn maximum of 300,000 VELO by staking FINIX
              </Text>
              <Text color={isDark ? 'white' : 'black'} fontSize="12px" bold>
                Start Staking 15 November 2021 03:00 P.M. (GMT+7)
              </Text>
              <div className="mt-6">
                <SpecialButton as="a" href="/partnership-pool">
                  <span>Interesting, I want to stake</span>
                </SpecialButton>
              </div>
            </div>
          </StyledBannerVelo>
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
      </StyledSlider>
    </div>
  )
}

export default CardAutoRebalancing
