import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'
import astro from 'uikit-dev/images/for-ui-v2/astro.png'

const StyledBanner = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 70%;
    height: calc(100% + 24px);
    background: url(${astro});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: -24px;
    right: -1px;
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
    padding: 48px 50% 48px 24px;

    &:before {
      width: 50%;
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

const CardComingSoon = ({ showBtn = false, className = '' }) => {
  return (
    <StyledBanner className={className}>
      <div className="pos-relative" style={{ zIndex: 1 }}>
        <Heading className="mb-2" color="primary">
          COMING SOON!!
        </Heading>
        <Heading as="h3" className="mb-2">
          CRYPTO MUTUAL FUND TRADING
        </Heading>
        <Text color="textSubtle" fontSize="12px">
          Maximize your investment with FINIX token that you earn from Definix.com. FINIX token can be utilized as a
          discount for financial products and other privillege on upcoming features. Moreover, we also have an expert to
          make sure that you will select the best for your investment
        </Text>
        {showBtn && (
          <Button as={Link} to="/info" size="sm" variant="primary" className="btn-secondary-disable mt-3">
            View details
          </Button>
        )}
      </div>
    </StyledBanner>
  )
}

export default CardComingSoon
