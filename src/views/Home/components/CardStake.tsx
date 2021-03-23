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

  a {
    background: ${({ theme }) => theme.colors.white};
    font-size: 1rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: flex-start;

    > img {
      width: 36%;
    }
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;

  img {
    flex-shrink: 0;
    margin-left: 16px;
  }
`

const CardStake = () => {
  return (
    <StyledCardStake>
      <img src={stakeCoin} alt="" />
      <CardBody className="pa-6">
        <Heading mb="12px">First Come, First Served</Heading>

        <Row className="mb-2">
          <Heading fontSize="40px !important">Stake SIX</Heading>
          <Image src="/images/coins/SIX.png" width={32} height={32} />
        </Row>

        <Row className="mb-2">
          <Heading fontSize="40px !important" color="primary">
            Earn FINIX
          </Heading>
          <Image src="/images/coins/FINIX.png" width={32} height={32} />
        </Row>

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
