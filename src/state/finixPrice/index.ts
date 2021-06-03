/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import { Token, Pair, ChainId } from 'definixswap-sdk'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import _ from 'lodash'
import axios from 'axios'
import {
  getDefinixHerodotusAddress,
  getHerodotusAddress,
  getWklayAddress,
  getSixAddress,
  getFinixAddress,
  getKspAddress,
  getKdaiAddress,
  getKusdtAddress,
  getFinixSixLPAddress,
  getFinixKusdtLPAddress,
  getFinixKlayLPAddress,
  getFinixKspLPAddress,
  getSixKusdtLPAddress,
  getSixKlayLPAddress,
  getDefinixKlayKusdtLPAddress,
} from 'utils/addressHelpers'
import { createSlice } from '@reduxjs/toolkit'
import { FinixPriceState } from '../types'

const initialState: FinixPriceState = {
  price: 0,
  sixPrice: 0,
  definixKlayPrice: 0,
  klayswapKlayPrice: 0,
  sixFinixQuote: 0,
  sixKusdtQuote: 0,
  sixWklayQuote: 0,
  finixKusdtQuote: 0,
  finixWklayQuote: 0,
  finixKspQuote: 0,
  wklayKusdtQuote: 0,
  kdaiKusdtQuote: 0,
}

export const finixPriceSlice = createSlice({
  name: 'FinixPrice',
  initialState,
  reducers: {
    setSixPrice: (state, action) => {
      const { sixPrice } = action.payload
      state.sixPrice = sixPrice
    },
    setFinixPrice: (state, action) => {
      const { price } = action.payload
      state.price = price
    },
    setDefinixKlayPrice: (state, action) => {
      const { price } = action.payload
      state.definixKlayPrice = price
    },
    setKlayswapKlayPrice: (state, action) => {
      const { klayPrice } = action.payload
      state.klayswapKlayPrice = klayPrice
    },
    setQuote: (state, action) => {
      const {
        sixFinixQuote,
        sixKusdtQuote,
        sixWklayQuote,
        finixKusdtQuote,
        finixWklayQuote,
        finixKspQuote,
        wklayKusdtQuote,
        kdaiKusdtQuote,
      } = action.payload
      state.sixFinixQuote = sixFinixQuote
      state.sixKusdtQuote = sixKusdtQuote
      state.sixWklayQuote = sixWklayQuote
      state.finixKusdtQuote = finixKusdtQuote
      state.finixWklayQuote = finixWklayQuote
      state.finixKspQuote = finixKspQuote
      state.wklayKusdtQuote = wklayKusdtQuote
      state.kdaiKusdtQuote = kdaiKusdtQuote
    },
  },
})

// Actions
export const { setSixPrice, setFinixPrice, setQuote, setDefinixKlayPrice, setKlayswapKlayPrice } =
  finixPriceSlice.actions

const getTotalBalanceLp = async ({ lpAddress, pair1, pair2, herodotusAddress }) => {
  let pair1Amount = 0
  let pair2Amount = 0
  try {
    const calls = [
      {
        address: pair1,
        name: 'balanceOf',
        params: [lpAddress],
      },
      {
        address: pair2,
        name: 'balanceOf',
        params: [lpAddress],
      },
      {
        address: pair1,
        name: 'decimals',
      },
      {
        address: pair2,
        name: 'decimals',
      },
    ]

    const [pair1BalanceLP, pair2BalanceLP, pair1Decimals, pair2Decimals] = await multicall(erc20, calls)

    pair1Amount = new BigNumber(pair1BalanceLP).div(new BigNumber(10).pow(pair1Decimals)).toNumber()
    pair2Amount = new BigNumber(pair2BalanceLP).div(new BigNumber(10).pow(pair2Decimals)).toNumber()
  } catch (error) {
    console.log(error)
  }
  return [pair1Amount, pair2Amount]
}

const getTotalQuote = async ({ lpAddress, qouteToken }) => {
  let lpTotalInQuoteToken = 0
  try {
    const calls = [
      // Balance of quote token on LP contract
      {
        address: qouteToken,
        name: 'balanceOf',
        params: [lpAddress],
      },
      // Balance of LP tokens in the master chef contract
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [getHerodotusAddress()],
      },
      // Total supply of LP tokens
      {
        address: lpAddress,
        name: 'totalSupply',
      },
    ]

    const [quoteTokenBlanceLP, lpTokenBalanceMC, lpTotalSupply] = await multicall(erc20, calls)

    // const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
    const lpTokenRatio = 1
    lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(18))
      .times(new BigNumber(2))
      .times(lpTokenRatio)
      .toNumber()
  } catch (error) {
    console.log(error)
  }
  return lpTotalInQuoteToken
}

// Thunks
export const fetchSixPrice = () => async (dispatch) => {
  const response = await axios.get(
    'https://s3-ap-southeast-1.amazonaws.com/database-s3public-g8ignhbbbk6e/prices/Current.json',
  )
  const usdPrice = _.get(response, 'data.assets.six.usd')
  dispatch(
    setSixPrice({
      sixPrice: usdPrice,
    }),
  )
}

