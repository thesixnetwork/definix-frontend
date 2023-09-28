/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import { Token, Pair } from 'definixswap-sdk'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import _ from 'lodash'
import axios from 'axios'
import {
  getDefinixHerodotusAddress,
  getHerodotusAddress,
  getWbnbAddress,
  getSixAddress,
  getFinixAddress,
  getBusdAddress,
  getUsdtAddress,
  getBtcbAddress,
  getEthAddress,
  getFinixSixLPAddress,
  getFinixBusdLPAddress,
  getFinixUsdtLPAddress,
  getFinixBnbLPAddress,
  getSixBusdLPAddress,
  getSixUsdtLPAddress,
  getDefinixBnbBusdLPAddress,
} from 'utils/addressHelpers'
import { createSlice } from '@reduxjs/toolkit'
import { FinixPriceState } from '../types'

const initialState: FinixPriceState = {
  caverTVL: 0,
  web3TVL: 0,
  price: 0,
  sixPrice: 0,
  pancakeBnbPrice: 0,
  sixFinixQuote: 0,
  sixBusdQuote: 0,
  sixUsdtQuote: 0,
  sixWbnbQuote: 0,
  finixBusdQuote: 0,
  finixUsdtQuote: 0,
  finixWbnbQuote: 0,
  wbnbBusdQuote: 0,
  wbnbUsdtQuote: 0,
  busdUsdtQuote: 0,
  bnbBtcbQuote: 0,
  ethBnbQuote: 0,
  veloBusdPrice: 0,
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
    setPancakeBnbPrice: (state, action) => {
      const { price } = action.payload
      state.pancakeBnbPrice = price
    },
    setTVL: (state, action) => {
      const { caverTVL, web3TVL } = action.payload
      state.caverTVL = caverTVL
      state.web3TVL = web3TVL
    },
    setVeloProce: (state, action) => {
      const { price } = action.payload
      state.veloBusdPrice = price
    },
    setQuote: (state, action) => {
      const {
        sixFinixQuote,
        sixBusdQuote,
        sixUsdtQuote,
        sixWbnbQuote,
        finixBusdQuote,
        finixUsdtQuote,
        finixWbnbQuote,
        wbnbBusdQuote,
        wbnbUsdtQuote,
        busdUsdtQuote,
        bnbBtcbQuote,
        ethBnbQuote,
      } = action.payload
      state.sixFinixQuote = sixFinixQuote
      state.sixBusdQuote = sixBusdQuote
      state.sixUsdtQuote = sixUsdtQuote
      state.sixWbnbQuote = sixWbnbQuote
      state.finixBusdQuote = finixBusdQuote
      state.finixUsdtQuote = finixUsdtQuote
      state.finixWbnbQuote = finixWbnbQuote
      state.wbnbBusdQuote = wbnbBusdQuote
      state.wbnbUsdtQuote = wbnbUsdtQuote
      state.busdUsdtQuote = busdUsdtQuote
      state.bnbBtcbQuote = bnbBtcbQuote
      state.ethBnbQuote = ethBnbQuote
    },
  },
})

// Actions
export const { setTVL, setSixPrice, setFinixPrice, setQuote, setPancakeBnbPrice } = finixPriceSlice.actions

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

// Thunks
export const fetchTVL = () => async (dispatch) => {
  const response = await axios.get(process.env.REACT_APP_S3_TVL)
  const caverTVL = _.get(response, 'data.caverTVL', 0)
  const web3TVL = _.get(response, 'data.web3TVL', 0)
  dispatch(
    setTVL({
      caverTVL,
      web3TVL,
    }),
  )
}

export const fetchPancakeBnbPrice = () => async (dispatch) => {
  const fetchPromise = []

  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getDefinixBnbBusdLPAddress(),
      pair1: getWbnbAddress(),
      pair2: getBusdAddress(),
      herodotusAddress: getDefinixHerodotusAddress(),
    }),
  )
  const [[totalBnbInDefinixBnbBusdPair, totalBusdInDefinixBnbBusdPair]] = await Promise.all(fetchPromise)
  const definixBnbBusdRatio = totalBusdInDefinixBnbBusdPair / totalBnbInDefinixBnbBusdPair || 0
  dispatch(
    setPancakeBnbPrice({
      price: definixBnbBusdRatio,
    }),
  )
}

