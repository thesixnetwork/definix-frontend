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
  getKbnbAddress,
  getWklayAddress,
  getKethAddress,
  getSixAddress,
  getFinixAddress,
  getKspAddress,
  getKdaiAddress,
  getKusdtAddress,
  getKxrpAddress,
  getKbtcAddress,
  getFinixSixLPAddress,
  getFinixKusdtLPAddress,
  getFinixKlayLPAddress,
  getFinixKspLPAddress,
  getSixKusdtLPAddress,
  getSixKlayLPAddress,
  getKlayKethLPAddress,
  getKlayKbtcLPAddress,
  getKlayKxrpLPAddress,
  getKethKusdtLPAddress,
  getKbtcKusdtLPAddress,
  getKxrpKusdtLPAddress,
  getKlayKusdtLPAddress,
  getKdaiKusdtLPAddress,
  getKbnbKusdtLPAddress,
  getKbnbFinixLPAddress,
  getDefinixKlayKusdtLPAddress,
} from 'utils/addressHelpers'
import { createSlice } from '@reduxjs/toolkit'
import { FinixPriceState } from '../types'

const initialState: FinixPriceState = {
  caverTVL: 0,
  web3TVL: 0,
  price: 0,
  sixPrice: 0,
  definixKlayPrice: 0,
  klayswapKlayPrice: 0,
  sixFinixQuote: 0,
  finixKusdtQuote: 0,
  finixWklayQuote: 0,
  finixKspQuote: 0,
  sixKusdtQuote: 0,
  sixWklayQuote: 0,
  klayKethQuote: 0,
  klayKbtcQuote: 0,
  klayKxrpQuote: 0,
  kethKusdtQuote: 0,
  kbtcKusdtQuote: 0,
  kxrpKusdtQuote: 0,
  wklayKusdtQuote: 0,
  kdaiKusdtQuote: 0,
  kbnbKusdtQuote: 0,
  kbnbFinixQuote: 0,
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
    setTVL: (state, action) => {
      const { caverTVL, web3TVL } = action.payload
      state.caverTVL = caverTVL
      state.web3TVL = web3TVL
    },
    setQuote: (state, action) => {
      const {
        sixFinixQuote,
        finixKusdtQuote,
        finixWklayQuote,
        finixKspQuote,
        sixKusdtQuote,
        sixWklayQuote,
        klayKethQuote,
        klayKbtcQuote,
        klayKxrpQuote,
        kethKusdtQuote,
        kbtcKusdtQuote,
        kxrpKusdtQuote,
        wklayKusdtQuote,
        kdaiKusdtQuote,
        kbnbKusdtQuote,
        kbnbFinixQuote,
      } = action.payload
      state.sixFinixQuote = sixFinixQuote
      state.finixKusdtQuote = finixKusdtQuote
      state.finixWklayQuote = finixWklayQuote
      state.finixKspQuote = finixKspQuote
      state.sixKusdtQuote = sixKusdtQuote
      state.sixWklayQuote = sixWklayQuote
      state.klayKethQuote = klayKethQuote
      state.klayKbtcQuote = klayKbtcQuote
      state.klayKxrpQuote = klayKxrpQuote
      state.kethKusdtQuote = kethKusdtQuote
      state.kbtcKusdtQuote = kbtcKusdtQuote
      state.kxrpKusdtQuote = kxrpKusdtQuote
      state.wklayKusdtQuote = wklayKusdtQuote
      state.kdaiKusdtQuote = kdaiKusdtQuote
      state.kbnbKusdtQuote = kbnbKusdtQuote
      state.kbnbFinixQuote = kbnbFinixQuote
    },
  },
})

// Actions
export const { setTVL, setSixPrice, setFinixPrice, setQuote, setDefinixKlayPrice, setKlayswapKlayPrice } =
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
      // Quote token decimals
      {
        address: qouteToken,
        name: 'decimals',
      },
    ]

    const [quoteTokenBlanceLP, lpTokenBalanceMC, lpTotalSupply, quoteTokenDecimals] = await multicall(erc20, calls)

    // const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
    const lpTokenRatio = 1
    lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(new BigNumber(2))
      .times(lpTokenRatio)
      .toNumber()
  } catch (error) {
    console.log('>>>>>>>>>>>>>>>>>> lpAddress = ', lpAddress, ' qouteToken = ', qouteToken)
    console.log(error)
  }
  return lpTotalInQuoteToken
}

