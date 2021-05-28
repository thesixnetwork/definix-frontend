import React, { useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Doughnut } from 'react-chartjs-2'
import styled from 'styled-components'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import {
  useFarms,
  usePools,
  usePriceBnbBusd,
  usePriceEthBnb,
  usePriceEthBusd,
  usePriceFinixUsd,
  usePriceSixUsd,
} from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { BLOCKS_PER_YEAR } from 'config'
import { Button, Card, ChevronRightIcon, Heading, Text } from 'uikit-dev'
import { fetchFarmUserDataAsync } from 'state/actions'
import { useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import { provider } from 'web3-core'

import FarmCard from '../../Farms/components/FarmCard/FarmCard'
import { FarmWithStakedValue } from '../../Farms/components/FarmCard/types'
import FinixHarvestBalance from './FinixHarvestBalance'
import FinixHarvestPool from './FinixHarvestPool'

const Container = styled(Card)`
  flex-grow: 1;
`

const NetWorth = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
`

const Legend = styled.div`
  display: flex;
  justify-content: space-between;

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 8px;
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
      border-top-color: ${({ theme }) => theme.colors.white};
      position: absolute;
      top: 100%;
      left: calc(50% - 8px);
    }
  }

  .harvest {
    padding: 16px 24px;
    background: ${({ theme }) => theme.colors.primary};
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

const FarmsAndPools = styled.a`
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
    width: 50px;
    flex-shrink: 0;

    &:first-child {
      margin-right: 4px;
    }
  }
`

const Summary = styled.div`
  padding: 12px;
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
    max-height: 738px;
    overflow: auto;
  }
`

const CardMyFarmsAndPools = ({ className = '' }) => {
  // Harvest
  const [pendingTx, setPendingTx] = useState(false)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

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
  const activeFarms = farmsLP.filter((farms) => farms.pid !== 0 && farms.multiplier !== '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farms) => farms.userData && new BigNumber(farms.userData.stakedBalance).isGreaterThan(0),
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
      default:
        break
    }
    switch (pool.sousId) {
      case 0:
      case 2:
      case 3:
      case 4:
      case 5:
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

  // const data = [
  //   {
  //     name: 'FINIX-BNB LP',
  //     apr: '381%',
  //     lpStaked: '318.77',
  //     multiplier: '15x',
  //     finixEarned: '49.40',
  //     netWorth: '$31k',
  //     percent: 10,
  //     color: '#EFB80C',
  //   },
  //   {
  //     name: 'FINIX-BUSD LP',
  //     apr: '320%',
  //     lpStaked: '1,120.02',
  //     multiplier: '15x',
  //     finixEarned: '180.15',
  //     netWorth: '$24k',
  //     percent: 15,
  //     color: '#55BD92',
  //   },
  // ]

  const chart = {
    data: {
      // labels: data.map((d) => d.name),
      labels: stackedOnlyFarms.map((d) => d.lpSymbol),
      datasets: [
        {
          label: '# of Votes',
          data: stackedOnlyFarms.map((d) => d.userData.earnings),
          backgroundColor: '#55BD92',
          // data: data.map((d) => d.percent),
          // backgroundColor: data.map((d) => d.color),
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      layout: {
        padding: 24,
      },
      rotation: 2,
      cutoutPercentage: 90,
    },
  }

  return (
    <Container className={className}>
      <NetWorth>
        <div className="col-5 flex" style={{ position: 'relative' }}>
          <Doughnut data={chart.data} options={chart.options} height={150} width={150} />
        </div>
        <div className="col-7 pa-3 pl-0">
          <Text color="textSubtle">Net Worth</Text>
          <Heading fontSize="24px !important">$x,xxx</Heading>

          <div className="mt-2">
            {stackedOnlyFarms.map((d) => (
              <Legend key={`legend${d.lpSymbol}`}>
                <Text fontSize="12px" color="textSubtle">
                  {/* <span className="dot" style={{ background: d.color }} /> */}
                  <span className="dot" style={{ background: '#55BD92' }} />
                  {d.lpSymbol}
                </Text>
                {/* <Text bold>{d.netWorth}</Text> */}
                <Text bold>
                  {new BigNumber(d.userData.earnings).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                </Text>
              </Legend>
            ))}
          </div>
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
              <Heading fontSize="24px !important" textAlign="center">
                <FinixHarvestBalance />
              </Heading>
            </StatAll>
            <StatAll>
              <Text textAlign="center" color="textSubtle">
                From all pools
              </Text>
              <Heading fontSize="24px !important" textAlign="center">
                <FinixHarvestPool />
              </Heading>
            </StatAll>
          </div>
          {account ? (
            <Button
              id="harvest-all"
              size="sm"
              className="btn-secondary-disable mt-3"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
            >
              {pendingTx
                ? TranslateString(548, 'Collecting FINIX')
                : TranslateString(532, `Harvest all (${balancesWithValue.length})`)}
            </Button>
          ) : (
            <UnlockButton />
          )}
        </div>
      </HarvestAll>

      <List>
        <>
          {stackedOnlyPools.map((d) => {
            const imgs = d.tokenName.split(' ')[0].split('-')
            return (
              <FarmsAndPools href="#" key={d.tokenName}>
                <Coins>
                  <div className="flex">
                    <img src={`/images/coins/${imgs[0]}.png`} alt="" />
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
                <div className="icon">
                  <ChevronRightIcon color="textDisabled" width="28" />
                </div>
              </FarmsAndPools>
            )
          })}
        </>

        {farmsList(stackedOnlyFarms, false).map((d) => {
          const imgs = d.props.farm.lpSymbol.split(' ')[0].split('-')
          return (
            <FarmsAndPools href="#" key={d.props.farm.lpSymbol}>
              <Coins>
                <div className="flex">
                  <img src={`/images/coins/${imgs[0]}.png`} alt="" />
                  <img src={`/images/coins/${imgs[1]}.png`} alt="" />
                </div>
                <Text bold>{d.props.farm.lpSymbol}</Text>
              </Coins>
              <Summary>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    APR
                  </Text>
                  <Text bold color="success">
                    {new BigNumber(d.props.farm.apy.toNumber() * 100).toNumber().toFixed()}%
                  </Text>
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    LP Staked
                  </Text>
                  <Text bold>
                    {new BigNumber(d.props.farm.userData.stakedBalance)
                      .div(new BigNumber(10).pow(18))
                      .toNumber()
                      .toFixed(2)}
                  </Text>
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    Multiplier
                  </Text>
                  <Text bold color="warning">
                    {d.props.farm.multiplier}
                  </Text>
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    FINIX Earned
                  </Text>
                  <Text bold>
                    {new BigNumber(d.props.farm.userData.earnings).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                  </Text>
                </div>
              </Summary>
              <div className="icon">
                <ChevronRightIcon color="textDisabled" width="28" />
              </div>
            </FarmsAndPools>
          )
        })}
      </List>
    </Container>
  )
}

export default CardMyFarmsAndPools
