import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import herodotusABI from 'config/abi/herodotus.json'
import multicall from 'utils/multicall'
import { getAddress, getHerodotusAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import numeral from 'numeral'

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = getAddress(farmConfig.lpAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: 'balanceOf',
          params: [getHerodotusAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: 'decimals',
        },
      ]

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls)

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
      // console.log(farmConfig)
      // console.log('tokenBalanceLP', numeral(new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(18)).toNumber()).format('0,0.0000'))
      // console.log('quoteTokenBlanceLP', numeral(new BigNumber(quoteTokenBlanceLP).div(new BigNumber(10).pow(18)).toNumber()).format('0,0.0000'))
      // console.log('lpTokenBalanceMC', numeral(new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(18)).toNumber()).format('0,0.0000'))
      // console.log('lpTotalSupply', numeral(new BigNumber(lpTotalSupply).div(new BigNumber(10).pow(18)).toNumber()).format('0,0.0000'))
      // console.log('tokenDecimals', tokenDecimals[0])
      // console.log('quoteTokenDecimals', quoteTokenDecimals[0])
      // console.log('lpTokenRatio', lpTokenRatio.toNumber())

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(18))
        .times(new BigNumber(2))
        .times(lpTokenRatio)

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio)

      const [info, totalAllocPoint, finixPerBlock, BONUS_MULTIPLIER] = await multicall(herodotusABI, [
        {
          address: getHerodotusAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getHerodotusAddress(),
          name: 'totalAllocPoint',
        },
        {
          address: getHerodotusAddress(),
          name: 'finixPerBlock',
        },
        {
          address: getHerodotusAddress(),
          name: 'BONUS_MULTIPLIER',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        finixPerBlock: new BigNumber(finixPerBlock).toJSON(),
        BONUS_MULTIPLIER: new BigNumber(BONUS_MULTIPLIER).toJSON(),
        lpTotalSupply,
      }
    }),
  )
  return data
}

export default fetchFarms
