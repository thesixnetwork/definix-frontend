import React from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'
import astro from 'uikit-dev/images/for-ui-v2/astro.png'

const StyledBanner = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  padding: 48px 50% 48px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 50%;
    height: calc(100% + 24px);
    background: url(${astro});
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: -24px;
    right: 0;
  }

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
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
      <Heading className="mb-2" color="primary">
        COMING SOON!!
      </Heading>
      <Heading as="h3" className="mb-2">
        CRYPTO MUTUAL FUND TRADING
      </Heading>
      <Text color="textSubtle" fontSize="12px">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore
      </Text>
      {showBtn && (
        <Button as="a" href="#" size="sm" variant="primary" className="btn-secondary-disable mt-3">
          View details
        </Button>
      )}
    </StyledBanner>
  )
}

export default CardComingSoon
