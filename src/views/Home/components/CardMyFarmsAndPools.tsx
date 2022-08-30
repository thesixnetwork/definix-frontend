import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import numeral from 'numeral'
import { BLOCKS_PER_YEAR } from 'config'
import { getContract } from 'utils/web3'
import Apollo from 'config/abi/Apollo.json'
import PairAbi from 'config/abi/uni_v2_lp.json'
import erc20 from 'config/abi/erc20.json'
import { VeloPool } from 'config/constants'
import AddressTokens from 'config/constants/contracts'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import useFarmsWithBalance, { usePoolVeloWithBalance } from 'hooks/useFarmsWithBalance'
import { useAllHarvest, useVeloHarvest } from 'hooks/useHarvest'
import { getAddress } from 'utils/addressHelpers'
import useI18n from 'hooks/useI18n'
import useRefresh from 'hooks/useRefresh'
import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchFarmUserDataAsync } from 'state/actions'
import {
  useBalances,
  useRebalances,
  useRebalanceBalances,
  useFarms,
  useFarmsIsFetched,
  useRebalancesIsFetched,
  useWalletFetched,
  useWalletRebalanceFetched,
  usePools,
  usePoolsIsFetched,
  usePoolVeloIsFetched,
  usePriceBnbBusd,
  usePriceEthBnb,
  usePriceEthBusd,
  usePriceFinixUsd,
  usePriceSixUsd,
  useRebalanceRewards,
} from 'state/hooks'
import styled from 'styled-components'
import { Button, Card, ChevronRightIcon, Heading, IconButton, Skeleton, Text } from 'uikit-dev'
import Loading from 'uikit-dev/components/Loading'
import { getBalanceNumber } from 'utils/formatBalance'
import { provider } from 'web3-core'
import { PoolWithApy } from '../../PartnershipPool/components/PoolCard/types'
import FarmCard from '../../Farms/components/FarmCard/FarmCard'
import { fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../../state/wallet'
import { FarmWithStakedValue } from '../../Farms/components/FarmCard/types'
import FinixHarvestBalance from './FinixHarvestBalance'
import FinixHarvestPool from './FinixHarvestPool'

const Container = styled(Card)`
  overflow: auto;
`

const NetWorth = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;

  .sum {
    flex-grow: 1;
  }
`

const Legend = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;

  &:last-child {
    margin: 0;
  }
`

const HarvestAll = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .ready {
    padding: 12px 24px;
    position: relative;

    &:before {
      content: '';
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top-color: ${({ theme }) => theme.colors.card};
      position: absolute;
      top: 100%;
      left: calc(50% - 8px);
    }
  }

  .harvest {
    padding: 16px 24px;
    background: ${({ theme }) => theme.colors.backgroundBlueGradient};
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const StatAll = styled.div`
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.white};

  h2 {
    margin: 4px 0;
  }
`

const FarmsAndPools = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .icon {
    padding-right: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &:last-child {
    border: none;
  }
`

const Coins = styled.div`
  padding: 16px;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  img {
    width: 48px;
    flex-shrink: 0;
  }
`

const Rebalancing = styled.div`
  padding: 16px;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .asset {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    img {
      width: 14px;
      height: 14px;
      margin: 1px;
    }
  }
`

const Summary = styled.div`
  padding: 12px 0;
  width: 60%;
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
    padding: 4px;
  }
`

const List = styled.div`
  overflow: auto;
  max-height: 530px;

  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 100%;
    overflow: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: 100%;
    overflow: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    overflow: auto;
  }
`
const Dot = styled.span`
  display: block;
  width: 10px;
  height: 10px;
  border-radius: ${({ theme }) => theme.radii.circle};
`

const CardMyFarmsAndPools = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true)
  // Harvest
  const [pendingTx, setPendingTx] = useState(false)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const poolVeloWithBalance = usePoolVeloWithBalance()
  const rebalances = useRebalances()
  const balances = useBalances(account) || {}
  const rebalanceBalances = useRebalanceBalances(account) || {}
  const rebalanceRewards = useRebalanceRewards(account) || {}
  const stakedRebalances = rebalances.filter(
    (r) =>
      (
        rebalanceBalances[typeof r.address === 'string' ? r.address : getAddress(r.address)] || new BigNumber(0)
      ).toNumber() > 0,
  )

  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const balancesVeloWithValue = poolVeloWithBalance.filter((velo) => velo.balance.toNumber() > 0 && velo.sousId === 101)
  const { onRewardVelo } = useVeloHarvest(2)

  const isPoolFetched = usePoolsIsFetched()
  const isPoolVeloFetched = usePoolVeloIsFetched()
  const isFarmFetched = useFarmsIsFetched()
  const isRebalanceFetched = useRebalancesIsFetched()
  const isRebalanceBalanceFetched = useWalletRebalanceFetched()
  const isBalanceFetched = useWalletFetched()
  useEffect(() => {
    if (
      isFarmFetched &&
      isPoolFetched &&
      isRebalanceFetched &&
      isRebalanceBalanceFetched &&
      isBalanceFetched &&
      isPoolVeloFetched
    ) {
      setIsLoading(false)
    }
  }, [isPoolFetched, isFarmFetched, isRebalanceFetched, isPoolVeloFetched, isRebalanceBalanceFetched, isBalanceFetched])

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
      if (balancesVeloWithValue.length > 0) {
        await onRewardVelo()
      }
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward, onRewardVelo, balancesVeloWithValue])

  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    if (account) {
      const addressObject = {}
      rebalances.forEach((rebalance) => {
        const assets = rebalance.ratio
        assets.forEach((a) => {
          addressObject[getAddress(a.address)] = true
        })
      })
      dispatch(
        fetchBalances(account, [
          ...Object.keys(addressObject),
          ...rebalances.map((rebalance) => getAddress(rebalance.address)),
        ]),
      )
      dispatch(fetchRebalanceBalances(account, rebalances))
      dispatch(fetchRebalanceRewards(account, rebalances))
    }
  }, [dispatch, account, rebalances])

  useEffect(() => {
    return () => {
      setListView(false)
    }
  }, [])

  // Farms
  const farmsLP = useFarms()
  const bnbPrice = usePriceBnbBusd()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPriceUsd = usePriceEthBusd()
  const [listView, setListView] = useState(false)
  const activeFarms = farmsLP.filter((farms) => farms.pid !== 0 && farms.pid !== 25 && farms.multiplier !== '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farms) =>
      farms.userData &&
      farms.pid !== 0 &&
      farms.pid !== 25 &&
      new BigNumber(farms.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const finixPriceVsBNB = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
          .times(farm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

        // finixPriceInQuote * finixRewardPerYear / lpTotalInQuoteToken
        let apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)

        if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
          apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          apy = finixPrice.div(ethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          apy = finixPrice.div(bnbPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
          apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const finixApy =
            farm && finixPriceVsBNB.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = finixApy && dualApy && finixApy.plus(dualApy)
        }

        return { ...farm, apy }
      })

      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          ethPrice={ethPriceUsd}
          sixPrice={sixPrice}
          finixPrice={finixPrice}
          ethereum={ethereum}
          account={account}
          isHorizontal={listView}
        />
      ))
    },
    [sixPrice, bnbPrice, ethPriceUsd, finixPrice, ethereum, account, listView],
  )

  // Pools
  const pools = usePools(account)
  const farms = useFarms()
  const sixPriceUSD = usePriceSixUsd()
  const bnbPriceUSD = usePriceBnbBusd()
  const ethPriceBnb = usePriceEthBnb()
  const block = useBlock()
  const priceToBnb = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceBN = new BigNumber(tokenPrice)
    if (tokenName === 'BNB') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.BUSD) {
      return tokenPriceBN.div(bnbPriceUSD)
    }
    return tokenPriceBN
  }

  const poolsWithApy = pools.map((pool) => {
    const isBnbPool = pool.poolCategory === PoolCategory.BINANCE
    let rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    let stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)
    switch (pool.sousId) {
      case 0:
        stakingTokenFarm = farms.find((s) => s.pid === 0)
        break
      case 2:
        stakingTokenFarm = farms.find((s) => s.pid === 1)
        break
      case 3:
        stakingTokenFarm = farms.find((s) => s.pid === 2)
        break
      case 4:
        stakingTokenFarm = farms.find((s) => s.pid === 3)
        break
      case 5:
        stakingTokenFarm = farms.find((s) => s.pid === 4)
        break
      case 6:
        stakingTokenFarm = farms.find((s) => s.pid === 5)
        break
      case 25:
        stakingTokenFarm = farms.find((s) => s.pid === 25)
        break
      default:
        break
    }
    switch (pool.sousId) {
      case 0:
      case 2:
      case 3:
      case 4:
      case 5:
      case 25:
      case 6:
        rewardTokenFarm = farms.find((f) => f.tokenSymbol === 'SIX')
        break
      default:
        break
    }

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api
    const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'ETH' ? ethPriceBnb : 1

    // /!\ Assume that the farm quote price is BNB
    const stakingTokenPriceInBNB = isBnbPool
      ? new BigNumber(1)
      : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote).times(tempMultiplier)
    const rewardTokenPriceInBNB = priceToBnb(
      pool.tokenName,
      rewardTokenFarm?.tokenPriceVsQuote,
      rewardTokenFarm?.quoteTokenSymbol,
    )

    const totalRewardPricePerYear = rewardTokenPriceInBNB.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInBNB.times(getBalanceNumber(pool.totalStaked))
    let apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    const totalLP = new BigNumber(stakingTokenFarm.lpTotalSupply).div(new BigNumber(10).pow(18))
    let highestToken
    if (stakingTokenFarm.tokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.tokenAmount
    } else if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.quoteTokenAmount
    } else if (stakingTokenFarm.tokenAmount > stakingTokenFarm.quoteTokenAmount) {
      highestToken = stakingTokenFarm.tokenAmount
    } else {
      highestToken = stakingTokenFarm.quoteTokenAmount
    }
    const tokenPerLp = new BigNumber(totalLP).div(new BigNumber(highestToken))
    const priceUsdTemp = tokenPerLp.times(2).times(new BigNumber(sixPriceUSD))
    const estimatePrice = priceUsdTemp.times(new BigNumber(pool.totalStaked).div(new BigNumber(10).pow(18)))

    switch (pool.sousId) {
      case 0: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear.div(currentTotalStaked).times(100)
        break
      }
      case 25: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear
          .times(finixPrice)
          .div(new BigNumber(currentTotalStaked).times(new BigNumber(sixPriceUSD)))
          .times(100)
        break
      }
      case 2:
      case 3:
      case 4:
      case 5:
      case 6: {
        const { startBlock, endBlock, rewardPerBlock, totalStaked } = pool
        const startBlockNumber = typeof startBlock === 'number' ? startBlock : parseInt(startBlock, 10)
        const endBlockNumber = typeof endBlock === 'number' ? endBlock : parseInt(endBlock, 10)
        const currentBlockNumber = typeof block === 'number' ? block : parseInt(block, 10)
        const totalDiffBlock = endBlockNumber - startBlockNumber
        const remainBlock = endBlockNumber - currentBlockNumber
        const remainTimeSec = remainBlock * 3
        const totalDiffBlockCeil =
          totalDiffBlock % 1200 > 1100 ? totalDiffBlock + (1200 - (totalDiffBlock % 1200)) : totalDiffBlock
        const currentDiffBlock = currentBlockNumber - startBlockNumber
        const totalReward = totalDiffBlockCeil * (rewardPerBlock / 10 ** 18)
        const alreadyRewarded = currentDiffBlock * (rewardPerBlock / 10 ** 18)
        const remainReward = totalReward - alreadyRewarded

        const B33 = remainReward
        const B34 = sixPriceUSD

        const E33 = stakingTokenFarm.lpTotalSupply
        const E34 = totalStaked
        const E35 = highestToken

        const F34 = new BigNumber(E34).div(new BigNumber(E33))
        const F35 = new BigNumber(E35).times(F34)

        const B35 = F35.times(new BigNumber(B34)).times(2)
        const B38 = 365 * 24 * 60 * 60

        apy = new BigNumber(B33)
          .times(new BigNumber(B34))
          .div(B35)
          .times(new BigNumber(B38))
          .div(new BigNumber(remainTimeSec))
          .times(100)

        break
      }
      default:
        break
    }
    return {
      ...pool,
      isFinished: pool.sousId === 0 ? false : pool.isFinished || block > pool.endBlock,
      apy,
      estimatePrice,
    }
  })

  const stackedOnlyPools = poolsWithApy.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )

  // Net Worth
  const getNetWorth = (d) => {
    if (typeof d.ratio === 'object') {
      const thisBalance = d.enableAutoCompound ? rebalanceBalances : balances
      const currentBalance = _.get(thisBalance, getAddress(d.address), new BigNumber(0))
      return currentBalance.times(d.sharedPrice || new BigNumber(0))
    }
    if (typeof d.pid === 'number') {
      // farm
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const ratio = new BigNumber(stakedBalance).div(new BigNumber(d.lpTotalSupply))
      const stakedTotalInQuoteToken = new BigNumber(d.quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(d.quoteTokenDecimals))
        .times(ratio)
        .times(new BigNumber(2))
      // const displayBalance = rawStakedBalance.toLocaleString()
      let totalValue
      totalValue = stakedTotalInQuoteToken
      if (!d.lpTotalInQuoteToken) {
        totalValue = new BigNumber(0)
      }
      if (d.quoteTokenSymbol === QuoteToken.BNB) {
        totalValue = bnbPrice.times(stakedTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.FINIX) {
        totalValue = finixPrice.times(stakedTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.ETH) {
        totalValue = ethPriceUsd.times(stakedTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.SIX) {
        totalValue = sixPrice.times(stakedTotalInQuoteToken)
      }

      const earningRaw = _.get(d, 'userData.earnings', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = finixPrice.times(earning)
      return new BigNumber(totalValue).plus(totalEarning)
    }
    if (typeof d.sousId === 'number') {
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const stakedTotal = new BigNumber(stakedBalance).div(new BigNumber(10).pow(18))
      let totalValue
      totalValue = stakedTotal
      if (d.stakingTokenName === QuoteToken.BNB) {
        totalValue = bnbPrice.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.FINIX) {
        totalValue = finixPrice.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.ETH) {
        totalValue = ethPriceUsd.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.SIX) {
        totalValue = sixPrice.times(stakedTotal)
      }
      const earningRaw = _.get(d, 'userData.pendingReward', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = finixPrice.times(earning)
      return new BigNumber(totalValue).plus(totalEarning)
    }
    return new BigNumber(0)
  }

  // VELO
  const [poolVelo2, setPoolVelo2] = useState<PoolWithApy>({
    apy: new BigNumber(0),
    rewardPerBlock: 10,
    estimatePrice: new BigNumber(0),
    totalStaked: new BigNumber(0),
    startBlock: 12664423,
    endBlock: 14392426,
    userData: {
      allowance: new BigNumber(0),
      stakingTokenBalance: new BigNumber(0),
      stakedBalance: new BigNumber(0),
      pendingReward: new BigNumber(0),
    },
    sousId: 0,
    image: '',
    tokenName: 'VELO',
    stakingTokenName: QuoteToken.VELO,
    stakingLimit: 0,
    stakingTokenAddress: VeloPool[2].stakingTokenAddress,
    contractAddress: VeloPool[2].contractAddress,
    poolCategory: PoolCategory.PARTHNER,
    projectLink: '',
    tokenPerBlock: '10',
    sortOrder: 1,
    harvest: true,
    isFinished: false,
    tokenDecimals: VeloPool[2].tokenDecimals,
    pairPrice: new BigNumber(0),
  })

  const fetchVelo = useCallback(async () => {
    const pairContract = getContract(PairAbi, getAddress(AddressTokens.velo2FinixLP))
    const veloAddress = getAddress(AddressTokens.velo2)
    const apolloAddress = getAddress(poolVelo2.contractAddress)
    const finixAddress = getAddress(AddressTokens.finix)

    const contractApollo = getContract(Apollo.abi, apolloAddress)
    const contractFinix = getContract(erc20, finixAddress)
    const contractVelo = getContract(erc20, veloAddress)
    const [veloBalance, totalStake, rewardPerBlock, reserveFinixVelo] = await Promise.all([
      contractVelo.methods.balanceOf(apolloAddress).call(),
      contractFinix.methods.balanceOf(apolloAddress).call(),
      contractApollo.methods.rewardPerBlock().call(),
      pairContract.methods.getReserves().call(),
    ])
    if (account) {
      const [userInfo, allowance, pendingReward, balanceFinixUser] = await Promise.all([
        contractApollo.methods.userInfo(account).call(),
        contractFinix.methods.allowance(account, apolloAddress).call(),
        contractApollo.methods.pendingReward(account).call(),
        contractFinix.methods.balanceOf(account).call(),
      ])

      poolVelo2.userData.allowance = allowance
      poolVelo2.userData.stakedBalance = userInfo.amount
      poolVelo2.userData.pendingReward = new BigNumber(pendingReward).div(1e13)
      poolVelo2.userData.stakingTokenBalance = new BigNumber(balanceFinixUser)
    }

    poolVelo2.totalStaked = new BigNumber(totalStake)

    const VELO_BLOCK_PER_YEAR = new BigNumber(rewardPerBlock).times(BLOCKS_PER_YEAR).div(1e18).toNumber()
    // eslint-disable-next-line
    const veloBalanceReward = new BigNumber(veloBalance).div(1e18).toNumber()

    const finixPervelo = new BigNumber(new BigNumber(reserveFinixVelo._reserve0).div(1e18)).dividedBy(
      new BigNumber(reserveFinixVelo._reserve1).div(1e18),
    )
    poolVelo2.pairPrice = new BigNumber(finixPervelo)

    poolVelo2.apy = new BigNumber(new BigNumber(finixPervelo).times(VELO_BLOCK_PER_YEAR))
      .div(new BigNumber(totalStake).div(1e18))
      .times(100)

    setPoolVelo2(poolVelo2)
  }, [account, poolVelo2])

  useEffect(() => {
    fetchVelo()
  }, [fetchVelo, account])

  const veloPool = []
  veloPool.push(poolVelo2)
  const stackedPoolVelo = veloPool.filter((velo) => velo.userData && Number(velo.userData.stakedBalance))

  const dataFarms = stackedOnlyFarms.map((f) => ({
    lpSymbol: f.lpSymbol,
    value: Number(getNetWorth(f)),
  }))

  const dataPools = stackedOnlyPools.map((p) => ({
    lpSymbol: p.tokenName,
    value: Number(getNetWorth(p)),
  }))

  const dataRebalances = stakedRebalances.map((r) => ({
    lpSymbol: r.title,
    value: Number(getNetWorth(r)),
  }))

  const dataVeloPool = stackedPoolVelo.map((v) => ({
    lpSymbol: v.tokenName,
    value: Number(getNetWorth(v)),
  }))

  const isGrouping =
    stackedOnlyPools.length > 0 &&
    stakedRebalances.length > 0 &&
    farmsList(stackedOnlyFarms, false).length > 0 &&
    stackedPoolVelo.length > 0
  let arrayData = [...dataFarms, ...dataPools, ...dataRebalances, ...dataVeloPool]
  if (isGrouping) {
    const groupRebalance = {
      lpSymbol: 'Rebalancing',
      value: Number(
        BigNumber.sum.apply(
          null,
          stakedRebalances.map((f) => getNetWorth(f)),
        ),
      ),
    }
    const groupFarm = {
      lpSymbol: 'Farms',
      value: Number(
        BigNumber.sum.apply(
          null,
          stackedOnlyFarms.map((f) => getNetWorth(f)),
        ),
      ),
    }
    const groupPool = {
      lpSymbol: 'Pools',
      value: Number(
        BigNumber.sum.apply(
          null,
          stackedOnlyPools.map((f) => getNetWorth(f)),
        ),
      ),
    }
    const groupPoolVelo = {
      lpSymbol: 'PoolVelo',
      value: Number(
        BigNumber.sum.apply(
          null,
          stackedPoolVelo.map((v) => getNetWorth(v)),
        ),
      ),
    }
    arrayData = []

    if (groupRebalance.value > 0 || groupFarm.value > 0 || groupPool.value > 0 || groupPoolVelo.value > 0) {
      if (groupRebalance.value > 0) arrayData.push(groupRebalance)
      if (groupFarm.value > 0) arrayData.push(groupFarm)
      if (groupPool.value > 0) arrayData.push(groupPool)
      if (groupPoolVelo.value > 0) arrayData.push(groupPoolVelo)
    }
  }

  const sorted = arrayData.sort((a, b) => b.value - a.value)
  const chartValue = sorted.map((i) => Number(i.value))
  const topThree = sorted.splice(0, 3)

  // OTHER
  const result = sorted.map((i) => Number(i))
  const other = result.reduce((a, b) => a + b, 0)

  // CHART
  const chartColors = []
  const defaultColor = ['#0973B9', '#E2B23A', '#24B181']
  defaultColor.splice(0, topThree.length).forEach((c) => {
    chartColors.push(c)
  })
  const otherColor = '#8C90A5'
  if (other > 0 && !isGrouping) chartColors.push(otherColor)
  const chart = {
    data: {
      labels: stackedOnlyFarms.map((d) => d.lpSymbol),
      datasets: [
        {
          data: chartValue,
          backgroundColor: chartColors,
          hoverBackgroundColor: chartColors,
          borderWidth: 0,
        },
      ],
      hoverOffset: 4,
      borderWidth: 1,
    },
    options: {
      legend: {
        display: false,
        position: 'right',
      },
      tooltips: {
        enabled: false,
      },
      layout: {
        padding: 24,
      },
      rotation: 2,
      cutoutPercentage: 94,
      responsive: true,
    },
  }

  return (
    <Container className={className}>
      <NetWorth>
        <div className="col-12 flex" style={{ position: 'relative' }}>
          {isLoading ? <Loading /> : <Doughnut data={chart.data} options={chart.options} height={150} width={150} />}
        </div>
        <div className="sum col-7 pa-3 pl-0">
          <Text color="textSubtle">Net Worth</Text>
          {isLoading ? (
            <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
          ) : (
            <Heading fontSize="24px !important">
              {(() => {
                const allNetWorth = [
                  ...stackedOnlyFarms,
                  ...stackedOnlyPools,
                  ...stakedRebalances,
                  ...stackedPoolVelo,
                ].map((f) => {
                  return getNetWorth(f)
                })
                // eslint-disable-next-line
                const totalNetWorth =
                  _.compact(allNetWorth).length > 0
                    ? _.compact(allNetWorth).reduce((fv, sv) => {
                        return fv.plus(sv)
                      })
                    : new BigNumber(0)
                return totalNetWorth && Number(totalNetWorth) !== 0
                  ? `$${Number(totalNetWorth).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : '-'
              })()}
            </Heading>
          )}
          {isLoading ? (
            <>
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
              <Skeleton animation="pulse" variant="rect" height="20px" width="70%" className="mt-2" />
            </>
          ) : (
            <>
              <div className="mt-2 flex">
                <div
                  className="col-2 flex flex-column justify-space-between flex-shrink pr-2"
                  style={{ paddingTop: '6px', paddingBottom: '6px' }}
                >
                  {chartColors.map((color) => (
                    <Dot
                      style={{
                        background: color === '#8C90A5' && arrayData.length === 3 ? 'transparent' : color,
                      }}
                    />
                  ))}
                </div>
                <div className="col-8 flex-grow">
                  {topThree.map((d) => (
                    <Legend key={`legend${d.lpSymbol}`}>
                      <Text fontSize="12px" color="textSubtle">
                        {(d.lpSymbol || '').replace(/ LP$/, '')}
                      </Text>
                      <Text bold style={{ paddingLeft: '80px' }}>
                        {d.value ? `$${Number(d.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                      </Text>
                    </Legend>
                  ))}

                  {other > 0 && (
                    <Legend>
                      <Text fontSize="12px" color="textSubtle">
                        OTHER
                      </Text>
                      <Text bold style={{ paddingLeft: '80px' }}>
                        {other ? `$${Number(other).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                      </Text>
                    </Legend>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </NetWorth>

      <HarvestAll>
        <Text bold textAlign="center" className="ready">
          FINIX ready to harvest
        </Text>
        <div className="harvest">
          <div className="flex justify-center">
            <StatAll>
              <Text textAlign="center" color="textSubtle">
                From all farms
              </Text>
              {isLoading ? (
                <>
                  <Skeleton animation="pulse" variant="rect" height="26px" className="my-1" />
                  <Skeleton animation="pulse" variant="rect" height="21px" />
                </>
              ) : (
                <>
                  <Heading fontSize="24px !important" textAlign="center" color="textInvert">
                    <FinixHarvestBalance />
                  </Heading>
                </>
              )}
            </StatAll>
            <StatAll>
              <Text textAlign="center" color="textSubtle">
                From all pools
              </Text>
              {isLoading ? (
                <>
                  <Skeleton animation="pulse" variant="rect" height="26px" className="my-1" />
                  <Skeleton animation="pulse" variant="rect" height="21px" />
                </>
              ) : (
                <>
                  <Heading fontSize="24px !important" textAlign="center" color="textInvert">
                    <FinixHarvestPool />
                  </Heading>
                </>
              )}
            </StatAll>
          </div>
          {account ? (
            <Button
              id="harvest-all"
              size="sm"
              variant="tertiary"
              className="mt-3"
              style={{ background: 'white' }}
              disabled={(balancesWithValue.length <= 0 && balancesVeloWithValue.length <= 0) || pendingTx}
              onClick={harvestAllFarms}
            >
              {pendingTx
                ? TranslateString(548, 'Collecting FINIX')
                : TranslateString(532, `Harvest all (${balancesWithValue.length + balancesVeloWithValue.length})`)}
            </Button>
          ) : (
            <UnlockButton />
          )}
        </div>
      </HarvestAll>

      <List>
        <>
          {stakedRebalances.map((r) => {
            const thisBalance = r.enableAutoCompound ? rebalanceBalances : balances
            const currentBalance = _.get(thisBalance, getAddress(r.address), new BigNumber(0))
            const currentBalanceNumber = currentBalance.toNumber()
            return (
              <FarmsAndPools>
                <Rebalancing>
                  <div>
                    <img src={r.icon[0]} alt="" />
                    <div className="asset">
                      {r.ratio.map((t) => {
                        return <img src={`/images/coins/${t.symbol}.png`} alt="" />
                      })}
                    </div>
                  </div>
                  <Text bold textTransform="uppercase" style={{ fontSize: '10px' }}>
                    {r.title}
                  </Text>
                </Rebalancing>
                <Summary className="flex">
                  <div className="col-4">
                    <Text fontSize="12px" color="textSubtle">
                      APR
                    </Text>
                    <Text bold color="success">
                      {numeral(
                        finixPrice
                          .times(_.get(r, 'finixRewardPerYearFromApollo', new BigNumber(0)))
                          .div(_.get(r, 'totalAssetValue', new BigNumber(0)))
                          .times(100)
                          .toFixed(2),
                      ).format('0,0.[00]')}
                      %
                    </Text>
                  </div>
                  <div className="col-8">
                    <Text fontSize="12px" color="textSubtle">
                      Current Investment
                    </Text>
                    <div className="flex align-baseline flex-wrap">
                      <Text bold>{`$${numeral(
                        currentBalanceNumber * (r.sharedPrice || new BigNumber(0)).toNumber(),
                      ).format('0,0.[00]')}`}</Text>
                      <Text className="ml-1" fontSize="11px">
                        {`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
                      </Text>
                    </div>
                  </div>
                  <div className="col-7">
                    <div className="flex align-baseline">
                      <Text fontSize="12px" color="textSubtle">
                        Share price
                      </Text>
                      {/* <Text className="ml-1" fontSize="11px" color="textSubtle">
                        (Since inception)
                      </Text> */}
                    </div>
                    <div className="flex align-baseline">
                      <Text bold>{`$${numeral((r.sharedPrice || new BigNumber(0)).toNumber()).format('0,0.00')}`}</Text>
                      <Text
                        className="ml-1"
                        fontSize="11px"
                        bold
                        color={(() => {
                          if (r.sharedPricePercentDiff < 0) return 'failure'
                          if (r.sharedPricePercentDiff > 0) return 'success'
                          return ''
                        })()}
                      >
                        {`${
                          r.sharedPricePercentDiff >= 0
                            ? `+${numeral(r.sharedPricePercentDiff).format('0,0.[00]')}`
                            : `${numeral(r.sharedPricePercentDiff).format('0,0.[00]')}`
                        }%`}
                      </Text>
                    </div>
                  </div>
                  <div className="col-5">
                    <Text fontSize="12px" color="textSubtle">
                      FINIX Earned
                    </Text>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="21px" />
                    ) : (
                      <Text bold>
                        {`${numeral(rebalanceRewards[getAddress(r.address)] || new BigNumber(0)).format('0,0.[000]')}`}
                      </Text>
                    )}
                  </div>
                </Summary>
                <IconButton size="sm" as={Link} to="/rebalancing" className="flex flex-shrink">
                  <ChevronRightIcon color="textDisabled" width="28" />
                </IconButton>
              </FarmsAndPools>
            )
          })}

          {stackedOnlyPools.map((d) => {
            const imgs = d.tokenName.split(' ')[0].split('-')
            return (
              <FarmsAndPools key={d.tokenName}>
                <Coins>
                  <div className="flex">
                    <img src={`/images/coins/${imgs[0].toLowerCase()}.png`} alt="" />
                  </div>
                  <Text bold>{d.tokenName}</Text>
                </Coins>
                <Summary>
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      APR
                    </Text>
                    <Text bold color="success">
                      {new BigNumber(d.apy).toNumber().toFixed(2)}%
                    </Text>
                  </div>
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      LP Staked
                    </Text>
                    <Text bold>
                      {new BigNumber(d.userData.stakedBalance).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                    </Text>
                  </div>
                  <div />
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      FINIX Earned
                    </Text>
                    <Text bold>
                      {new BigNumber(d.userData.pendingReward).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                    </Text>
                  </div>
                </Summary>
                <IconButton size="sm" as={Link} to="/pool" className="flex flex-shrink">
                  <ChevronRightIcon color="textDisabled" width="28" />
                </IconButton>
              </FarmsAndPools>
            )
          })}

          {stackedPoolVelo.map((v) => {
            const imgs = v.tokenName.split(' ')[0].split('-')
            return (
              <FarmsAndPools key={v.tokenName}>
                <Coins>
                  {isLoading ? (
                    <>
                      <div className="flex">
                        <Skeleton animation="pulse" variant="circle" height="48px" width="48px" className="mx-1" />
                      </div>
                      <Skeleton animation="pulse" variant="rect" height="21px" width="80%" />
                    </>
                  ) : (
                    <>
                      <div className="flex">
                        <img src={`/images/coins/${imgs[0].toLowerCase()}.png`} alt="" />
                      </div>
                      <Text bold>{v.tokenName}</Text>
                    </>
                  )}
                </Coins>
                <Summary>
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      APR
                    </Text>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="21px" width="50%" />
                    ) : (
                      <Text bold color="success">
                        {new BigNumber(v.apy).toNumber().toFixed(2)}%
                      </Text>
                    )}
                  </div>
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      LP Staked
                    </Text>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="21px" width="50%" />
                    ) : (
                      <Text bold>
                        {new BigNumber(v.userData.stakedBalance).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                      </Text>
                    )}
                  </div>
                  <div />
                  <div>
                    <Text fontSize="12px" color="textSubtle">
                      VELO Earned
                    </Text>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="21px" width="50%" />
                    ) : (
                      <Text bold>
                        {new BigNumber(v.userData.pendingReward).div(new BigNumber(10).pow(5)).toNumber().toFixed(2)}
                      </Text>
                    )}
                  </div>
                </Summary>
                <IconButton size="sm" as={Link} to="/partnership-pool" className="flex flex-shrink">
                  <ChevronRightIcon color="textDisabled" width="28" />
                </IconButton>
              </FarmsAndPools>
            )
          })}
        </>

        {farmsList(stackedOnlyFarms, false).map((d) => {
          const imgs = d.props.farm.lpSymbol.split(' ')[0].split('-')
          return (
            <FarmsAndPools key={d.props.farm.lpSymbol}>
              <Coins>
                {isLoading ? (
                  <>
                    <div className="flex">
                      <Skeleton animation="pulse" variant="circle" height="48px" width="48px" className="mx-1" />
                      <Skeleton animation="pulse" variant="circle" height="48px" width="48px" className="mx-1" />
                    </div>
                    <Skeleton animation="pulse" variant="rect" height="21px" width="80%" />
                  </>
                ) : (
                  <>
                    <div className="flex">
                      {imgs[0] && <img src={`/images/coins/${imgs[0].toLowerCase()}.png`} alt="" />}
                      {imgs[1] && <img src={`/images/coins/${imgs[1].toLowerCase()}.png`} alt="" />}
                    </div>
                    <Text bold>{(d.props.farm.lpSymbol || '').replace(/ LP$/, '')}</Text>
                  </>
                )}
              </Coins>
              <Summary>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    APR
                  </Text>
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="21px" width="50%" />
                  ) : (
                    <Text bold color="success">
                      {new BigNumber(d.props.farm.apy.toNumber() * 100).toNumber().toFixed()}%
                    </Text>
                  )}
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    LP Staked
                  </Text>
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="21px" />
                  ) : (
                    <Text bold>
                      {new BigNumber(d.props.farm.userData.stakedBalance)
                        .div(new BigNumber(10).pow(18))
                        .toNumber()
                        .toFixed(2)}
                    </Text>
                  )}
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    Multiplier
                  </Text>
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="21px" width="50%" />
                  ) : (
                    <Text bold color="warning">
                      {d.props.farm.multiplier}
                    </Text>
                  )}
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    FINIX Earned
                  </Text>
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="21px" />
                  ) : (
                    <Text bold>
                      {new BigNumber(d.props.farm.userData.earnings)
                        .div(new BigNumber(10).pow(18))
                        .toNumber()
                        .toFixed(2)}
                    </Text>
                  )}
                </div>
              </Summary>
              <IconButton size="sm" as={Link} to="/farm" className="flex flex-shrink">
                <ChevronRightIcon color="textDisabled" width="28" />
              </IconButton>
            </FarmsAndPools>
          )
        })}
      </List>
    </Container>
  )
}

export default CardMyFarmsAndPools
