import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'
import { usePriceKlayKusdt, usePriceKethKusdt, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'
import { convertToUsd } from 'utils/formatPrice'

export default function usePrice() {
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

  const getPrice = (symbol) => {
    if (symbol === QuoteToken.KLAY) {
      return klayPrice
    }
    if (symbol === QuoteToken.FINIX) {
      return finixPrice
    }
    if (symbol === QuoteToken.KETH) {
      return kethPrice
    }
    if (symbol === QuoteToken.SIX) {
      return sixPrice
    }
    return symbol
  }

  return {
    convertToPriceFromToken,
    convertToUSD,
    getPrice,
  }
}
