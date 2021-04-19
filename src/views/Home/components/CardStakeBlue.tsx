import React from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, Heading, Image, Text } from 'uikit-dev'
import bg from 'uikit-dev/images/FINIX-Love-You/bg.png'
import coin from 'uikit-dev/images/FINIX-Love-You/coin.png'

const StyledCardStakeBlue = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  display: flex;
  align-items: center;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;

  img,
  h2,
  h2 + div {
    flex-shrink: 0;
  }

  h2 {
    font-size: 32px !important;
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
    font-size: 14px !important;
  }

  .logo {
    width: 50%;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0;

    > div {
      width: 100%;
      justify-content: center;
    }
  }

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

    .logo {
      width: 50%;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    padding: 1rem 4rem;

    h2 {
      & + div {
        width: 32px !important;
        height: 32px !important;
        max-width: initial !important;
        max-height: initial !important;
      }
    }

    .logo {
      margin-right: 4rem;
      width: 35%;
    }

    > div {
      align-items: flex-start;

      > div {
        justify-content: flex-start;

        > div {
          width: 100%;
        }
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    justify-content: center;

    .logo {
      width: 20%;
    }
    > div {
      width: auto;
    }
  }
`

const CardStakeBlue = () => {
  return (
    <StyledCardStakeBlue>
      <img src={coin} alt="" className="logo" />
      <CardBody>
        <div className="flex flex-wrap">
          <Heading as="h3" color="#FFD157" className="mr-2">
            FINIX Love You
          </Heading>
          <Heading as="h3" color="#fff">
            Exclusive Campaign
          </Heading>
        </div>

        <div className="flex flex-wrap">
          <div className="flex align-center mr-2">
            <Heading color="#FFD157">Stake LP token</Heading>
          </div>

          <div className="flex align-center">
            <Heading color="#fff">Earn SIX</Heading>
          </div>
        </div>

        <p>Total SIX rewards for the campaign is 1,512,000 SIX</p>

        <Button as="a" href="/pool" variant="secondary" className="mt-5 btn-secondary-disable">
          Go to stake
        </Button>
      </CardBody>
    </StyledCardStakeBlue>
  )
}

export default CardStakeBlue
