/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import { getLpNetwork, allTokens } from 'config/constants/tokens'
import multicall from 'utils/multicall'
import { get, compact } from 'lodash-es'
import axios from 'axios'

import {
  getAddress,
  getWklayAddress,
  getSixAddress,
  getKusdtAddress,
  getSixKusdtLPAddress,
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
  favorPrice: 0,
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
    setFavorPrice: (state, action) => {
      const { price } = action.payload
      state.favorPrice = price
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
  },
})

// Actions
export const { setTVL, setSixPrice, setFinixPrice, setFavorPrice, setDefinixKlayPrice, setKlayswapKlayPrice } = finixPriceSlice.actions

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
  const fetchPromise = []

  fetchPromise.push(
    getTotalBalanceLp({
      lpAddress: getSixKusdtLPAddress(),
      pair1: getSixAddress(),
      pair2: getKusdtAddress(),
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
  const response = await axios.get(process.env.REACT_APP_S3_TVL)
  const caverTVL = get(response, 'data.caverTVL')
  const web3TVL = get(response, 'data.web3TVL')
  dispatch(
    setTVL({
      caverTVL,
      web3TVL,
    }),
  )
}

export const fetchKlayPriceFromKlayswap = () => async (dispatch) => {
  const response = await axios.get('https://stat.klayswap.com/klayPrice.json')
  const usdPrice = get(response, 'data.priceUsd')
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

const pairObjectCombination = (inputObject) => {
  const result = []
  const mark = {}
  Object.keys(inputObject).forEach((a) => {
    Object.keys(inputObject).forEach((b) => {
      if (a !== b) {
        if (!get(mark, `${a}.${b}`) && !get(mark, `${b}.${a}`)) {
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
  if (pair.indexOf('KUSDT') >= 0) {
    const firstKey = pair[0] === 'KUSDT' ? pair[1] : pair[0]
    const secondKey = pair[0] === 'KUSDT' ? pair[0] : pair[1]
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
  const allFinixPair = allTokenCombinationKeys.filter(
    (item) => item.indexOf('FINIX') >= 0 || item.indexOf('KUSDT') >= 0,
  )
  const sortedPair = compact(allFinixPair.map((pair) => findAndSelectPair(pair)))
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
      if (currentPair[1] === 'KUSDT') {
        return [allRatio[index], allFetchedData[index][1]]
      }
      const pairIndex = searchablePair[currentPair[1]].KUSDT
      return [allRatio[index] * allRatio[pairIndex], allFetchedData[index][1]]
    }
    return undefined
  })
  const availAllPrices = compact(allPrices)
  const calPrice = availAllPrices.reduce((sum, pair) => sum + pair[0] * pair[1], 0)
  const quoteSum = availAllPrices.reduce((sum, pair) => sum + pair[1], 0)
  const finixPrice = calPrice / quoteSum || 0
  dispatch(
    setFinixPrice({
      price: finixPrice,
    }),
  )
}

export const fetchFavorPrice = () => async (dispatch) => {
  const allTokenCombinationKeys = pairObjectCombination(allTokens)
  const allFavorPair = allTokenCombinationKeys.filter(
    (item) => item.indexOf('Favor') >= 0 || item.indexOf('FAVOR') >= 0 || item.indexOf('KUSDT') >= 0,
  )
  const sortedPair = compact(allFavorPair.map((pair) => findAndSelectPair(pair)))
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
    if (data && (currentPair[0] === 'FAVOR' || data && currentPair[0] === 'Favor')) {
      if (currentPair[1] === 'KUSDT') {
        return [allRatio[index], allFetchedData[index][1]]
      }
      const pairIndex = searchablePair[currentPair[1]].KUSDT
      return [allRatio[index] * allRatio[pairIndex], allFetchedData[index][1]]
    }
    return undefined
  })
  const availAllPrices = compact(allPrices)
  const calPrice = availAllPrices.reduce((sum, pair) => sum + pair[0] * pair[1], 0)
  const quoteSum = availAllPrices.reduce((sum, pair) => sum + pair[1], 0)
  const favorPrice = calPrice / quoteSum || 0
  dispatch(
    setFavorPrice({
      price: favorPrice,
    }),
  )
}
export default finixPriceSlice.reducer
