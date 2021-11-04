import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'
import { usePriceKlayKusdt, usePriceKethKusdt, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'

export default function useConverter() {
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const kethPrice = usePriceKethKusdt()

  const convertToPriceFromToken = (token, symbol): BigNumber => {
    if (symbol === QuoteToken.KLAY) {
      return klayPrice.times(token)
    }
    if (symbol === QuoteToken.FINIX) {
      console.log('>>>> convert finix', symbol, token, finixPrice)
      return finixPrice.times(token)
    }
    if (symbol === QuoteToken.KETH) {
      return kethPrice.times(token)
    }
    if (symbol === QuoteToken.SIX) {
      console.log('>>>> convert six', symbol, token, sixPrice)
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

  return {
    convertToPriceFromToken,
    convertToUSD,
    convertToPriceFromSymbol,
  }
}
