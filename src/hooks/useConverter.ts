import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { QuoteToken } from 'config/constants/types'
import { usePriceKlayKusdt, usePriceKethKusdt, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'

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

  return {
    convertToPriceFromToken,
    convertToUSD,
    convertToPriceFromSymbol,
    convertToBalanceFormat,
    convertToPriceFormat,
  }
}
