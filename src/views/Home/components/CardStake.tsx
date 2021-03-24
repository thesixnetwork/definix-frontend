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

  a {
    background: ${({ theme }) => theme.colors.white};
    font-size: 1rem;
  }

  h2 {
    font-size: 14px !important;
  }
  h3,
  p {
    font-size: 10px !important;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    margin-top: 0.5rem;
  }

  ${({ large }) =>
    large
      ? `
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    > div { 
      display: flex; flex-direction: column; align-items: center; padding: 0 24px 24px 24px; width: 100%;

      > div { 
        width: 100%; justify-content: center;
      }
    }
  
    .logo {
      width: 35%;
    }
  `
      : `
  align-items: center;
  justify-content: center;

  > div {
    padding: 16px;
  }

  .logo {
    width: 80px;
  }
`}

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 24px !important;
    }
    h3,
    p {
      font-size: 16px !important;
    }

    ${({ large }) =>
      !large
        ? `.logo {
        width: 160px;
      }
    `
        : ``}
  }

  ${({ theme }) => theme.mediaQueries.md} {
    h2 {
      font-size: 40px !important;

      & + div {
        width: 32px !important;
        height: 32px !important;
        max-width: initial !important;
        max-height: initial !important;
        margin-right: 2rem;
      }
    }
    h3,
    p {
      font-size: 16px !important;
    }

    ${({ large }) =>
      large
        ? `
      flex-direction: row;

    > div {
      align-items: flex-start;
      padding: 24px 24px 24px 0;

      > div {
        justify-content: flex-start;

        > div {
          width: 100%;
        }
      }
    }`
        : `
      .logo {
        margin-right: 1rem;
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
          <div className="flex align-center mr-3">
            <Heading>Stake SIX</Heading>
            <Image src="/images/coins/SIX.png" width={16} height={16} />
          </div>

          <div className="flex align-center">
            <Heading color="primary">Earn FINIX</Heading>
            <Image src="/images/coins/FINIX.png" width={16} height={16} />
          </div>
        </div>

        <p>Only 10,000,000 FINIX and Limited for 72 hours</p>

        {large && (
          <Button as="a" href="/pool" variant="secondary" className="mt-5">
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
