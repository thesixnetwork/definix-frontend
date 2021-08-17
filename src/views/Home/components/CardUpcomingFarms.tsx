import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import numeral from 'numeral'
import React from 'react'
import { useFarms, usePriceKethKusdt, usePriceFinixUsd, usePriceKlayKusdt, usePriceSixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Card, Heading } from 'uikit-dev'
import el06 from 'uikit-dev/images/for-Farm-Elements/06.png'
import el07 from 'uikit-dev/images/for-Farm-Elements/07.png'
import bg from 'uikit-dev/images/for-Farm-Elements/bg.jpg'

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
      width: 100px;
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
  const sixPrice = usePriceSixUsd()
  const klayPrice = usePriceKlayKusdt()
  const finixPrice = usePriceFinixUsd()
  const kethPriceUsd = usePriceKethKusdt()
  const farmToDisplay = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 1)
  const finixPriceVsKLAY = finixPrice
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
    let apy = finixPriceVsKLAY.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)

    if (farm.quoteTokenSymbol === QuoteToken.KUSDT || farm.quoteTokenSymbol === QuoteToken.KDAI) {
      apy = finixPriceVsKLAY.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
    } else if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
      apy = finixPrice.div(klayPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
    } else if (farm.quoteTokenSymbol === QuoteToken.KETH) {
      apy = finixPrice.div(kethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
    } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
    } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
    } else if (farm.dual) {
      const finixApy =
        farm && finixPriceVsKLAY.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
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
  const data = [
    {
      img: el06,
      name: 'FINIX-SIX LP',
      apr: pid1Farm.apy ? numeral(pid1Farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') : 'N/A',
      pid: 1,
    },
    {
      img: el07,
      name: 'FINIX-KUSDT LP',
      apr: pid2Farm.apy ? numeral(pid2Farm.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') : 'N/A',
      pid: 2,
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