export const fetchKlayPriceFromKlayswap = () => async (dispatch) => {
  const response = await axios.get('https://stat.klayswap.com/klayPrice.json')
  const usdPrice = _.get(response, 'data.priceUsd')
  dispatch(
    setKlayswapKlayPrice({
      klayPrice: usdPrice,
    }),
  )
}

export const fetchDefinixKlayPrice = () => async (dispatch) => {
  const fetchPromise = []

  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getDefinixKlayKusdtLPAddress(),
      pair1: getWklayAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getDefinixHerodotusAddress(),
    }),
  )
  const [[totalKlayInDefinixKlayKusdtPair, totalKusdtInDefinixKlayKusdtPair]] = await Promise.all(fetchPromise)
  const definixKlayKusdtRatio = totalKusdtInDefinixKlayKusdtPair / totalKlayInDefinixKlayKusdtPair || 0
  dispatch(
    setDefinixKlayPrice({
      price: definixKlayKusdtRatio,
    }),
  )
}

export const fetchFinixPrice = () => async (dispatch) => {
  const fetchPromise = []

  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixSixLPAddress(),
      pair1: getFinixAddress(),
      pair2: getSixAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixKlayLPAddress(),
      pair1: getFinixAddress(),
      pair2: getWklayAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixKspLPAddress(),
      pair1: getFinixAddress(),
      pair2: getKspAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixKusdtLPAddress(),
      pair1: getFinixAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixKusdtLPAddress(),
      pair1: getSixAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixKlayLPAddress(),
      pair1: getSixAddress(),
      pair2: getWklayAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getDefinixKlayKusdtLPAddress(),
      pair1: getWklayAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getDefinixHerodotusAddress(),
    }),
  )
  // FINIX-SIX
  const [
    [totalFinixDefinixFinixSixPair, totalSixDefinixFinixSixPair],
    [totalFinixDefinixFinixKlayPair, totalKlayDefinixFinixKlayPair],
    [totalFinixDefinixFinixKspPair, totalKspDefinixFinixKspPair],
    [totalFinixDefinixFinixKusdtPair, totalKusdtDefinixFinixKusdtPair],
    [totalSixDefinixSixKusdtPair, totalKusdtDefinixSixKusdtPair],
    [totalSixDefinixSixKlayPair, totalKlayDefinixSixKlayPair],
    [totalKlayInDefinixKlayKusdtPair, totalKusdtInDefinixKlayKusdtPair],
  ] = await Promise.all(fetchPromise)
  // const totalFinixDefinixFinixSixPair = 10000000.0
  // const totalSixDefinixFinixSixPair = 12820512.82
  const finixSixRatio = totalSixDefinixFinixSixPair / totalFinixDefinixFinixSixPair || 0
  // FINIX-BUSD
  // const totalFinixDefinixFinixBusdPair = 10000000.0
  // const totalBusdDefinixFinixBusdPair = 500000.0
  const finixKusdtRatio = totalKusdtDefinixFinixKusdtPair / totalFinixDefinixFinixKusdtPair || 0
  // FINIX-BNB
  // const totalFinixDefinixFinixBnbPair = 10000000.0
  // const totalBnbDefinixFinixBnbPair = 1824.82
  const finixKlayRatio = totalKlayDefinixFinixKlayPair / totalFinixDefinixFinixKlayPair || 0

  const finixKspRatio = totalFinixDefinixFinixKspPair / totalKspDefinixFinixKspPair || 0
  // SIX-BUSD
  // const totalSixDefinixSixBusdPair = 12820512.82
  // const totalBnbDefinixSixBusdPair = 500000.0
  const sixKusdtRatio = totalKusdtDefinixSixKusdtPair / totalSixDefinixSixKusdtPair || 0

  const sixKlayRatio = totalSixDefinixSixKlayPair / totalKlayDefinixSixKlayPair || 0
  // PANCAKE BNB-BUSD
  // const totalBnbInDefinixBnbBusdPair = 557985
  // const totalBusdInDefinixBnbBusdPair = 152220163
  const definixKlayKusdtRatio = totalKusdtInDefinixKlayKusdtPair / totalKlayInDefinixKlayKusdtPair || 0
  // Price cal
  const finixSixPrice = finixSixRatio * sixKusdtRatio
  const finixKlayPrice = finixKlayRatio * definixKlayKusdtRatio
  const finixKspPrice = finixKspRatio * finixKusdtRatio
  const sixKlayPrice = sixKlayRatio * definixKlayKusdtRatio
  const averageFinixPrice =
    (finixKusdtRatio * totalFinixDefinixFinixKusdtPair +
      finixKlayPrice * totalFinixDefinixFinixKlayPair +
      finixSixPrice * totalFinixDefinixFinixSixPair) /
    (totalFinixDefinixFinixKusdtPair + totalFinixDefinixFinixKlayPair + totalFinixDefinixFinixSixPair)

  // console.log('FINIX-SIX LP Address : ', getFinixSixLPAddress())
  // console.log('FINIX Address : ', getFinixAddress())
  // console.log('Total FINIX in FINIX-SIX pair : ', totalFinixDefinixFinixSixPair)
  // console.log('SIX Address : ', getSixAddress())
  // console.log('Total SIX in FINIX-SIX pair : ', totalSixDefinixFinixSixPair)
  // console.log('FINIX-BUSD LP Address : ', getFinixBusdLPAddress())
  // console.log('FINIX Address : ', getFinixAddress())
  // console.log('Total FINIX in FINIX-BUSD pair : ', totalFinixDefinixFinixBusdPair)
  // console.log('BUSD Address : ', getBusdAddress())
  // console.log('Total BUSD in FINIX-BUSD pair : ', totalBusdDefinixFinixBusdPair)
  // console.log('FINIX-WBNB LP Address : ', getFinixBnbLPAddress())
  // console.log('FINIX Address : ', getFinixAddress())
  // console.log('Total FINIX in FINIX-WBNB pair : ', totalFinixDefinixFinixBnbPair)
  // console.log('WBNB Address : ', getWbnbAddress())
  // console.log('Total WBNB in FINIX-WBNB pair : ', totalBnbDefinixFinixBnbPair)
  // console.log('SIX-BUSD LP Address : ', getSixBusdLPAddress())
  // console.log('SIX Address : ', getSixAddress())
  // console.log('Total SIX in SIX-BUSD pair : ', totalSixDefinixSixBusdPair)
  // console.log('BUSD Address : ', getBusdAddress())
  // console.log('Total BUSD in SIX-BUSD pair : ', totalBnbDefinixSixBusdPair)
  // console.log('Definix BNB-BUSD LP Address : ', getDefinixBnbBusdLPAddress())
  // console.log('WBNB Address : ', getWbnbAddress())
  // console.log('Total WBNB in Definix BNB-BUSD pair : ', totalBnbInDefinixBnbBusdPair)
  // console.log('BUSD Address : ', getBusdAddress())
  // console.log('Total BUSD in Definix BNB-BUSD pair : ', totalBusdInDefinixBnbBusdPair)

  dispatch(
    setFinixPrice({
      price: averageFinixPrice,
      totalFinixDefinixFinixSixPair,
      totalSixDefinixFinixSixPair,
      totalFinixDefinixFinixKusdtPair,
      totalKusdtDefinixFinixKusdtPair,
      totalFinixDefinixFinixKlayPair,
      totalKlayDefinixFinixKlayPair,
      totalFinixDefinixFinixKspPair,
      totalKspDefinixFinixKspPair,
      totalSixDefinixSixKusdtPair,
      totalKusdtDefinixSixKusdtPair,
      totalSixDefinixSixKlayPair,
      totalKlayDefinixSixKlayPair,
      totalKlayInDefinixKlayKusdtPair,
      totalKusdtInDefinixKlayKusdtPair,
    }),
  )
}

