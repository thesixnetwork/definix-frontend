import React from 'react'
import { useFarmUnlockDate } from 'state/hooks'
import styled from 'styled-components'
import { Button, Card, Heading } from 'uikit-dev'
import Flip from 'uikit-dev/components/Flip'
import man02 from 'uikit-dev/images/FINIX-Love-You/1557.png'
import bgBlue from 'uikit-dev/images/FINIX-Love-You/bg.png'

const MaxWidth = styled.div`
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
`

const CardSorry = styled(Card)`
  padding: 24px;
  width: 100%;
  background: url(${bgBlue});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > div {
      text-align: center;
    }
  }

  img {
    width: 160px;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.5;
  }

  a {
    flex-shrink: 0;
    margin-top: 1rem;
  }

  strong {
    padding: 8px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-between;

    > div {
      flex-direction: row;

      > div {
        text-align: left;
      }
    }

    img {
      margin: 0;
    }

    a {
      margin: 0 0 0 1rem;
    }

    strong {
      padding: 0;
    }
  }
`

const CardWhatIsFarm = () => {
  const farmUnlockAt = useFarmUnlockDate()

  return (
    <CardSorry className="mb-6">
      <MaxWidth>
        <img src={man02} alt="" />

        <div>
          <Heading as="h3" fontSize="24px !important" color="#FFF" className="mb-2">
            For maximum yield farming return and best experience, we are upgrading our farm.
          </Heading>
          <Heading as="h3" fontSize="24px !important" color="#FFD157" className="mb-2">
            Our farm will be available in{' '}
            <Flip small date={farmUnlockAt instanceof Date ? farmUnlockAt.getTime() : farmUnlockAt} />
          </Heading>
          <p>You can stake your LP and get six now</p>
        </div>

        <Button as="a" href="/pool" variant="secondary" className="btn-secondary-disable">
          Go to stake
        </Button>
      </MaxWidth>
    </CardSorry>
  )
}

export default CardWhatIsFarm
