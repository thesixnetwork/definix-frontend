/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import {
  getDefinixHerodotusAddress,
  getHerodotusAddress,
  getWbnbAddress,
  getSixAddress,
  getFinixAddress,
  getBusdAddress,
  getFinixSixLPAddress,
  getFinixBusdLPAddress,
  getFinixBnbLPAddress,
  getSixBusdLPAddress,
  getDefinixBnbBusdLPAddress,
} from 'utils/addressHelpers'
import { createSlice } from '@reduxjs/toolkit'
import { FinixPriceState } from '../types'

const initialState: FinixPriceState = {
  price: 0,
  totalFinixDefinixFinixSixPair: 0,
  totalSixDefinixFinixSixPair: 0,
  totalFinixDefinixFinixBusdPair: 0,
  totalBusdDefinixFinixBusdPair: 0,
  totalFinixDefinixFinixBnbPair: 0,
  totalBnbDefinixFinixBnbPair: 0,
  totalSixDefinixSixBusdPair: 0,
  totalBnbDefinixSixBusdPair: 0,
  totalBnbInDefinixBnbBusdPair: 0,
  totalBusdInDefinixBnbBusdPair: 0,
}

export const finixPriceSlice = createSlice({
  name: 'FinixPrice',
  initialState,
  reducers: {
    setFinixPrice: (state, action) => {
      const {
        price,
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
      } = action.payload
      state.price = price
    },
  },
})

// Actions
export const { setFinixPrice } = finixPriceSlice.actions

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

// Thunks
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
    [totalFinixDefinixFinixBnbPair, totalBnbDefinixFinixBnbPair],
    [totalSixDefinixSixBusdPair, totalBnbDefinixSixBusdPair],
    [totalBnbInDefinixBnbBusdPair, totalBusdInDefinixBnbBusdPair],
  ] = await Promise.all(fetchPromise)
  // const totalFinixDefinixFinixSixPair = 10000000.0
  // const totalSixDefinixFinixSixPair = 12820512.82
  const finixSixRatio = totalSixDefinixFinixSixPair / totalFinixDefinixFinixSixPair || 0
  // FINIX-BUSD
  // const totalFinixDefinixFinixBusdPair = 10000000.0
  // const totalBusdDefinixFinixBusdPair = 500000.0
  const finixBusdRatio = totalBusdDefinixFinixBusdPair / totalFinixDefinixFinixBusdPair || 0
  // FINIX-BNB
  // const totalFinixDefinixFinixBnbPair = 10000000.0
  // const totalBnbDefinixFinixBnbPair = 1824.82
  const finixBnbRatio = totalBnbDefinixFinixBnbPair / totalFinixDefinixFinixBnbPair || 0
  // SIX-BUSD
  // const totalSixDefinixSixBusdPair = 12820512.82
  // const totalBnbDefinixSixBusdPair = 500000.0
  const sixBusdRatio = totalBnbDefinixSixBusdPair / totalSixDefinixSixBusdPair || 0
  // PANCAKE BNB-BUSD
  // const totalBnbInDefinixBnbBusdPair = 557985
  // const totalBusdInDefinixBnbBusdPair = 152220163
  const definixBnbBusdRatio = totalBusdInDefinixBnbBusdPair / totalBnbInDefinixBnbBusdPair || 0
  // Price cal
  const finixSixPrice = finixSixRatio * sixBusdRatio
  const finixBnbPrice = finixBnbRatio * definixBnbBusdRatio
  const averageFinixPrice =
    (finixBusdRatio * totalFinixDefinixFinixBusdPair +
      finixBnbPrice * totalFinixDefinixFinixBnbPair +
      finixSixPrice * totalFinixDefinixFinixSixPair) /
    (totalFinixDefinixFinixBusdPair + totalFinixDefinixFinixBnbPair + totalFinixDefinixFinixSixPair)

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

export default finixPriceSlice.reducer