// Thunks
export const fetchQuote = () => async (dispatch) => {
  const finixAddress = getFinixAddress()
  const sixAddress = getSixAddress()
  const kdaiAddress = getKdaiAddress()
  const wklayAddress = getWklayAddress()
  const kspAddress = getKspAddress()
  const kusdtAddress = getKusdtAddress()

  let chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  if (chainId === ChainId.MAINNET) {
    chainId = ChainId.MAINNET
  } else if (chainId === ChainId.BAOBABTESTNET) {
    chainId = ChainId.BAOBABTESTNET
  }

  const FINIX = new Token(chainId, finixAddress, 18, 'FINIX', 'FINIX')
  const SIX = new Token(chainId, sixAddress, 18, 'SIX', 'SIX')
  const KDAI = new Token(chainId, kdaiAddress, 18, 'KDAI', 'KDAI')
  const WKLAY = new Token(chainId, wklayAddress, 18, 'WKLAY', 'Wrapped Klay')
  const KSP = new Token(chainId, kspAddress, 18, 'KSP', 'Klayswap Protocol')
  const KUSDT = new Token(chainId, kusdtAddress, 18, 'KUSDT', 'KUSDT')

  const fetchPromise = []

  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, SIX),
      qouteToken: finixAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(SIX, KUSDT),
      qouteToken: kusdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(SIX, WKLAY),
      qouteToken: wklayAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, KUSDT),
      qouteToken: kusdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, WKLAY),
      qouteToken: finixAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, KSP),
      qouteToken: finixAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(WKLAY, KUSDT),
      qouteToken: kusdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(KDAI, KUSDT),
      qouteToken: kusdtAddress,
    }),
  )

  const [
    sixFinixQuote,
    sixKusdtQuote,
    sixWklayQuote,
    finixKusdtQuote,
    finixWklayQuote,
    finixKspQuote,
    wklayKusdtQuote,
    kdaiKusdtQuote,
  ] = await Promise.all(fetchPromise)

  dispatch(
    setQuote({
      sixFinixQuote,
      sixKusdtQuote,
      sixWklayQuote,
      finixKusdtQuote,
      finixWklayQuote,
      finixKspQuote,
      wklayKusdtQuote,
      kdaiKusdtQuote,
    }),
  )
}
export default finixPriceSlice.reducer
