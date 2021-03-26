/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import {
  getPancakeMasterChefAddress,
  getMasterChefAddress,
  getWbnbAddress,
  getSixAddress,
  getFinixAddress,
  getBusdAddress,
  getFinixSixLPAddress,
  getFinixBusdLPAddress,
  getFinixBnbLPAddress,
  getSixBusdLPAddress,
  getPancakeBnbBusdLPAddress,
} from 'utils/addressHelpers'
import { createSlice } from '@reduxjs/toolkit'
import { FinixPriceState } from '../types'

const initialState: FinixPriceState = { price: 0 }

export const finixPriceSlice = createSlice({
  name: 'FinixPrice',
  initialState,
  reducers: {
    setFinixPrice: (state, action) => {
      const { price } = action.payload
      state.price = price
    },
  },
})

// Actions
export const { setFinixPrice } = finixPriceSlice.actions

const getTotalBalanceLp = async ({ lpAddress, pair1, pair2, masterChefAddress }) => {
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
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [masterChefAddress],
      },
      {
        address: lpAddress,
        name: 'totalSupply',
      },
    ]

    const [
      pair1BalanceLP,
      pair2BalanceLP,
      pair1Decimals,
      pair2Decimals,
      lpTokenBalanceMC,
      lpTotalSupply,
    ] = await multicall(erc20, calls)

    // Ratio in % a LP tokens that are in staking, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

    // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
    pair1Amount = new BigNumber(pair1BalanceLP).div(new BigNumber(10).pow(pair1Decimals)).times(lpTokenRatio).toNumber()
    pair2Amount = new BigNumber(pair2BalanceLP).div(new BigNumber(10).pow(pair2Decimals)).times(lpTokenRatio).toNumber()
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
      masterChefAddress: getMasterChefAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixBusdLPAddress(),
      pair1: getFinixAddress(),
      pair2: getBusdAddress(),
      masterChefAddress: getMasterChefAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getFinixBnbLPAddress(),
      pair1: getFinixAddress(),
      pair2: getWbnbAddress(),
      masterChefAddress: getMasterChefAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixBusdLPAddress(),
      pair1: getSixAddress(),
      pair2: getBusdAddress(),
      masterChefAddress: getMasterChefAddress(),
    }),
  )
  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getPancakeBnbBusdLPAddress(),
      pair1: getWbnbAddress(),
      pair2: getBusdAddress(),
      masterChefAddress: getPancakeMasterChefAddress(),
    }),
  )
  // FINIX-SIX
  const [
    [totalFinixDefinixFinixSixPair, totalSixDefinixFinixSixPair],
    [totalFinixDefinixFinixBusdPair, totalBusdDefinixFinixBusdPair],
    [totalFinixDefinixFinixBnbPair, totalBnbDefinixFinixBnbPair],
    [totalSixDefinixSixBusdPair, totalBnbDefinixSixBusdPair],
    [totalBnbInPancakeBnbBusdPair, totalBusdInPancakeBnbBusdPair],
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
  // const totalBnbInPancakeBnbBusdPair = 557985
  // const totalBusdInPancakeBnbBusdPair = 152220163
  const pancakeBnbBusdRatio = totalBusdInPancakeBnbBusdPair / totalBnbInPancakeBnbBusdPair || 0
  // Price cal
  const finixSixPrice = finixSixRatio * sixBusdRatio
  const finixBnbPrice = finixBnbRatio * pancakeBnbBusdRatio
  const averageFinixPrice =
    (finixBusdRatio * totalFinixDefinixFinixBusdPair +
      finixBnbPrice * totalFinixDefinixFinixBnbPair +
      finixSixPrice * totalFinixDefinixFinixSixPair) /
    (totalFinixDefinixFinixBusdPair + totalFinixDefinixFinixBnbPair + totalFinixDefinixFinixSixPair)
  dispatch(setFinixPrice({ price: averageFinixPrice }))
}

export default finixPriceSlice.reducer