export const fetchVeloUsdPrice = () => async (dispatch) => {
  const fetchPromise = []

  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getDefinixBnbBusdLPAddress(),
      pair1: getWbnbAddress(),
      pair2: getBusdAddress(),
      herodotusAddress: getDefinixHerodotusAddress(),
    }),
  )
  const [[totalBnbInDefinixBnbBusdPair, totalBusdInDefinixBnbBusdPair]] = await Promise.all(fetchPromise)
  const definixBnbBusdRatio = totalBusdInDefinixBnbBusdPair / totalBnbInDefinixBnbBusdPair || 0
  dispatch(
    setPancakeBnbPrice({
      price: definixBnbBusdRatio,
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
      lpAddress: getFinixBusdLPAddress(),
      pair1: getFinixAddress(),
      pair2: getBusdAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixUsdtLPAddress(),
      pair1: getFinixAddress(),
      pair2: getUsdtAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixBnbLPAddress(),
      pair1: getFinixAddress(),
      pair2: getWbnbAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixBusdLPAddress(),
      pair1: getSixAddress(),
      pair2: getBusdAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixUsdtLPAddress(),
      pair1: getSixAddress(),
      pair2: getUsdtAddress(),
      herodotusAddress: getHerodotusAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getDefinixBnbBusdLPAddress(),
      pair1: getWbnbAddress(),
      pair2: getBusdAddress(),
      herodotusAddress: getDefinixHerodotusAddress(),
    }),
  )
  // FINIX-SIX
  const [
    [totalFinixDefinixFinixSixPair, totalSixDefinixFinixSixPair],
    [totalFinixDefinixFinixBusdPair, totalBusdDefinixFinixBusdPair],
    [totalFinixDefinixFinixUsdtPair, totalUsdtDefinixFinixUsdtPair],
    [totalFinixDefinixFinixBnbPair, totalBnbDefinixFinixBnbPair],
    [totalSixDefinixSixBusdPair, totalBnbDefinixSixBusdPair],
    [totalSixDefinixSixUsdtPair, totalBnbDefinixSixUsdtPair],
    [totalBnbInDefinixBnbBusdPair, totalBusdInDefinixBnbBusdPair],
  ] = await Promise.all(fetchPromise)
  // const totalFinixDefinixFinixSixPair = 10000000.0
  // const totalSixDefinixFinixSixPair = 12820512.82
  const finixSixRatio = totalSixDefinixFinixSixPair / totalFinixDefinixFinixSixPair || 0
  // FINIX-BUSD
  // const totalFinixDefinixFinixBusdPair = 10000000.0
  // const totalBusdDefinixFinixBusdPair = 500000.0
  const finixBusdRatio = totalBusdDefinixFinixBusdPair / totalFinixDefinixFinixBusdPair || 0
  // FINIX-USDT
  // const totalFinixDefinixFinixUsdtPair = 10000000.0
  // const totalUsdtDefinixFinixUsdtPair = 500000.0
  const finixUsdtRatio = totalUsdtDefinixFinixUsdtPair / totalFinixDefinixFinixUsdtPair || 0
  // FINIX-BNB
  // const totalFinixDefinixFinixBnbPair = 10000000.0
  // const totalBnbDefinixFinixBnbPair = 1824.82
  const finixBnbRatio = totalBnbDefinixFinixBnbPair / totalFinixDefinixFinixBnbPair || 0
  // SIX-BUSD
  // const totalSixDefinixSixBusdPair = 12820512.82
  // const totalBnbDefinixSixBusdPair = 500000.0
  const sixBusdRatio = totalBnbDefinixSixBusdPair / totalSixDefinixSixBusdPair || 0
  // SIX-USDT
  // const totalSixDefinixSixUsdtPair = 12820512.82
  // const totalBnbDefinixSixUsdtPair = 500000.0
  const sixUsdtRatio = totalBnbDefinixSixUsdtPair / totalSixDefinixSixUsdtPair || 0
  // PANCAKE BNB-BUSD
  // const totalBnbInDefinixBnbBusdPair = 557985
  // const totalBusdInDefinixBnbBusdPair = 152220163
  const definixBnbBusdRatio = totalBusdInDefinixBnbBusdPair / totalBnbInDefinixBnbBusdPair || 0
  // Price cal
  const finixSixPrice = finixSixRatio * sixBusdRatio
  // const averagefinixSixPrice = finixSixRatio * sixBusdRatio
  const finixBnbPrice = finixBnbRatio * definixBnbBusdRatio
  const averageFinixPrice =
    (finixBusdRatio * totalFinixDefinixFinixBusdPair +
      finixUsdtRatio * totalFinixDefinixFinixUsdtPair +
      finixBnbPrice * totalFinixDefinixFinixBnbPair +
      finixSixPrice * totalFinixDefinixFinixSixPair) /
    (totalFinixDefinixFinixBusdPair +
      totalFinixDefinixFinixUsdtPair +
      totalFinixDefinixFinixBnbPair +
      totalFinixDefinixFinixSixPair)

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
      totalFinixDefinixFinixBusdPair,
      totalBusdDefinixFinixBusdPair,
      totalFinixDefinixFinixBnbPair,
      totalBnbDefinixFinixBnbPair,
      totalSixDefinixSixBusdPair,
      totalBnbDefinixSixBusdPair,
      totalBnbInDefinixBnbBusdPair,
      totalBusdInDefinixBnbBusdPair,
    }),
  )
}

