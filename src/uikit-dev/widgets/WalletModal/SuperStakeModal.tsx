import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import styled from 'styled-components'
import { Link, Button, Card, Skeleton, IconButton, ChevronRightIcon, Image } from 'uikit-dev'
import Checkbox from '@material-ui/core/Checkbox'
import { getVFinix } from 'utils/addressHelpers'
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
import { useAllHarvest, useSousHarvest, useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/types'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import {
  useHarvest as useHarvestLongterm,
  useAprCardFarmHome,
  useAllLock,
  usePrivateData,
  useRank,
} from 'hooks/useLongTermStake'
import { State } from 'state/types'
import { fetchCountTransactions } from 'state/longTermStake'
import vFinix from 'uikit-dev/images/for-ui-v2/vFinix.png'
import exclusive from 'uikit-dev/images/for-ui-v2/exclusive-holder.png'
import ModalStake from '../Modal/ModalStake'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'
import { Text } from '../../components/Text'
import StakePeriodButton from '../../../views/LongTermStake/components/StakePeriodButton'

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

const CardList = styled(Card)`
  width: 100%;
  //   height: 48px;
  background-color: '#FCFCFC';
  border-radius: 24px;
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-self: center;
`

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  > * {
    flex-shrink: 0;

    &:nth-child(01) {
      position: relative;
      z-index: 1;
    }
    &:nth-child(02) {
      margin-left: -8px;
    }
  }
`

const Balance = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  // flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 0.75rem 0.75rem 0.75rem;
  background-color: ${'#E4E4E425'};
  margin-top: 0.5rem !important;
  border: ${({ theme }) => !theme.isDark && '1px solid #ECECEC'};
  box-shadow: unset;
  border-radius: ${({ theme }) => theme.radii.default};

  a {
    display: block;
  }
`

const Coins = styled.div`
  padding: 4px;
  //   width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  img {
    width: 37px;
    flex-shrink: 0;
  }

  > * {
    flex-shrink: 0;

    &:nth-child(01) {
      position: relative;
      z-index: 1;
    }
    &:nth-child(02) {
      margin-left: -8px;
    }
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

const Coin = styled.div`
  min-width: 80px;
  display: flex;
  align-items: center;
  margin: 4px 0;
  justify-content: end;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

// const Coins = styled.div`
//   padding: 16px;
//   width: 40%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: space-between;

//   img {
//     width: 48px;
//     flex-shrink: 0;
//   }
// `

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

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 22px;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000000')};
  // width: 45%;
  -webkit-flex: 1 1 auto;
  padding: 0px;
