import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Card, Heading } from 'uikit-dev'
import bg from 'uikit-dev/images/for-Farm-Elements/bg.jpg'
import el06 from 'uikit-dev/images/for-Farm-Elements/06.png'
import el07 from 'uikit-dev/images/for-Farm-Elements/07.png'
import el08 from 'uikit-dev/images/for-Farm-Elements/08.png'
import el09 from 'uikit-dev/images/for-Farm-Elements/09.png'
import el10 from 'uikit-dev/images/for-Farm-Elements/10.png'
import { useFarms, usePriceBnbBusd, usePriceEthBusd, usePriceFinixUsd, usePriceSixBusd } from 'state/hooks'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import numeral from 'numeral'

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
  background-position: 25% center;
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
    align-items: center;
    margin: 1rem;
    text-align: center;

    width: calc(50% - 2rem);

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
    background-position: center 40%;

    .el {
      width: calc(25% - 2rem);
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    .el {
      width: auto;
    }
  } ;
`

const CardUpcomingFarms: React.FC = () => {
  const farmsLP = useFarms()
  const bnbPrice = usePriceBnbBusd()
  const sixPrice = usePriceSixBusd()
  const finixPrice = usePriceFinixUsd()
  const ethPriceUsd = usePriceEthBusd()
  const farmToDisplay = farmsLP.filter((farm) => farm.pid !== 0)
  const finixPriceVsBNB = finixPrice
  const farms = farmToDisplay.map((farm) => {
    if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
      return farm
    }
    // eslint-disable-next-line
    const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
      .times(farm.BONUS_MULTIPLIER)
      .div(new BigNumber(10).pow(18))
    const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
    const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

    // finixPriceInQuote * finixRewardPerYear / lpTotalInQuoteToken
    let apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)

    if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
      apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
    } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      apy = finixPrice.div(ethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
    } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
    } else if (farm.dual) {
      const finixApy =
        farm && finixPriceVsBNB.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
      const dualApy =
        farm.tokenPriceVsQuote &&
        new BigNumber(farm.tokenPriceVsQuote)
          .times(farm.dual.rewardPerBlock)
          .times(BLOCKS_PER_YEAR)
          .div(farm.lpTotalInQuoteToken)

      apy = finixApy && dualApy && finixApy.plus(dualApy)
    }

    return { ...farm, apy }
  })
  const pid1Farm = farms.find((fa) => fa.pid === 1)
  const pid2Farm = farms.find((fa) => fa.pid === 2)
  const pid3Farm = farms.find((fa) => fa.pid === 3)
  const pid4Farm = farms.find((fa) => fa.pid === 4)
  const pid5Farm = farms.find((fa) => fa.pid === 5)
  const data = [
    {
      img: el06,
      name: 'FINIX-SIX LP',
      apr: pid1Farm.apy ? numeral(pid1Farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') : 'N/A',
      pid: 1,
    },
    {
      img: el07,
      name: 'FINIX-BUSD LP',
      apr: pid2Farm.apy ? numeral(pid2Farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') : 'N/A',
      pid: 2,
    },
    {
      img: el08,
      name: 'FINIX-BNB LP',
      apr: pid3Farm.apy ? numeral(pid3Farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') : 'N/A',
      pid: 3,
    },
    {
      img: el09,
      name: 'SIX-BUSD LP',
      apr: pid4Farm.apy ? numeral(pid4Farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') : 'N/A',
      pid: 4,
    },
    {
      img: el10,
      name: 'USDT-BUSD LP',
      apr: pid5Farm.apy ? numeral(pid5Farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') : 'N/A',
      pid: 5,
    },
  ]

  return (
    <CardStyled>
      <Heading as="h2" fontSize="28px !important" textAlign="center" color="#FFF" className="mb-2">
        Active Farms
      </Heading>
      <div className="flex flex-wrap mb-4">
        {data.map((d) => {
          // eslint-disable-next-line
          d.apr = d.apr === undefined || d.apr === 'undefined' ? 'N/A' : d.apr
          // eslint-disable-next-line
          d.apr === 'N/A' ? 'N/A' : `${d.apr}%`

          return (
            <div className="el">
              <img src={d.img} alt="" />
              <span>{d.name}</span>
              <p>APR : {d.apr === 'Loading' ? 'Loading' : `${d.apr}%`}</p>
            </div>
          )
        })}
      </div>
      <Button as="a" href="/farm" variant="secondary" className="btn-secondary-disable">
        Go to farm
      </Button>
    </CardStyled>
  )
}

export default CardUpcomingFarms