// Thunks
export const fetchQuote = () => async (dispatch) => {
  const finixAddress = getFinixAddress()
  const sixAddress = getSixAddress()
  const busdAddress = getBusdAddress()
  const wbnbAddress = getWbnbAddress()
  const usdtAddress = getUsdtAddress()
  const btcbAddress = getBtcbAddress()
  const ethAddress = getEthAddress()
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

  const FINIX = new Token(chainId, finixAddress, 18, 'FINIX', 'FINIX')
  const SIX = new Token(chainId, sixAddress, 18, 'SIX', 'SIX')
  const BUSD = new Token(chainId, busdAddress, 18, 'BUSD', 'BUSD')
  const WBNB = new Token(chainId, wbnbAddress, 18, 'WBNB', 'Wrapped BNB')
  const USDT = new Token(chainId, usdtAddress, 18, 'USDT', 'USDT')
  const BTCB = new Token(chainId, btcbAddress, 18, 'BTCB', 'BTCB')
  const ETH = new Token(chainId, ethAddress, 18, 'ETH', 'ETH')

  const fetchPromise = []

  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(SIX, FINIX),
      qouteToken: finixAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(SIX, BUSD),
      qouteToken: busdAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(SIX, USDT),
      qouteToken: usdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(SIX, WBNB),
      qouteToken: wbnbAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, BUSD),
      qouteToken: busdAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, USDT),
      qouteToken: usdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(FINIX, WBNB),
      qouteToken: finixAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(WBNB, BUSD),
      qouteToken: busdAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(WBNB, USDT),
      qouteToken: usdtAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(BUSD, USDT),
      qouteToken: busdAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(WBNB, BTCB),
      qouteToken: wbnbAddress,
    }),
  )
  fetchPromise.push(
    getTotalQuote({
      lpAddress: Pair.getAddress(ETH, WBNB),
      qouteToken: wbnbAddress,
    }),
  )

  const [
    sixFinixQuote,
    sixBusdQuote,
    sixUsdtQuote,
    sixWbnbQuote,
    finixBusdQuote,
    finixUsdtQuote,
    finixWbnbQuote,
    wbnbBusdQuote,
    wbnbUsdtQuote,
    busdUsdtQuote,
    bnbBtcbQuote,
    ethBnbQuote,
  ] = await Promise.all(fetchPromise)

  dispatch(
    setQuote({
      sixFinixQuote,
      sixBusdQuote,
      sixUsdtQuote,
      sixWbnbQuote,
      finixBusdQuote,
      finixUsdtQuote,
      finixWbnbQuote,
      wbnbBusdQuote,
      wbnbUsdtQuote,
      busdUsdtQuote,
      bnbBtcbQuote,
      ethBnbQuote,
    }),
  )
}
export default finixPriceSlice.reducer
