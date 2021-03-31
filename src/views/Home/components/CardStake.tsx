import React from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, Heading, Image } from 'uikit-dev'
import stakeCoin from '../../../assets/images/stake-coin.png'
import stake from '../../../assets/images/stake.jpg'

const StyledCardStake = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  display: flex;
  align-items: center;
  background: url(${stake});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.white};

  img,
  h2,
  h2 + div {
    flex-shrink: 0;
  }

  h2 + div {
    margin-left: 0.5rem;
    width: 16px;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    margin-top: 0.5rem;
  }
  > div {
    padding: 0;
  }

  ${({ large }) =>
    large
      ? `
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
  
    > div { 
      display: flex; flex-direction: column; align-items: center; width: 100%;

      > div { 
        width: 100%; justify-content: center;
      }
    }
  
    .logo {
      width: 80%;
    }

    h2 {
      font-size: 40px !important;
    }
    h3,
    p {
      font-size: 14px !important;
    }
  `
      : `
  align-items: center;
  justify-content: center;

  .logo {
    width: 80px; margin-right: 1rem;
  }

  h2 {
    font-size: 14px !important;
  }
  h3,
  p {
    font-size: 8px !important;
  }
`}

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 48px !important;
    }
    h3,
    p,
    a {
      font-size: 18px !important;
    }
    a {
      min-width: 200px;
    }

    ${({ large }) =>
      large
        ? `
        .logo {
          width: 50%;
        }
        
        `
        : `.logo {
          width: 160px;
        }
      `}
  }

  ${({ theme }) => theme.mediaQueries.md} {
    h2 {
      & + div {
        width: 32px !important;
        height: 32px !important;
        max-width: initial !important;
        max-height: initial !important;
      }
    }

    ${({ large }) =>
      large
        ? `
      flex-direction: row; padding: 1rem 4rem;

      .logo { margin-right: 4rem; width: 35%; } 

    > div {
      align-items: flex-start;

      > div {
        justify-content: flex-start;

        > div {
          width: 100%;
        }
      }
    }`
        : ``}
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    ${({ large }) =>
      large
        ? `
        justify-content: center;
  
          .logo {
            width: 20%;
          }
          > div { width: auto; }

          `
        : `.logo {
          width: 160px;
        }
      `}
  }
`

const Content = ({ large }) => {
  return (
    <>
      <img src={stakeCoin} alt="" className="logo" />
      <CardBody>
        <Heading as="h3">First Come, First Served</Heading>

        <div className="flex flex-wrap">
          <div className="flex align-center mr-2">
            <Heading>Stake SIX</Heading>
            <Image src="/images/coins/SIX.png" width={16} height={16} />
          </div>

          <div className="flex align-center">
            <Heading color="primary">Earn FINIX</Heading>
            <Image src="/images/coins/FINIX.png" width={16} height={16} />
          </div>
        </div>

        <p>Only 1,555,200 FINIX and Limited for 72 hours</p>

        {large && (
          <Button as="a" href="/pool" variant="secondary" className="mt-5 btn-secondary-disable">
            Go to stake
          </Button>
        )}
      </CardBody>
    </>
  )
}

const CardStake = ({ large = false }) => {
  return (
    <StyledCardStake large={large}>
      <Content large={large} />
    </StyledCardStake>
  )
}

export default CardStake