`

const SuperStakeModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedToken, setSelectedToken] = useState({})
  const [selectedTokenCount, setSelectedTokenCount] = useState(0)
  const [sousId, setSousId] = useState(0)
  const [pid, setPid] = useState(0)
  const [isBnbPool, setIsBnbPool] = useState(false)
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  //   const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  //   const { onReward } = useSousHarvest(sousId, isBnbPool)
  // Farms
  const farmsLP = useFarms()
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPriceUsd = usePriceKethKusdt()
  const [listView, setListView] = useState(false)
  const activeFarms = farmsLP.filter((farms) => farms.pid !== 0 && farms.pid !== 1 && farms.multiplier !== '0X')
  //   const stackedOnlyFarms = activeFarms.filter(
  //     (farms) => farms.userData && new BigNumber(farms.userData.stakedBalance).isGreaterThan(0),
  //   )
  const stackedOnlyFarms = activeFarms

  console.log('stackedOnlyFarms::', stackedOnlyFarms)

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

        if (farm.quoteTokenSymbol === QuoteToken.KUSDT) {
          apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(klayPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
          apy = finixPrice.div(klayPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.KETH) {
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
          klayPrice={klayPrice}
          kethPrice={ethPriceUsd}
          sixPrice={sixPrice}
          finixPrice={finixPrice}
          klaytn={klaytn}
          account={account}
          isHorizontal={listView}
        />
      ))
    },
    [sixPrice, klayPrice, ethPriceUsd, finixPrice, klaytn, account, listView],
  )

  // Pools
  const pools = usePools(account)
  const farms = useFarms()
  const sixPriceUSD = usePriceSixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()

  // LongTerm
  const { lockAmount, finixEarn, balancefinix, balancevfinix } = usePrivateData()
  const { handleHarvest } = useHarvestLongterm()
  const longtermApr = useAprCardFarmHome()

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
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const onharvestFarms = useHarvest(pid)
  const countTransactions = useSelector((state: State) => state.longTerm.countTransactions)
  const selectHarvestfarms = useCallback(async () => {
    setPendingTx(true)
    try {
      setPendingTx(true)
      Object.values(selectedToken).map(async (c) => {
        if (_.get(c, 'checked')) {
          if (!_.get(c, 'pools')) {
            if (_.get(c, 'farms')) {
              setPid(_.get(c, 'pid'))
              await onharvestFarms
                .onReward()
                .then((r) => {
                  setSelectedTokenCount(selectedTokenCount + 1)
                })
                .catch((e) => {
                  console.log(e)
                })
            } else {
              await handleHarvest()
                .then((r) => {
                  setSelectedTokenCount(selectedTokenCount + 1)
                })
                .catch((e) => {
                  console.log(e)
                })
            }
          } else {
            setSousId(_.get(c, 'sousId'))
            await onReward()
              .then((r) => {
                setSelectedTokenCount(selectedTokenCount + 1)
              })
              .catch((e) => {
                console.log(e)
              })
          }
        }
        return c
      })
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    }
  }, [handleHarvest, onReward, selectedToken, onharvestFarms, selectedTokenCount])

  const [period, setPeriod] = useState(0)

  return (
    <ModalStake title={<img src={exclusive} alt="" />} onDismiss={onDismiss}>
      <div className="flex flex-column w-100">
        <Text fontSize="20px" fontWeight="bold">
          Super Stake
        </Text>
        <Text paddingTop="2" color="#737375">
          Super Stake is a feature that can harvest all of your FINIX reward to stake in <b> Long-term stake </b> with
          no minimum amount.
        </Text>
        <Text paddingTop="2" color="#737375">
          You can stake as much as FINIX you prefer under the same lock period <b>within 28 days</b>, your lock period{' '}
          <b>will not be extended.</b>
        </Text>
      </div>
      <Text paddingTop="3" color="#737375">
        Choose farm/pool you want to harvest reward
      </Text>

      <div className="flex flex-column align-center justify-center">
        {!!balancevfinix && balancevfinix > 0 && (
          <CardList key="VFINIX" className="px-4">
            <div className="flex align-center">
              <FormControlLabelCustom
                control={
                  <Checkbox
                    size="small"
                    color="secondary"
                    checked={!!_.get(selectedToken, `${18}.checked`)}
                    onChange={(event) => {
                      setSelectedToken({
                        ...selectedToken,
                        18: { checked: event.target.checked, pools: false, farms: false, status: false },
                      })
                    }}
                  />
                }
                label=""
              />
              <Coins>
                <div className="flex">
                  <img src={vFinix} alt="" />
                </div>
              </Coins>
              <Text className="align-center ml-2">VFINIX</Text>
            </div>
            <Text bold>{`${numeral(finixEarn).format('0,0.[00]')}`} FINIX</Text>
          </CardList>
        )}

        {farmsList(stackedOnlyFarms, false).map((d) => {
          const imgs = d.props.farm.lpSymbol.split(' ')[0].split('-')
          return (
            <CardList className="px-4">
              <div className="flex align-center">
                <FormControlLabelCustom
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={!!_.get(selectedToken, `${d.props.farm.pid}.checked`)}
                      onChange={(event) => {
                        setSelectedToken({
                          ...selectedToken,
                          [d.props.farm.pid]: {
                            checked: event.target.checked,
                            pools: false,
                            farms: true,
                            pid: d.props.farm.pid,
                            status: false,
                          },
                        })
                      }}
                    />
                  }
                  label=""
                />
                <Coins>
                  <div className="flex">
                    {imgs[0] && <img src={`/images/coins/${imgs[0].toLowerCase()}.png`} alt="" />}
                    {imgs[1] && <img src={`/images/coins/${imgs[1].toLowerCase()}.png`} alt="" />}
                  </div>
                </Coins>
                <Text className="align-center ml-2">{(d.props.farm.lpSymbol || '').replace(/ LP$/, '')}</Text>
              </div>
              {/* <Text bold>
                {new BigNumber(d.props.farm.userData.earnings).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}{' '}
                FINIX
              </Text> */}
            </CardList>
          )
        })}
        {stackedOnlyPools.map((d, i) => {
          const imgs = d.tokenName.split(' ')[0].split('-')
          return (
            <CardList className="px-4">
              <div className="flex align-center">
                <FormControlLabelCustom
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={!!_.get(selectedToken, `${d.sousId}.checked`)}
                      onChange={(event) => {
                        setSelectedToken({
                          ...selectedToken,
                          [i]: {
                            checked: event.target.checked,
                            pools: true,
                            sousId: d.sousId,
                            farms: false,
                            status: false,
                          },
                        })
                      }}
                    />
                  }
                  label=""
                />
                <Coins>
                  <div className="flex">
                    <img src={`/images/coins/${imgs[0].toLowerCase()}.png`} alt="" />
                  </div>
                </Coins>
                <Text className="align-center ml-2">{d.tokenName}</Text>
              </div>
              <Text bold>
                {new BigNumber(d.userData.pendingReward).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)} FINIX
              </Text>
            </CardList>
          )
        })}
        <Text className="mt-5" style={{ alignSelf: 'start' }} color="textSubtle">
          Please select duration
        </Text>
        <StakePeriodButton setPeriod={setPeriod} status={false} />
        <div className="flex mt-4 w-100">
          <Text className="col-6" color="textSubtle">
            Deposit
          </Text>
          <Text className="col-6 text-right" color="textSubtle">
            Balance: 1000
          </Text>
        </div>
        <Balance>
          <NumberInput
            style={{ width: '45%' }}
            placeholder="0.00"
            value=""
            // onChange={handleChange}
            pattern="^[0-9]*[,]?[0-9]*$"
          />
          {/* {percent !== 1 && (
            <div className="flex align-center justify-end" style={{ width: 'auto' }}>
              <StylesButton className="mr-1" size="sm" onClick={() => setPercent(0.25)}>
                25%
              </StylesButton>
              <StylesButton className="mr-1" size="sm" onClick={() => setPercent(0.5)}>
                50%
              </StylesButton>
              <StylesButton size="sm" onClick={() => setPercent(1)}>
                MAX
              </StylesButton>
            </div>
          )} */}
          <Coin>
            <img src={`/images/coins/${'FINIX'}.png`} alt="" />
            {/* <Heading as="h1" fontSize="16px !important">
              FINIX
            </Heading> */}
          </Coin>
        </Balance>
        <div className="flex mt-4 w-100">
          <Text className="col-6" color="#000000">
            Estimated Period End
          </Text>
          <Text className="col-6 text-right" color="#30ADFF">
            -
          </Text>
        </div>
        <div className="flex mt-2 w-100">
          <Text className="col-6" color="#000000">
            vFINIX earn
          </Text>
          <div className="flex flex-row justify-end w-100">
            <Text className="text-right" color="#30ADFF">
              1000
            </Text>
            <Text className="text-right ml-1" color="#000000">
              vFINIX
            </Text>
          </div>
        </div>
        {pendingTx ? (
          <Button
            fullWidth
            id="harvest-all"
            radii="small"
            className="ml-2 mt-3"
            disabled
            onClick={() => {
              selectHarvestfarms()
            }}
          >
            {`Harvesting...(${selectedTokenCount} /${Object.keys(selectedToken).length})`}
          </Button>
        ) : (
          <Button
            fullWidth
            id="harvest-all"
            radii="small"
            className="ml-2 mt-3"
            //   disabled={balancesWithValue.length + (finixEarn ? 1 : 0) <= 0 || pendingTx}
            onClick={() => {
              selectHarvestfarms()
            }}
          >
            Stake
          </Button>
        )}
      </div>
    </ModalStake>
  )
}

export default SuperStakeModal
