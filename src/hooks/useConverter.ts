import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { QuoteToken } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceBnbBusd, usePriceEthBusd, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'

export default function useConverter() {
  const bnbPrice = usePriceBnbBusd()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPrice = usePriceEthBusd()

  const convertToPriceFromToken = (token, symbol): BigNumber => {
    const tokenSymbol = symbol.toUpperCase()
    if (tokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(token)
    }
    if (tokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(token)
    }
    if (tokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(token)
    }
    if (tokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(token)
    }
    return token
  }

  const convertToUSD = (value: number | BigNumber, fixed?: number) => {
    if (!value) {
      return '$0'
    }
    return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: fixed || 0 })}`
  }

  const convertToPriceFromSymbol = (symbol: QuoteToken | string = QuoteToken.FINIX): number => {
    let price = finixPrice
    if (symbol === QuoteToken.BNB) {
      price = bnbPrice
    }
    if (symbol === QuoteToken.ETH) {
      price = ethPrice
    }
    if (symbol === QuoteToken.SIX) {
      price = sixPrice
    }
    return price.toNumber()
  }

  const convertToBalanceFormat = (value: number) => {
    return numeral(value).format('0,0.[000000]')
  }

  const convertToPriceFormat = (value: number) => {
    return numeral(value).format('0,0.[00]')
  }

  const convertToIntegerFormat = (value: number) => {
    return numeral(value).format('0,0')
  }

  const convertToPoolAPR = (apy) => {
    return getBalanceNumber(apy)
  }
  const convertToPoolAPRFormat = (apy) => {
    return numeral(apy.toFixed(2)).format('0,0.[00]')
  }

  const convertToFarmAPR = (apy) => {
    return getBalanceNumber(apy)
  }
  const convertToFarmAPRFormat = (apy) => {
    return numeral(apy.times(100).toFixed(2)).format('0,0.[00]')
  }

  const convertToRebalanceAPR = ({
    finixRewardPerYear,
    totalAssetValue,
  }: {
    finixRewardPerYear: BigNumber
    totalAssetValue: BigNumber
  }) => {
    return getBalanceNumber(finixPrice.times(finixRewardPerYear).div(totalAssetValue))
  }
  const convertToRebalanceAPRFormat = ({
    finixRewardPerYear,
    totalAssetValue,
  }: {
    finixRewardPerYear: BigNumber
    totalAssetValue: BigNumber
  }) => {
    return numeral(finixPrice.times(finixRewardPerYear).div(totalAssetValue).times(100).toFixed(2)).format('0,0.[00]')
  }

  return {
    convertToPriceFromToken,
    convertToUSD,
    convertToPriceFromSymbol,
    convertToBalanceFormat,
    convertToPriceFormat,
    convertToIntegerFormat,
    convertToPoolAPR,
    convertToPoolAPRFormat,
    convertToFarmAPR,
    convertToFarmAPRFormat,
    convertToRebalanceAPR,
    convertToRebalanceAPRFormat,
  }
}
