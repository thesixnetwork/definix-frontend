import React from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, Heading, Image, Text } from 'uikit-dev'
import stakeCoin from '../../../assets/images/stake-coin.png'
import stake from '../../../assets/images/stake.jpg'

const StyledCardStake = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url(${stake});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.white};

  > img {
    flex-shrink: 0;
    width: 80%;
    padding: 24px 24px 0 24px;
  }

  > div {
    text-align: center;

    .flex {
      justify-content: center;
    }
  }

  a {
    background: ${({ theme }) => theme.colors.white};
    font-size: 1rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: flex-start;

    > img {
      width: 36%;
      padding: 0;
    }

    > div {
      text-align: left;

      .flex {
        justify-content: flex-start;
      }
    }
  }
`

const CardStake = () => {
  return (
    <StyledCardStake>
      <img src={stakeCoin} alt="" />
      <CardBody className="pa-6">
        <Heading mb="12px">First Come, First Served</Heading>

        <div className="flex align-center mb-2">
          <Heading fontSize="40px !important" className="mr-4">
            Stake SIX
          </Heading>
          <Image src="/images/coins/SIX.png" width={32} height={32} />
        </div>

        <div className="flex align-center mb-2">
          <Heading fontSize="40px !important" className="mr-4" color="primary">
            Earn FINIX
          </Heading>
          <Image src="/images/coins/FINIX.png" width={32} height={32} />
        </div>

        <Text small className="mb-5">
          Only 10,000,000 FINIX and Limited for 72 hours
        </Text>

        <Button as="a" href="/pool" variant="secondary">
          Go to stake
        </Button>
      </CardBody>
    </StyledCardStake>
  )
}

export default CardStake
