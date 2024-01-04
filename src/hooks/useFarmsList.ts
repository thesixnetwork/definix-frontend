import BigNumber from 'bignumber.js'
import { compact } from 'lodash-es'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import { getLpImageUrlsAndSymbols } from 'utils/getTokenImage'
import useConverter from 'hooks/useConverter'
import { usePriceKlayKusdt, usePriceKethKusdt, usePriceFinixUsd, usePriceSixUsd, usePriceFavorUsd } from 'state/hooks'
import { Farm } from 'state/types'
import { useCallback } from 'react'

const useFarmsList = (farms: Farm[]): any => {
  const { convertToPriceFromToken } = useConverter()
  const klayPrice = usePriceKlayKusdt()
  const favorPrice = usePriceFavorUsd()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const kethPriceUsd = usePriceKethKusdt()
  const finixPriceVsKlay = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)

  const getFarmsList = useCallback(() => {
    return farms.map((farm) => {
      if (!farm.tokenAmount || !farm.lpTotalInQuoteToken) {
        return {
          ...farm,
          apyValue: 0,
          totalLiquidityValue: 0,
        }
      }
      const klayApy = new BigNumber(0)
      let favorApy = new BigNumber(0)
      const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
        .times(farm.BONUS_MULTIPLIER)
        .div(new BigNumber(10).pow(18))
      // const totalKlayRewardPerBlock = new BigNumber(KLAY_PER_BLOCK)
      const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
      const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

      const filterBundleRewards = farm.bundleRewards.filter(
        ({ rewardTokenInfo }) => ![QuoteToken.WKLAY, QuoteToken.KLAY].includes(rewardTokenInfo.symbol),
      )

      if (filterBundleRewards.length > 0) {
        const favorBundle = filterBundleRewards.find((br) => br.rewardTokenInfo.symbol === QuoteToken.FAVOR)
        if (favorBundle) {
          // @ts-ignore
          const favorRewardPerBlock = new BigNumber([favorBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
          const favorRewardPerYear = favorRewardPerBlock.times(BLOCKS_PER_YEAR)
          const yieldValue = favorPrice.times(favorRewardPerYear)
          let totalValue = farm.lpTotalInQuoteToken
          if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
            totalValue = klayPrice.times(farm.lpTotalInQuoteToken)
          }
          if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
            totalValue = finixPrice.times(farm.lpTotalInQuoteToken)
          }
          if (farm.quoteTokenSymbol === QuoteToken.OETH) {
            totalValue = kethPriceUsd.times(farm.lpTotalInQuoteToken)
          }
          if (farm.quoteTokenSymbol === QuoteToken.SIX) {
            totalValue = sixPrice.times(farm.lpTotalInQuoteToken)
          }
          favorApy = yieldValue.div(totalValue)
        }
      }

      /*
      // DO NOT DELETE THIS CODE 
      // DESCRIPTION THIS CODE CALCULATE BUNDLE APR 
      // One day we may have a new bundle.
      // START FN CAL APR BUNDLE
  
      if ((farm.bundleRewards || []).length > 0) {
        const klayBundle = (farm.bundleRewards || []).find((br) => br.rewardTokenInfo.name === QuoteToken.WKLAY)
        if (klayBundle) {
          // @ts-ignore
          const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
          const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
          const yieldValue = klayPrice.times(klayRewardPerYear)
          let totalValue = farm.lpTotalInQuoteToken
          if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
            totalValue = klayPrice.times(farm.lpTotalInQuoteToken)
          }
          if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
            totalValue = finixPrice.times(farm.lpTotalInQuoteToken)
          }
          if (farm.quoteTokenSymbol === QuoteToken.OETH) {
            totalValue = kethPriceUsd.times(farm.lpTotalInQuoteToken)
          }
          if (farm.quoteTokenSymbol === QuoteToken.SIX) {
            totalValue = sixPrice.times(farm.lpTotalInQuoteToken)
          }
          klayApy = yieldValue.div(totalValue)
        }
      }
      // END FN CAL APR BUNDLE
      */

      // finixPriceInQuote * finixRewardPerYear / lpTotalInQuoteToken

      let apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
      if (farm.quoteTokenSymbol === QuoteToken.OUSDT || farm.quoteTokenSymbol === QuoteToken.KDAI) {
        apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
      } else if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
        apy = finixPrice.div(klayPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.OETH) {
        apy = finixPrice.div(kethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
        apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
        apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
      } else if (farm.dual) {
        const finixApy =
          farm && finixPriceVsKlay.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
        const dualApy =
          farm.tokenPriceVsQuote &&
          new BigNumber(farm.tokenPriceVsQuote)
            .times(farm.dual.rewardPerBlock)
            .times(BLOCKS_PER_YEAR)
            .div(farm.lpTotalInQuoteToken)

        apy = finixApy && dualApy && finixApy.plus(dualApy)
      }
      const finixApy = apy
      /* 
      // DO NOT DELETE THIS CODE 
      // DESCRIPTION THIS CODE CALCULATE BUNDLE APR 
      // One day we may have a new bundle.
      // START FN CAL APR BUNDLE
  
      const sumApy = BigNumber.sum(finixApy, klayApy)
      */

      let totalLiquidityValue = null
      if (farm.lpTotalInQuoteToken) {
        totalLiquidityValue = convertToPriceFromToken(farm.lpTotalInQuoteToken, farm.quoteTokenSymbol)
      }

      return {
        ...farm,
        bundleRewards: filterBundleRewards,
        apy: finixApy,
        finixApy,
        klayApy,
        favorApy,
        // apyValue: convertToFarmAPR(finixApy),
        apyValue: finixApy.times(100).toNumber(),
        totalLiquidityValue: Number(totalLiquidityValue),
        lpSymbols: getLpImageUrlsAndSymbols(farm.lpSymbol),
        isBundle: (farm.bundleRewards || []).length > 0,
      }
    })
  }, [convertToPriceFromToken, farms, finixPrice, finixPriceVsKlay, kethPriceUsd, klayPrice, sixPrice])

  const getFilteredFarms = useCallback(() => {
    const farmsWithApy = getFarmsList()
    const filteredFarms = farmsWithApy.filter(
      (farm) => farm.pid !== 0 && farm.pid !== 1 /* && farm.multiplier !== '0X'*/,
    )
    return !compact(filteredFarms.map((farm) => farm.lpTotalInQuoteToken)).length ? [] : filteredFarms
  }, [getFarmsList])

  return getFilteredFarms()
}

export default useFarmsList
