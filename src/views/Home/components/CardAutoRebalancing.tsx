import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'

import lady from 'uikit-dev/images/for-ui-v2/AUTO-RE-BALANCING-MUTUAL-FUNDS.png'
// import definixLongTerm from 'uikit-dev/images/for-ui-v2/definix-long-term-stake-with-voting-system.png'
// import definixWeekly from 'uikit-dev/images/for-ui-v2/definix-weekly-update.png'

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

// const StyledBannerLongTerm = styled(Card)`
//   width: 100%;
//   background: ${({ theme }) => theme.colors.card};
//   padding: 48px 24px;
//   position: relative;
//   overflow: visible;

//   &:before {
//     content: '';
//     width: 70%;
//     height: 100%;
//     background: url(${definixLongTerm});
//     background-size: contain;
//     background-position: right bottom;
//     background-repeat: no-repeat;
//     position: absolute;
//     top: 0;
//     right: 0;
//     opacity: 0.2;
//     border-bottom-right-radius: ${({ theme }) => theme.radii.card};
//   }

//   h2 {
//     font-size: 24px;
//   }
//   h3 {
//     font-size: 12px !important;
//     margin-bottom: 4px;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     padding: 48px 40% 48px 24px;

//     &:before {
//       width: 40%;
//       opacity: 1;
//     }

//     h2 {
//       font-size: 32px !important;
//     }
//     h3 {
//       font-size: 16px !important;
//     }
//   }
// `

const SpecialButton = styled(Button)`
  position: relative;
  padding: 16px 40px;
  color: #fff;
  background: linear-gradient(#f3d36c, #e27d3a);
  overflow: hidden;
  border-radius: 40px;

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
  }
`

// const SpecialOutline = styled(Button)`
//   position: relative;
//   padding: 0 40px;
//   background-color: unset;
//   overflow: hidden;
//   border-radius: 40px;
//   border: 1px solid #1587c9;
//   color: #1587c9;

//   &:before {
//     content: '';
//     width: 100%;
//     height: 100%;
//     display: block;
//     position: absolute;
//     top: 0;
//     left: 0;
//     background: #f3d36c;
//     transform: scaleX(0);
//     transform-origin: 100%;
//     transition: transform 0.6s ease;
//   }

//   &:hover {
//     &:before {
//       transform-origin: 0;
//       transform: scaleX(1);
//       background: #d1eeff;
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

const CardAutoRebalancing = ({ className = '' }) => {
  // const openDate = new Date(1628841600000)

  return (
    <>
      <StyledBannerLady className={className}>
        <div className="pos-relative" style={{ zIndex: 1 }}>
          <Text bold fontSize="22px">
            INTRODUCING
          </Text>
          <Heading className="mb-2" color="primary">
            DEFINIX REBALANCING FARM
          </Heading>
          <Text color="textSubtle" fontSize="12px">
            Rebalancing involves periodically buying or selling assets in a portfolio to maintain an original or desired
            level of asset allocation or risk.
          </Text>
          <Text bold fontSize="12px">
            Sound complicated? Don’t worry we will take care your investment automatically with our in-house experts!!
          </Text>

          {/* <SpecialButton className="mt-4">
            to="/rebalancing" as={Link}
            <span>Interesting, I want to invest</span>
          </SpecialButton> */}
          <div className="mt-7"> <SpecialButton as={Link} to="/rebalancing"> <span>Interesting, I want to invest</span> </SpecialButton> </div>
        </div>
      </StyledBannerLady>
      {/* <StyledBannerLongTerm className={className}>
        <div className="pos-relative" style={{ zIndex: 1 }}>
          <Heading className="mb-2" color="primary">
            FINIX LONG-TERM STAKE WITH VOTING SYSTEM
          </Heading>
          <Text color="textSubtle" fontSize="12px">
            New financial product from DEFINIX. It is the single-sided pool stake FINIX earn vFINIX.{' '}
            <b style={{ color: '#000' }}>
              vFINIX can vote for rewarding fee return from a liquidity pool and Discount fee conditioning for
              Rebalancing Farm.
            </b>
          </Text>

          <SpecialOutline className="mt-4">
            <span>Coming soon!</span>
          </SpecialOutline>
        </div>
      </StyledBannerLongTerm> */}
    </>
  )
}

export default CardAutoRebalancing
