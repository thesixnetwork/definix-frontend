/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import { getLpNetwork, allTokens } from 'config/constants/tokens'
import multicall from 'utils/multicall'
import _ from 'lodash'
import axios from 'axios'

import { getAddress, getWbnbAddress, getBusdAddress, getDefinixBnbBusdLPAddress } from 'utils/addressHelpers'
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

const getTotalBalanceLp = async ({ lpAddress, pair1, pair2 }) => {
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
    pair1Amount = 0
    pair2Amount = 0
  }
  return [pair1Amount, pair2Amount]
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

const pairObjectCombination = (inputObject) => {
  const result = []
  const mark = {}
  Object.keys(inputObject).forEach((a) => {
    Object.keys(inputObject).forEach((b) => {
      if (a !== b) {
        if (!_.get(mark, `${a}.${b}`) && !_.get(mark, `${b}.${a}`)) {
          if (mark[a]) {
            mark[a][b] = true
          } else {
            mark[a] = { [b]: true }
          }
          result.push([a, b])
        }
      }
    })
  })
  return result
}

const findAndSelectPair = (pair) => {
  if (pair.indexOf('USDT') >= 0) {
    const firstKey = pair[0] === 'USDT' ? pair[1] : pair[0]
    const secondKey = pair[0] === 'USDT' ? pair[0] : pair[1]
    return [firstKey, secondKey]
  }
  if (pair.indexOf('FINIX') >= 0) {
    const firstKey = pair[0] === 'FINIX' ? pair[0] : pair[1]
    const secondKey = pair[0] === 'FINIX' ? pair[1] : pair[0]
    return [firstKey, secondKey]
  }
  return undefined
}

export const fetchFinixPrice = () => async (dispatch) => {
  const allTokenCombinationKeys = pairObjectCombination(allTokens)
  const allFinixPair = allTokenCombinationKeys.filter((item) => item.indexOf('FINIX') >= 0 || item.indexOf('USDT') >= 0)
  const sortedPair = _.compact(allFinixPair.map((pair) => findAndSelectPair(pair)))
  const searchablePair = {}
  sortedPair.forEach((pair, index) => {
    if (!searchablePair[pair[0]]) {
      searchablePair[pair[0]] = {}
    }
    searchablePair[pair[0]][pair[1]] = index
  })
  const fetchPromise = []
  sortedPair.forEach((pair) => {
    const [firstKey, secondKey] = findAndSelectPair(pair)
    const firstTokenAddress = allTokens[firstKey]
    const secondTokenAddress = allTokens[secondKey]
    fetchPromise.push(
      getTotalBalanceLp({
        lpAddress: getAddress(getLpNetwork(firstTokenAddress, secondTokenAddress)),
        pair1: getAddress(firstTokenAddress),
        pair2: getAddress(secondTokenAddress),
      }),
    )
  })
  const allFetchedData = await Promise.all(fetchPromise)
  const allRatio = allFetchedData.map((data) => {
    if (data) {
      const ratio = data[1] / data[0] || 0
      return ratio
    }
    return undefined
  })
  const allPrices = allFetchedData.map((data, index) => {
    const currentPair = sortedPair[index]
    if (data && currentPair[0] === 'FINIX') {
      if (currentPair[1] === 'USDT') {
        return [allRatio[index], allFetchedData[index][1]]
      }
      const pairIndex = searchablePair[currentPair[1]].USDT
      return [allRatio[index] * allRatio[pairIndex], allFetchedData[index][1]]
    }
    return undefined
  })
  const availAllPrices = _.compact(allPrices)
  const calPrice = availAllPrices.reduce((sum, pair) => sum + pair[0] * pair[1], 0)
  const quoteSum = availAllPrices.reduce((sum, pair) => sum + pair[1], 0)
  const finixPrice = calPrice / quoteSum || 0
  dispatch(
    setFinixPrice({
      price: finixPrice,
    }),
  )
}

export default finixPriceSlice.reducer
