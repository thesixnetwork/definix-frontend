import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import herodotusABI from 'config/abi/herodotus.json'
import multicall from 'utils/multicall'
import { getAddress, getHerodotusAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { compact, uniq } from 'lodash'

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < (array.length || array.size); index++) {
    // eslint-disable-next-line
    await callback(array[index] || array.docs[index], index, array)
  }
}

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      try {
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

        const [tokenBalanceLP, quoteTokenBlanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
          await multicall(erc20, calls)

        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking in quote token value
        const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(new BigNumber(2))
          .times(lpTokenRatio)

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio)

        const [info, totalAllocPoint, finixPerBlock, BONUS_MULTIPLIER, bundleRewardLength] = await multicall(
          herodotusABI,
          [
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
            {
              address: getHerodotusAddress(),
              name: 'bundleRewardLength',
              params: [farmConfig.pid],
            },
          ],
        )

        const allocPoint = new BigNumber(info.allocPoint._hex)
        const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
        const numberBundleRewards = new BigNumber(bundleRewardLength).toNumber()
        let allBundleRewards = []

        if (numberBundleRewards > 0) {
          const allBundleRequests = []
          for (let i = 0; i < numberBundleRewards; i++) {
            allBundleRequests.push({
              address: getHerodotusAddress(),
              name: 'bundleRewards',
              params: [farmConfig.pid, i],
            })
          }
          allBundleRewards = await multicall(herodotusABI, allBundleRequests)
          const allTokenRewardToFetch = uniq(allBundleRewards.map((abr) => abr.rewardToken))
          const fetchedTokenInfo = {}
          await asyncForEach(allTokenRewardToFetch, async (tokenAddress) => {
            const singleTokenRequests = []
            singleTokenRequests.push({
              address: tokenAddress,
              name: 'symbol',
            })
            singleTokenRequests.push({
              address: tokenAddress,
              name: 'symbol',
            })
            singleTokenRequests.push({
              address: tokenAddress,
              name: 'totalSupply',
            })
            const [tokenSymbol, tokenName, tokenTotalSupply] = await multicall(erc20, singleTokenRequests)
            fetchedTokenInfo[tokenAddress] = {
              symbol: tokenSymbol[0],
              name: tokenName[0],
              totalSupply: tokenTotalSupply[0],
            }
          })
          allBundleRewards = allBundleRewards.map((abr) => {
            if (fetchedTokenInfo[abr.rewardToken]) {
              return { ...abr, rewardTokenInfo: fetchedTokenInfo[abr.rewardToken] }
            }
            return { ...abr }
          })
        }
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
          lpTokenRatio,
          bundleRewardLength: new BigNumber(bundleRewardLength).toJSON(),
          bundleRewards: allBundleRewards,
          tokenDecimals,
          quoteTokenDecimals,
          tokenBalanceLP,
          quoteTokenBlanceLP,
        }
      } catch {
        return undefined
      }
    }),
  )
  return compact(data)
}

export default fetchFarms
