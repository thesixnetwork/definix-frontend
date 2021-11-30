import _ from 'lodash'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { QuoteToken } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceKlayKusdt, usePriceKethKusdt, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'
import { Rebalance } from 'state/types'

export default function useConverter() {
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const kethPrice = usePriceKethKusdt()

  const convertToPriceFromToken = (token, symbol): BigNumber => {
    const tokenSymbol = symbol.toUpperCase()
    if (tokenSymbol === QuoteToken.KLAY) {
      return klayPrice.times(token)
    }
    if (tokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(token)
    }
    if (tokenSymbol === QuoteToken.KETH) {
      return kethPrice.times(token)
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
    if (symbol === QuoteToken.KLAY) {
      price = klayPrice
    }
    if (symbol === QuoteToken.KETH) {
      price = kethPrice
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