// Thunks
export const fetchSixPrice = () => async (dispatch) => {
  const fetchPromise = []

  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixKusdtLPAddress(),
      pair1: getSixAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  const [[totalSixInDefinixSixKusdtPair, totalKusdtInDefinixSixKusdtPair]] = await Promise.all(fetchPromise)
  const definixSixKusdtRatio = totalKusdtInDefinixSixKusdtPair / totalSixInDefinixSixKusdtPair || 0
  dispatch(
    setSixPrice({
      sixPrice: definixSixKusdtRatio,
    }),
  )
}

export const fetchTVL = () => async (dispatch) => {
  const response = await axios.get(
    'https://database-s3public-g8ignhbbbk6e.s3.ap-southeast-1.amazonaws.com/definix/tvl.json',
  )
  const caverTVL = _.get(response, 'data.caverTVL')
  const web3TVL = _.get(response, 'data.web3TVL')
  dispatch(
    setTVL({
      caverTVL,
      web3TVL,
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

  // pid 2
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixSixLPAddress(),
      pair1: getFinixAddress(),
      pair2: getSixAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  // pid 3
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixKlayLPAddress(),
      pair1: getFinixAddress(),
      pair2: getWklayAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  // pid 4
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixKspLPAddress(),
      pair1: getFinixAddress(),
      pair2: getKspAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  // pid 5
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixKusdtLPAddress(),
      pair1: getFinixAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  // pid 6
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixKusdtLPAddress(),
      pair1: getSixAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  // pid 7
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixKlayLPAddress(),
      pair1: getSixAddress(),
      pair2: getWklayAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  // // pid 8
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKlayKethLPAddress(),
  //     pair1: getWklayAddress(),
  //     pair2: getKethAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // // pid 9
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKlayKbtcLPAddress(),
  //     pair1: getWklayAddress(),
  //     pair2: getKbtcAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // // pid 10
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKlayKxrpLPAddress(),
  //     pair1: getWklayAddress(),
  //     pair2: getKxrpAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // // pid 11
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKethKusdtLPAddress(),
  //     pair1: getKethAddress(),
  //     pair2: getKusdtAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // // pid 12
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKbtcKusdtLPAddress(),
  //     pair1: getKbtcAddress(),
  //     pair2: getKusdtAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // // pid 13
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKxrpKusdtLPAddress(),
  //     pair1: getKxrpAddress(),
  //     pair2: getKusdtAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // pid 14 >>>>>>>
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getKlayKusdtLPAddress(),
      pair1: getWklayAddress(),
      pair2: getKusdtAddress(),
      herodotusAddress: getDefinixHerodotusAddress(),
    }),
  )
  // // pid 15
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKdaiKusdtLPAddress(),
  //     pair1: getKdaiAddress(),
  //     pair2: getKusdtAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // // pid 16
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKbnbKusdtLPAddress(),
  //     pair1: getKbnbAddress(),
  //     pair2: getKusdtAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // // pid 17
  // fetchPromise.push(
  //   getTotalBalanceLp({
  //     lpAddress: getKbnbFinixLPAddress(),
  //     pair1: getKbnbAddress(),
  //     pair2: getFinixAddress(),
  //     herodotusAddress: getDefinixHerodotusAddress(),
  //   }),
  // )
  // FINIX-SIX
  const [
    [totalFinixDefinixFinixSixPair, totalSixDefinixFinixSixPair],
    [totalFinixDefinixFinixKlayPair, totalKlayDefinixFinixKlayPair],
    [totalFinixDefinixFinixKspPair, totalKspDefinixFinixKspPair],
    [totalFinixDefinixFinixKusdtPair, totalKusdtDefinixFinixKusdtPair],
    [totalSixDefinixSixKusdtPair, totalKusdtDefinixSixKusdtPair],
    [totalSixDefinixSixKlayPair, totalKlayDefinixSixKlayPair],
    // new 8
    // [totalKlayDefinixKlayKethPair,totalKethDefinixKlayKethPair],
    // [totalKlayDefinixKlayKbtcPair,totalKbtcDefinixKlayKbtcPair],
    // [totalKlayDefinixKlayKxrpPair,totalKxrpDefinixKlayKxrpPair],
    // [totalKethDefinixKethKusdtPair,totalKusdtDefinixKethKusdtPair],
    // [totalKbtcDefinixKbtcKusdtPair,totalKusdtDefinixKbtcKusdtPair],
    // [totalKxrpDefinixKxrpKusdtPair,totalKusdtDefinixKxrpKusdtPair],
    // old
    [totalKlayInDefinixKlayKusdtPair, totalKusdtInDefinixKlayKusdtPair],
    // new
    // [totalKdaiDefinixKxrpKusdtPair,totalKusdtDefinixKdaiKusdtPair],
    // [totalKbnbDefinixKbnbKusdtPair,totalKusdtDefinixKbnbKusdtPair],
    // [totalKbnbDefinixKbnbFinixPair,totalFinixDefinixKbnbFinixPair],
  ] = await Promise.all(fetchPromise)
  const finixSixRatio = totalSixDefinixFinixSixPair / totalFinixDefinixFinixSixPair || 0
  const finixKusdtRatio = totalKusdtDefinixFinixKusdtPair / totalFinixDefinixFinixKusdtPair || 0
  const finixKlayRatio = totalKlayDefinixFinixKlayPair / totalFinixDefinixFinixKlayPair || 0
  const finixKspRatio = totalFinixDefinixFinixKspPair / totalKspDefinixFinixKspPair || 0
  const sixKusdtRatio = totalKusdtDefinixSixKusdtPair / totalSixDefinixSixKusdtPair || 0

  const sixKlayRatio = totalSixDefinixSixKlayPair / totalKlayDefinixSixKlayPair || 0

  // NEW
  // const klayKethRatio = totalKlayDefinixKlayKethPair / totalKethDefinixKlayKethPair || 0
  // const klayKbtcRatio = totalKlayDefinixKlayKbtcPair / totalKbtcDefinixKlayKbtcPair || 0
  // const klayKxrpRatio = totalKlayDefinixKlayKxrpPair / totalKxrpDefinixKlayKxrpPair || 0
  // const kethKusdtRatio = totalKethDefinixKethKusdtPair / totalKusdtDefinixKethKusdtPair || 0
  // const kbtcKusdtRatio = totalKbtcDefinixKbtcKusdtPair / totalKusdtDefinixKbtcKusdtPair || 0
  // const kxrpKusdtRatio = totalKxrpDefinixKxrpKusdtPair / totalKusdtDefinixKxrpKusdtPair || 0
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
  const kethAddress = getKethAddress()
  const kbtcAddress = getKbtcAddress()
  const kxrpAddress = getKxrpAddress()
  const kbnbAddress = getKbnbAddress()

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
  const KETH = new Token(chainId, kethAddress, 18, 'KETH', 'KETH')
  const KWBTC = new Token(chainId, kbtcAddress, 18, 'KWBTC', 'KWBTC')
  const KXRP = new Token(chainId, kxrpAddress, 18, 'KXRP', 'KXRP')
  const KBNB = new Token(chainId, kbnbAddress, 18, 'KBNB', 'KBNB')

  const fetchPromise = []

  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, SIX),
      qouteToken: finixAddress,
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
  // 8
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(WKLAY, KETH),
      qouteToken: wklayAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(WKLAY, KWBTC),
      qouteToken: wklayAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(WKLAY, KXRP),
      qouteToken: wklayAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(KETH, KUSDT),
      qouteToken: kusdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(KWBTC, KUSDT),
      qouteToken: kusdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(KXRP, KUSDT),
      qouteToken: kusdtAddress,
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
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(KBNB, KUSDT),
      qouteToken: kusdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(KBNB, FINIX),
      qouteToken: finixAddress,
    }),
  )
  // fetchPromise.push(
  //   getTotalQuote({
  //     lpAddress: Pair.getAddress(KDAI, KUSDT),
  //     qouteToken: kusdtAddress,
  //   }),
  // )

  const [
    sixFinixQuote,
    finixKusdtQuote,
    finixWklayQuote,
    finixKspQuote,
    sixKusdtQuote,
    sixWklayQuote,
    // 8
    klayKethQuote,
    klayKbtcQuote,
    klayKxrpQuote,
    kethKusdtQuote,
    kbtcKusdtQuote,
    kxrpKusdtQuote,

    wklayKusdtQuote,
    kdaiKusdtQuote,
    kbnbKusdtQuote,
    kbnbFinixQuote,
  ] = await Promise.all(fetchPromise)

  dispatch(
    setQuote({
      sixFinixQuote,
      finixKusdtQuote,
      finixWklayQuote,
      finixKspQuote,
      sixKusdtQuote,
      sixWklayQuote,
      // 8
      klayKethQuote,
      klayKbtcQuote,
      klayKxrpQuote,
      kethKusdtQuote,
      kbtcKusdtQuote,
      kxrpKusdtQuote,

      wklayKusdtQuote,
      kdaiKusdtQuote,
      kbnbKusdtQuote,
      kbnbFinixQuote,
    }),
  )
}
export default finixPriceSlice.reducer
