/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import rebalance from 'config/abi/rebalance.json'
import multicall from 'utils/multicall'
import _ from 'lodash'
import { createSlice } from '@reduxjs/toolkit'
import { getAddress } from 'utils/addressHelpers'
import rebalancesConfig from 'config/constants/rebalances'
import { RebalanceState } from '../types'

const initialState: RebalanceState = {
  isFetched: false,
  data: [...rebalancesConfig],
}

export const rebalanceSlice = createSlice({
  name: 'Rebalance',
  initialState,
  reducers: {
    setRebalances: (state, action) => {
      const { data } = action.payload
      state.data = data
      state.isFetched = true
    },
  },
})

// Actions
export const { setRebalances } = rebalanceSlice.actions

export const fetchRebalances = () => async (dispatch) => {
  const data = await Promise.all(
    rebalancesConfig.map(async (rebalanceConfig) => {
      const address = getAddress(rebalanceConfig.address)
      const rebalanceCalls = [
        {
          address,
          name: 'getCurrentPoolUSDBalance',
        },
        {
          address,
          name: 'activeUserCount',
        },
        {
          address,
          name: 'getTokensLength',
        },
        {
          address,
          name: 'usdToken',
        },
        {
          address,
          name: 'usdTokenRatioPoint',
        },
        {
          address,
          name: 'enableAutoCompound',
        },
        {
          address,
          name: 'autoHerodotus',
        },
      ]
      const erc20Calls = [
        {
          address,
          name: 'totalSupply',
        },
      ]

      const [
        [currentPoolUsdBalances, sumCurrentPoolUsdBalance],
        activeUserCount,
        tokenLength,
        usdTokenAddresses,
        usdTokenRatioPoint,
        [enableAutoCompound],
        [autoHerodotus],
      ] = await multicall(rebalance, rebalanceCalls)
      const tokenCallers = []
      for (let i = 0; i < tokenLength; i++) {
        tokenCallers.push(multicall(rebalance, [{ address, name: 'tokens', params: [i] }]))
      }
      const tokenRatioPointsCallers = []
      for (let i = 0; i < tokenLength; i++) {
        tokenRatioPointsCallers.push(multicall(rebalance, [{ address, name: 'tokenRatioPoints', params: [i] }]))
      }
      const tokenAddresss = _.flattenDeep(await Promise.all(tokenCallers))
      const tokenRatioPoints = _.flattenDeep(await Promise.all(tokenRatioPointsCallers))
      const makeTokenCallers = (inputArray) => {
        return inputArray.map((tokenAddress) => {
          return multicall(erc20, [
            { address: tokenAddress, name: 'name' },
            { address: tokenAddress, name: 'symbol' },
            { address: tokenAddress, name: 'decimals' },
            {
              address: tokenAddress,
              name: 'balanceOf',
              params: [address],
            },
          ]).then((calledTokenData) => {
            const [[name], [symbol], [decimals], [totalBalance]] = calledTokenData
            return {
              address: tokenAddress,
              name,
              symbol,
              decimals,
              // @ts-ignore
              totalBalance: new BigNumber([totalBalance]),
            }
          })
        })
      }
      const tokenInfoCallers = makeTokenCallers(tokenAddresss)
      const tokens = await Promise.all(tokenInfoCallers)
      const usdTokenCallers = makeTokenCallers(usdTokenAddresses)
      const usdToken = await Promise.all(usdTokenCallers)
      const [totalSupply] = await multicall(erc20, erc20Calls)

      // @ts-ignore
      const activeUserCountNumber = new BigNumber([(activeUserCount || [])[0]]).toNumber()
      const selectedTotalSupply = (totalSupply || [])[0]
      const poolUsdBalance = (currentPoolUsdBalances || []).map((x, index) => {
        let currentToken = tokens[index]
        if (currentToken) currentToken = (usdToken || [])[0]
        // @ts-ignore
        return new BigNumber([x]).div(new BigNumber(10).pow((currentToken || {}).decimals || 18))
      })
      const totalAssetValue = BigNumber.sum.apply(null, poolUsdBalance)
      // @ts-ignore
      const sharedPrice = totalAssetValue.div(new BigNumber([selectedTotalSupply]).div(new BigNumber(10).pow(18)))
      const tokenUsd = [...tokens, ...usdToken].map((t: any, index) => {
        // @ts-ignore
        const totalUsd = new BigNumber([currentPoolUsdBalances[index]])
        return totalUsd.div(t.totalBalance)
      })
      return {
        ...rebalanceConfig,
        currentPoolUsdBalances,
        sumCurrentPoolUsdBalance,
        totalSupply,
        activeUserCount,
        tokens,
        usdToken,
        usdTokenRatioPoint,
        tokenRatioPoints,

        activeUserCountNumber,
        totalAssetValue,
        sharedPrice,
        tokenUsd,
        enableAutoCompound,
        autoHerodotus,
      }
    }),
  )
  return dispatch(setRebalances({ data }))
}

export default rebalanceSlice.reducer
