/* eslint-disable no-param-reassign */
// import axios from 'axios'
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import rebalance from 'config/abi/rebalance.json'
import multicall from 'utils/multicall'
import _ from 'lodash'
import { BLOCKS_PER_YEAR } from 'config'
import herodotusABI from 'config/abi/herodotus.json'
import autoHerodotusABI from 'config/abi/autoHerodotus.json'
import { createSlice } from '@reduxjs/toolkit'
import { getAddress, getHerodotusAddress } from 'utils/addressHelpers'
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

const calculateRatio = (currentPriceUsd: BigNumber[], sumCurrentPoolUsdBalance: BigNumber) => {
  let sumRatio = 0
  const ratioCal = []
  currentPriceUsd.forEach((data, index) => {
    // @ts-ignore
    const totalPriceNotDevDecimap = new BigNumber([data])
    const totalPrice = totalPriceNotDevDecimap.div(new BigNumber(10).pow(6))
    // @ts-ignore
    const sumCurrentPoolUsd = new BigNumber([sumCurrentPoolUsdBalance])
    const sum = sumCurrentPoolUsd.div(new BigNumber(10).pow(6))
    let ratio = +totalPrice.div(sum).times(100).toNumber().toFixed(2)

    if (currentPriceUsd.length - 1 === index) {
      ratio = +(100 - sumRatio).toFixed(2)
    } else {
      sumRatio += ratio
    }
    ratioCal.push(ratio)
  })
  return ratioCal
}
export const fetchRebalances = () => async (dispatch) => {
  const data = await Promise.all(
    rebalancesConfig.map(async (rebalanceConfig) => {
      try {
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

        console.log('1111111111111')
      const [
        [currentPoolUsdBalances, sumCurrentPoolUsdBalance],
        activeUserCount,
        tokenLength,
        usdTokenAddresses,
        usdTokenRatioPoint,
        [enableAutoCompound],
        [autoHerodotus],
      ] = await multicall(rebalance, rebalanceCalls)

        console.log('222222222222')
      const ratioCal = calculateRatio(currentPoolUsdBalances, sumCurrentPoolUsdBalance)
      const tokenCallers = []
      for (let i = 0; i < tokenLength; i++) {
        tokenCallers.push(multicall(rebalance, [{ address, name: 'tokens', params: [i] }]))
      }
      const tokenRatioPointsCallers = []
      for (let i = 0; i < tokenLength; i++) {
        tokenRatioPointsCallers.push(multicall(rebalance, [{ address, name: 'tokenRatioPoints', params: [i] }]))
      }
        console.log('33333333333')
      const tokenAddresss = _.flattenDeep(await Promise.all(tokenCallers))
        console.log('44444444444')
      const tokenRatioPoints = _.flattenDeep(await Promise.all(tokenRatioPointsCallers))
        console.log('55555555555')
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
        console.log('666666666666666')
      const tokenInfoCallers = makeTokenCallers(tokenAddresss)
      const tokens = await Promise.all(tokenInfoCallers)
        console.log('777777777777777')
      const usdTokenCallers = makeTokenCallers(usdTokenAddresses)
      const usdToken = await Promise.all(usdTokenCallers)
        console.log('888888888888888')
      const [totalSupply] = await multicall(erc20, erc20Calls)
        console.log('99999999999999')

      // @ts-ignore
      const activeUserCountNumber = new BigNumber([(activeUserCount || [])[0]]).toNumber()
      const selectedTotalSupply = (totalSupply || [])[0]
      const poolUsdBalance = (currentPoolUsdBalances || []).map((x, index) => {
        let currentToken = [...tokens, ...usdToken][index]
        if (currentToken) currentToken = (usdToken || [])[0]
        // @ts-ignore
        return new BigNumber([x]).div(new BigNumber(10).pow((currentToken || {}).decimals || 18))
      })
      const totalAssetValue = BigNumber.sum.apply(null, poolUsdBalance)
      // @ts-ignore
      const sharedPrice = totalAssetValue.div(new BigNumber([selectedTotalSupply]).div(new BigNumber(10).pow(18)))
      // let last24Response
      // try {
      //   last24Response = await axios.get(`${process.env.REACT_APP_API_LAST_24}?address=${address}`)
      // } catch {
      //   last24Response = {}
      // }
      // const last24Data = _.get(last24Response, 'data.result', {})
      // const last24TotalSupply = new BigNumber(_.get(last24Data, 'total_supply')).div(new BigNumber(10).pow(18))

      // const last24Tokens = _.get(last24Data, 'tokens', {})
      // const sumOldTokenPrice = BigNumber.sum.apply(
      //   null,
      //   [...tokens, ...usdToken].map((token: any) => {
      //     const tokenAmount = new BigNumber(_.get(last24Tokens, `${token.address.toLowerCase()}.balance`, '0')).div(
      //       new BigNumber(10).pow(token.decimals),
      //     )
      //     const tokenPrice = new BigNumber(_.get(last24Tokens, `${token.address.toLowerCase()}.price`, 0))
      //     const totalTokenPrice = tokenAmount.times(tokenPrice)

      //     return totalTokenPrice
      //   }),
      // )
      // const oldSharedPrice = sumOldTokenPrice.div(last24TotalSupply)
      const sharedPricePercentDiff = sharedPrice.minus(1).times(100)

      // const twentyHperformance = sharedPrice.times(last24TotalSupply).minus(sumOldTokenPrice).toNumber()

      const autoHerodotusCalls = [
        {
          address: autoHerodotus,
          name: 'rebalancePID',
          params: [address],
        },
      ]
        console.log('1010101010')
      const [bigNumberPid] = await multicall(autoHerodotusABI, autoHerodotusCalls)
        console.log('11 11 11 11 11 11')
      const pid = new BigNumber(bigNumberPid)
      const herodotusAddress = getHerodotusAddress()
        console.log('12 12 12 12 12 12 ')
      const herodotusCalls = [
        {
          address: herodotusAddress,
          name: 'poolInfo',
          params: [pid.toNumber()],
        },
        {
          address: herodotusAddress,
          name: 'BONUS_MULTIPLIER',
        },
        {
          address: herodotusAddress,
          name: 'totalAllocPoint',
        },
        {
          address: herodotusAddress,
          name: 'finixPerBlock',
        },
      ]
      const [info, BONUS_MULTIPLIER, totalAllocPoint, finixPerBlock] = await multicall(herodotusABI, herodotusCalls)
      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
      const totalRewardPerBlock = new BigNumber(finixPerBlock).times(BONUS_MULTIPLIER).div(new BigNumber(10).pow(18))
      const finixRewardPerBlock = totalRewardPerBlock.times(poolWeight)
      const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
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
        // last24data: last24Data,
        activeUserCountNumber,
        totalAssetValue,
        sharedPrice,

        // sharpeRatio,
        // maxDrawdown,
        // tokenUsd,
        enableAutoCompound,
        finixRewardPerYear,
        autoHerodotus,
        sharedPricePercentDiff,
        // twentyHperformance,
        ratioCal,
      }
      } catch(error) {
        const gas = error
        // eslint-disable-next-line
        debugger
        return {}
      }
    }),
  )
  return dispatch(setRebalances({ data }))
}

export default rebalanceSlice.reducer
