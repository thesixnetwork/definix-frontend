import React from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'

const MaxWidth = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
`

const StyledBanner = styled(Card)`
  padding: 48px 24px;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }
  img {
    width: 120px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 32px !important;
    }
    h3 {
      font-size: 16px !important;
    }
    img {
      width: 180px;
    }
  }
`

const MainBanner = ({ showBtn = false, className = '' }) => {
  return (
    <StyledBanner className={className}>
      <MaxWidth>
        <div>
          <Heading className="mb-2">COMING SOON!!</Heading>
          <Heading as="h3" className="mb-2" color="textSubtle">
            CRYPTO MUTUAL FUND TRADING
          </Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et
            dolore
          </Text>
          {showBtn && (
            <Button as="a" href="#" size="sm" variant="primary" className="btn-secondary-disable mt-3">
              View details
            </Button>
          )}
        </div>
        <div>{/* <img src={dashboardBanner} alt="" className="logo" /> */}</div>
      </MaxWidth>
    </StyledBanner>
  )
}

export default MainBanner
