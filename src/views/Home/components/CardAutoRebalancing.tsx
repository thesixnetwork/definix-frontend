import React from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text, useMatchBreakpoints } from 'uikit-dev'
import Slider from 'react-slick'
import useTheme from 'hooks/useTheme'
import logoLongTerm from 'uikit-dev/images/for-ui-v2/banner/logo-long-term.png'
import logoFinixHavingBanner from 'uikit-dev/images/for-ui-v2/banner/logo-banner-finix.png'
import logoDefinixSixProtocol from 'uikit-dev/images/for-ui-v2/banner/logo-definix-protocol.png'

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
    background: url(${logoLongTerm});
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
    padding: 90px 24px;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 70px 40% 48px 24px;
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
      margin-right: 0px !important;
    }
  }
`

const SpecialButton = styled(Button)`
  position: relative;
  padding: 12px 60px;
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

// const SpecialOutline = styled(Button)`
//   position: relative;
//   padding: 10px 24px;
//   background-color: unset;
//   overflow: hidden;
//   border-radius: 40px;
//   border: 1px solid #1587c9;
//   color: #1587c9;
//   cursor: unset;
//   &:before {
//     content: '';
//     width: 100%;
//     height: 100%;
//     display: block;
//     position: absolute;
//     top: 0;
//     left: 0;
//     transform: scaleX(0);
//     transform-origin: 100%;
//     transition: transform 0.6s ease;
//     border-radius: 40px;
//   }
//   &:hover {
//     &:before {
//       transform-origin: 0;
//       transform: scaleX(1);
//       border-radius: 40px;
//     }
//     span {
//       color: #1587c9 !important;
//     }
//   }
//   span {
//     position: relative;
//     z-index: 1;
//     transition: all 0.6s ease;
//   }
// `

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
  const { isDark } = useTheme()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg && !isMd

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
          <StyledBannerFinixToken className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Heading className="mb-2" color="primary">
                FINIX Token’s
              </Heading>
              <Text color="text" fontSize="22px !important" bold lineHeight="1" className="mb-2">
                4th Halving
              </Text>
              <Text color="textSubtle" fontSize="12px !important">
                20 June 2024 at 05:00 PM (GMT +7)
              </Text>
            </div>
          </StyledBannerFinixToken>
        </div>
        <div>
          <StyledBannerLongTerm className={className}>
            <div className="pos-relative" style={{ zIndex: 1 }}>
              <Heading className="mb-2" color="primary">
                FINIX LONG-TERM STAKE
              </Heading>
              <Text
                color="text"
                fontSize={isMobile ? '16px !important' : '22px !important'}
                bold
                lineHeight="1"
                className="mb-2"
              >
                Stake your FINIX here!
              </Text>
              <div className="mt-6">
                <SpecialButton as="a" href="https://g2.klaytn.definix.com/long-term-stake" target="_blank">
                  <span>Go to stake</span>
                </SpecialButton>
              </div>
            </div>
          </StyledBannerLongTerm>
        </div>
        <div>
          <a href="https://six.network/roadmap/?" target="_blank" rel="noreferrer">
            <StyledBannerSixProtocol className={className}>
              <div className="pos-relative" style={{ zIndex: 1 }}>
                <Heading className="mb-2" color="primary">
                  UNLOCK THE SYNERGY OF DEFINIX
                </Heading>
                <Text
                  color="text"
                  fontSize={isMobile ? '16px !important' : '22px !important'}
                  bold
                  lineHeight="1"
                  className="mb-2"
                >
                  on SIX Protocol
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
