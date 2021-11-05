import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import styled from 'styled-components'
import { Link, Button } from 'uikit-dev'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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
  usePriceFinixUsd,
  usePriceKethKlay,
  usePriceKethKusdt,
  usePriceKlayKusdt,
  usePriceSixUsd,
} from 'state/hooks'
import { provider } from 'web3-core'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { useAllHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import { useHarvest, useAprCardFarmHome, useAllLock, usePrivateData, useRank } from 'hooks/useLongTermStake'
import { State } from 'state/types'
import { fetchCountTransactions } from 'state/longTermStake'
import { Modal } from '../Modal'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'
import { Text } from '../../components/Text'

interface Props {
  //   login: Login
  onDismiss?: () => void
}

// const HelpLink = styled(Link)`
//   display: flex;
//   align-self: center;
//   align-items: center;
//   margin-top: 24px;
// `

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const SuperStakeModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [selectedToken, setSelectedToken] = useState({})
  const [selectedTokenCount, setSelectedTokenCount] = useState(0)
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  // Farms
  const finixPrice = usePriceFinixUsd()

  // Pools
  const pools = usePools(account)
  const farms = useFarms()
  const sixPriceUSD = usePriceSixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()

  // LongTerm
  const { lockAmount, finixEarn, balancefinix, balancevfinix } = usePrivateData()
  const { handleHarvest } = useHarvest()

  // Harvest
  const [pendingTx, setPendingTx] = useState(false)

  const priceToKlay = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceKLAYTN = new BigNumber(tokenPrice)
    if (tokenName === 'KLAY') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.KUSDT) {
      return tokenPriceKLAYTN.div(klayPriceUSD)
    }
    return tokenPriceKLAYTN
  }

  const poolsWithApy = pools.map((pool) => {
    const isKlayPool = pool.poolCategory === PoolCategory.KLAYTN
    const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    let stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)
    switch (pool.sousId) {
      case 0:
        stakingTokenFarm = farms.find((s) => s.pid === 0)
        break
      case 1:
        stakingTokenFarm = farms.find((s) => s.pid === 1)
        break
      case 2:
        stakingTokenFarm = farms.find((s) => s.pid === 2)
        break
      case 3:
        stakingTokenFarm = farms.find((s) => s.pid === 3)
        break
      case 4:
        stakingTokenFarm = farms.find((s) => s.pid === 4)
        break
      case 5:
        stakingTokenFarm = farms.find((s) => s.pid === 5)
        break
      case 6:
        stakingTokenFarm = farms.find((s) => s.pid === 6)
        break
      default:
        break
    }

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api
    const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'KETH' ? ethPriceKlay : 1

    // /!\ Assume that the farm quote price is KLAY
    const stakingTokenPriceInKLAY = isKlayPool
      ? new BigNumber(1)
      : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote).times(tempMultiplier)
    const rewardTokenPriceInKLAY = priceToKlay(
      pool.tokenName,
      rewardTokenFarm?.tokenPriceVsQuote,
      rewardTokenFarm?.quoteTokenSymbol,
    )

    const totalRewardPricePerYear = rewardTokenPriceInKLAY.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInKLAY.times(getBalanceNumber(pool.totalStaked))
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
      case 1: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        const finixInSix = new BigNumber(currentTotalStaked).times(sixPriceUSD).div(finixPrice)
        apy = finixRewardPerYear.div(finixInSix).times(100)
        break
      }
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      default:
        break
    }
    return {
      ...pool,
      isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
      apy,
      estimatePrice,
    }
  })
  const stackedOnlyPools = poolsWithApy.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )
  const dispatch = useDispatch()
  const countTransactions = useSelector((state: State) => state.longTerm.countTransactions)
  console.log('countTransactions', countTransactions)
  const selectHarvestfarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
      if (finixEarn) {
        await handleHarvest()
          .then((r) => {
            dispatch(fetchCountTransactions(countTransactions + 1))
          })
          .catch((e) => {
            console.log('e')
          })
      }
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [handleHarvest, finixEarn, dispatch, onReward, countTransactions])

  // เอาไว้get length
  //   const countTransactions = useSelector((state: State) => state.longTerm.countTransactions)
  //   console.log('countTransactions::', countTransactions)

  return (
    <Modal title="Exclusive for vFINIX holder" onDismiss={onDismiss} isRainbow={false}>
      <Text paddingRight="1">Choose farm you want to harvest reward</Text>

      <div className="mt-3 flex flex-column align-center justify-center">
        {stackedOnlyPools.map((d) => {
          return (
            <div className="flex justify-center">
              <FormControlLabelCustom
                control={
                  <Checkbox
                    size="small"
                    color="primary"
                    checked={!!selectedToken[d.stakingTokenAddress]}
                    onChange={(event) => {
                      setSelectedToken({ ...selectedToken, [d.stakingTokenAddress]: event.target.checked })
                    }}
                  />
                }
                label={d.tokenName}
              />
              {/* <Text>{d.tokenName}</Text> */}
            </div>
          )
        })}
        <Button
          id="harvest-all"
          size="sm"
          variant="tertiary"
          className="ml-2 mt-3"
          style={{ background: 'linear-gradient(#FAD961, #F76B1C)', color: 'white' }}
          //   disabled={balancesWithValue.length + (finixEarn ? 1 : 0) <= 0 || pendingTx}
          onClick={() => {
            selectHarvestfarms()
          }}
        >
          Stake
        </Button>
      </div>
    </Modal>
  )
}

export default SuperStakeModal
