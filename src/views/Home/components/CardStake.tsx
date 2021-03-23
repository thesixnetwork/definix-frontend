import React from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, Heading, Image, Text } from 'uikit-dev'
import stakeCoin from '../../../assets/images/stake-coin.png'
import stake from '../../../assets/images/stake.jpg'

const StyledCardStake = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  background: url(${stake});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.white};
`

const MaxWidth = styled.div<{ large: boolean }>`
  max-width: ${({ large }) => (large ? 'initial' : '800px')};
  margin: 0 auto;
  padding: ${({ large }) => (large ? '24px' : '0')};
  width: 100%;
  display: flex;
  align-items: center;

  .logo {
    flex-shrink: 0;
    width: 80px;
    margin-right: 24px;
  }

  a {
    background: ${({ theme }) => theme.colors.white};
    font-size: 1rem;
  }

  // > div {
  //   text-align: center;

  //   .flex {
  //     justify-content: center;
  //   }
  // }

  // ${({ theme }) => theme.mediaQueries.sm} {
  .logo {
    width: 160px;
    padding: 0;
  }

  //   > div {
  //     text-align: left;

  //     .flex {
  //       justify-content: flex-start;
  //     }
  //   }
  // }
`

const CardStake = ({ large = false }) => {
  return (
    <StyledCardStake>
      <MaxWidth large={large}>
        <img src={stakeCoin} alt="" className="logo" />
        <CardBody className="flex-grow pa-0">
          <Heading mb="12px">First Come, First Served</Heading>

          <div className={`flex flex-wrap mb-2 ${large ? 'flex-column' : ''}`}>
            <div className="flex align-center flex-grow mr-4">
              <Heading fontSize="40px !important" className="mr-4">
                Stake SIX
              </Heading>
              <Image src="/images/coins/SIX.png" width={32} height={32} />
            </div>

            <div className="flex align-center flex-grow">
              <Heading fontSize="40px !important" className="mr-4" color="primary">
                Earn FINIX
              </Heading>
              <Image src="/images/coins/FINIX.png" width={32} height={32} />
            </div>
          </div>

          <Text small>Only 10,000,000 FINIX and Limited for 72 hours</Text>

          {large && (
            <Button as="a" href="/pool" variant="secondary" className="mt-5">
              Go to stake
            </Button>
          )}
        </CardBody>
      </MaxWidth>
    </StyledCardStake>
  )
}

export default CardStake
