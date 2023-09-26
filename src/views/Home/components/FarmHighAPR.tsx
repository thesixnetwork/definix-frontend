import React, { useMemo } from 'react'
import { get } from 'lodash-es'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { BLOCKS_PER_YEAR } from 'config'
import { Flex, Lp } from '@fingerlabs/definixswap-uikit-v2'
import Box from 'uikitV2/components/Box/Box'
import Coin from 'uikitV2/components/Coin/Coin'
import { useFarms, usePriceBnbBusd, usePriceEthBusd, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'
import { QuoteToken } from 'config/constants/types'
// import useFarmsList from 'hooks/useFarmsList'
import FormAPR from './FormAPR'

const StyledCoin = styled(Coin)`
  width: 40px;
  height: 40px;
  @media screen and (max-width: 1280px) {
    width: 36px;
    height: 36px;
  }
`

const ImageBox = styled(Box)`
  &:first-child {
    z-index: 1;
  }
  &:last-child {
    margin-left: -10px;
  }   
` 

const WrapImage = styled(Flex)`
  width: 96px;
  height: 48px;
  align-items: flex-end;
  @media screen and (max-width: 1280px) {
    width: 72px;
    height: 36px;
  }
`

const StyledLp = styled(Lp)`
  width: 48px;
  height: 48px;
  @media screen and (max-width: 1280px) {
    width: 36px;
    height: 36px;
  }
`

const FarmHighAPR = () => {
  const farmsLP = useFarms()
  const bnbPrice = usePriceBnbBusd()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPriceUsd = usePriceEthBusd()
  const activeFarms = farmsLP.filter(farm => farm.pid !== 0 && farm.pid !== 25 && farm.multiplier !== '0X')
  const finixPriceVsBNB = finixPrice
  const sortedData = useMemo(() => {
    const farmTranslate = activeFarms.map(farm => {
      const totalValue: BigNumber = (() => {
        if (!farm.lpTotalInQuoteToken) {
          return null
        }
        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          return bnbPrice.times(farm.lpTotalInQuoteToken)
        }
        if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          return finixPrice.times(farm.lpTotalInQuoteToken)
        }
        if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          return ethPriceUsd.times(farm.lpTotalInQuoteToken)
        }
        if (farm.quoteTokenSymbol === QuoteToken.SIX) {
          return sixPrice.times(farm.lpTotalInQuoteToken)
        }
        return farm.lpTotalInQuoteToken
      })()

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
      } else if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        apy = finixPrice.div(bnbPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
        apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
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
      const resultApy = apy
      return { ...farm, apy: resultApy, totalLiquidityValue: totalValue }
    })
    const sortedFarmData = farmTranslate.sort((a, b) => +a.apy - +b.apy).reverse()
    if (sortedFarmData[0]) {
      return {
        lpSymbol: sortedFarmData[0].lpSymbol,
        apy: sortedFarmData[0].apy,
        totalLiquidityValue: sortedFarmData[0].totalLiquidityValue,
      }
    }
    return null
  }, [activeFarms, sixPrice, bnbPrice, finixPrice, ethPriceUsd])
  //   const farmsWithApy = useFarmsList(farmsLP)
  //   const activeFarms = farmsWithApy.filter(
  //     (farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X' && farm.apy.toString() !== 'Infinity',
  //   )
  //   const activeFavorFarms = farmsWithApy.filter(
  //     (farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X' && farm.favorApy.toString() !== 'Infinity',
  //   )
  //   const sortedFarmData = useMemo(() => activeFarms.sort((a, b) => +a.apy - +b.apy).reverse(), [activeFarms])
  //   const sortedFavorFarmData = useMemo(
  //     () => activeFavorFarms.sort((a, b) => +a.favorApy - +b.favorApy).reverse(),
  //     [activeFavorFarms],
  //   )

  //   const sortedData = useMemo(() => {
  //     if (sortedFarmData[0] && sortedFavorFarmData[0]) {
  //       const isFarmHighApy = sortedFarmData[0].apy.isGreaterThanOrEqualTo(sortedFavorFarmData[0].favorApy)
  //       return isFarmHighApy
  //         ? {
  //             lpSymbol: sortedFarmData[0].lpSymbol,
  //             apy: sortedFarmData[0].apy,
  //             lpSymbols: sortedFarmData[0].lpSymbols,
  //             totalLiquidityValue: sortedFarmData[0].totalLiquidityValue,
  //           }
  //         : {
  //             lpSymbol: sortedFavorFarmData[0].lpSymbol,
  //             apy: sortedFavorFarmData[0].favorApy,
  //             lpSymbols: sortedFavorFarmData[0].lpSymbols,
  //             totalLiquidityValue: sortedFavorFarmData[0].totalLiquidityValue,
  //           }
  //     }
  //     return null
  //   }, [sortedFarmData, sortedFavorFarmData])

  return sortedData ? (
    <FormAPR
      title={sortedData.lpSymbol}
      totalAssetValue={get(sortedData, 'totalLiquidityValue', 0)}
      apr={numeral(sortedData.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}
      Images={
      <Flex mr={12} alignItems="center" width={'auto'}>
        <ImageBox>
          <StyledCoin symbol={(sortedData.lpSymbol || "").replace(" LP", "").split('-')[0]} size="40px" />
        </ImageBox>
        <ImageBox>
          <StyledCoin symbol={(sortedData.lpSymbol || "").replace(" LP", "").split('-')[1]} size="40px" />
        </ImageBox>
      </Flex>
      }
    />
  ) : (
    <></>
  )
}

export default FarmHighAPR
