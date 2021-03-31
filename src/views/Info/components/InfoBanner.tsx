import React from 'react'
import styled from 'styled-components'
import { Button, Card, Heading } from 'uikit-dev'
import dashboardBanner from '../../../assets/images/dashboard-banner.png'
import stake from '../../../assets/images/stake.jpg'

const StyledBanner = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 24px;
  width: 100%;
  background: url(${stake});
  background-size: 150%;
  background-repeat: no-repeat;
  background-position: center 40%;
  background-color: ${({ theme }) => theme.colors.white};

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

  a {
    margin-top: 1rem;
  }

  > div {
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: column;

    &:nth-of-type(01) {
      flex-grow: 1;
    }
    &:nth-of-type(02) {
      flex-shrink: 0;
      margin-bottom: 0.5rem;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 40px !important;
    }
    h3 {
      font-size: 20px !important;
    }
    a {
      min-width: 200px;
    }

    img {
      width: 200px;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;

    > div {
      &:nth-of-type(01) {
        padding: 24px;
        align-items: flex-start;
        text-align: left;
      }
      &:nth-of-type(02) {
        margin: 0;
        padding: 0 24px 0 0;
      }
    }
  }
`

const InfoBanner = ({ showBtn = false, className = '' }) => {
  return (
    <StyledBanner className={className}>
      <div>
        <Heading as="h3">The Decentralized Multi-chain</Heading>
        <Heading color="primary">Fund Management Protocol</Heading>
        {showBtn && (
          <Button as="a" href="/info" variant="secondary" className="btn-secondary-disable">
            Read more
          </Button>
        )}
      </div>
      <div>
        <img src={dashboardBanner} alt="" className="logo" />
      </div>
    </StyledBanner>
  )
}

export default InfoBanner
