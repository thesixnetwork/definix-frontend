import React from 'react'
import styled from 'styled-components'
import { Button, Card, Heading } from 'uikit-dev'
import bg from 'uikit-dev/images/for-Farm-Elements/bg.jpg'
import el06 from 'uikit-dev/images/for-Farm-Elements/06.png'
import el07 from 'uikit-dev/images/for-Farm-Elements/07.png'
import el08 from 'uikit-dev/images/for-Farm-Elements/08.png'
import el09 from 'uikit-dev/images/for-Farm-Elements/09.png'
import el10 from 'uikit-dev/images/for-Farm-Elements/10.png'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const CardStyled = styled(Card)`
  padding: 40px 24px;
  width: 100%;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center 40%;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .el {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 0.5rem;

    width: calc(50% - 1rem);

    img {
      width: 120px;
      margin-bottom: 0.5rem;
    }

    span {
      font-size: 12px;
      margin-bottom: 0.5rem;
    }

    p {
      font-weight: bold;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    .el {
      width: calc(25% - 1rem);
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    .el {
      width: auto;
    }
  } ;
`

const CardUpcomingFarms: React.FC = () => {
  const data = [
    {
      img: el06,
      name: 'FINIX-SIX LP',
      apr: 'XX%',
    },
    {
      img: el07,
      name: 'FINIX-BUSD LP',
      apr: 'XX%',
    },
    {
      img: el08,
      name: 'FINIX-BUSD LP',
      apr: 'XX%',
    },
    {
      img: el09,
      name: 'SIX-BUSD LP',
      apr: 'XX%',
    },
    {
      img: el10,
      name: 'USDT-BUSD LP',
      apr: 'XX%',
    },
  ]

  return (
    <CardStyled>
      <Heading as="h2" fontSize="28px !important" textAlign="center" color="#FFF" className="mb-4">
        Upcoming Farms
      </Heading>
      <div className="flex flex-wrap mb-6">
        {data.map((d) => (
          <div className="el">
            <img src={d.img} alt="" />
            <span>{d.name}</span>
            <p>APR : {d.apr}</p>
          </div>
        ))}
      </div>
      <Button as="a" href="/farm" variant="secondary" className="btn-secondary-disable">
        Go to farm
      </Button>
    </CardStyled>
  )
}

export default CardUpcomingFarms
