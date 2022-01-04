import React, { useState, useCallback, useEffect } from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { BLOCKS_PER_YEAR } from 'config'
import styled from 'styled-components'
import { Flex, Coin, Text, CheckboxLabel, Checkbox } from '@fingerlabs/definixswap-uikit-v2'
import {
  useFarms,
  usePools,
  usePriceFinixUsd,
  usePriceKethKlay,
  usePriceKethKusdt,
  usePriceKlayKusdt,
  usePriceSixUsd,
  useToast,
} from 'state/hooks'
import { provider } from 'web3-core'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber } from 'utils/formatBalance'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/types'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import {
  useHarvest as useHarvestLongterm,
  usePrivateData,
  useSuperHarvest,
  useSousHarvest,
  useLockTopup,
  useAllDataLock,
} from 'hooks/useLongTermStake'
import { useLockPlus } from 'hooks/useTopUp'

interface SuperFarmPoolProps {
  days: number
  inputFinix: string
  setInputHarvest: React.Dispatch<React.SetStateAction<string>>
  harvestProgress: number
  setHarvestProgress: React.Dispatch<React.SetStateAction<number>>
  show: boolean
  onDismiss: () => null
  setIsLoadingStake: React.Dispatch<React.SetStateAction<string>>
}

const Wrap = styled.div`
  width: 100%;
  max-height: 168px;
  overflow: auto;
`

const StyledCheckboxLabel = styled(CheckboxLabel)`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
`

const SuperFarmPool: React.FC<SuperFarmPoolProps> = ({
  days,
  inputFinix,
  setInputHarvest,
  harvestProgress,
  setHarvestProgress,
  show,
  onDismiss,
  setIsLoadingStake,
}) => {
  const { t } = useTranslation()
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const { finixEarn, balancevfinix } = usePrivateData()
  const { allLock } = useAllDataLock()
  const lockTopUp = useLockTopup()
  const [selectedToken, setSelectedToken] = useState({})
  const [idLast, setIdLast] = useState(0)
  const [lengthSelect, setLengthSelect] = useState(0)
  const [amount, setAmount] = useState('')
  const { toastSuccess, toastError } = useToast()

  const showToastSuperStake = useCallback(
    (success: boolean) => {
      if (success) toastSuccess(t('{{Action}} Complete', { Action: t('actioncStake') }))
      else toastError(t('{{Action}} Failed', { Action: t('actioncStake') }))
      onDismiss()
    },
    [onDismiss, t, toastError, toastSuccess],
  )

  const getLevel = (day: number) => {
    if (day === 90) return 0
    if (day === 180) return 1
    return 2
  }

  const { onLockPlus, status, loadings } = useLockPlus(getLevel(days), idLast, amount)
  const { onSuperHarvest } = useSuperHarvest()
  const { handleHarvest } = useHarvestLongterm()
  const { onReward } = useSousHarvest()

  useEffect(() => {
    if (status) showToastSuperStake(true)
  }, [status, showToastSuperStake])

  useEffect(() => {
    setIsLoadingStake(loadings)
  }, [loadings, setIsLoadingStake])

  useEffect(() => {
    return () => setSelectedToken({})
  }, [])

  // Farms
  const farmsLP = useFarms()
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPriceUsd = usePriceKethKusdt()
  const [listView] = useState(false)
  const activeFarms = farmsLP.filter((farms) => farms.pid !== 0 && farms.pid !== 1 && farms.multiplier !== '0X')
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

  // LongTermStake
  useEffect(() => {
    if (lockTopUp !== null && lockTopUp.length > 0) {
      const arrStr = lockTopUp.map((i) => Number(i))
      const removeTopUpId = allLock.filter((item) => !arrStr.includes(Number(_.get(item, 'id'))))
      let max = 0
      for (let i = 0; i < removeTopUpId.length; i++) {
        const selector = removeTopUpId[i]
        const selectorPeriod = getLevel(days) + 1
        if (
          _.get(selector, 'isUnlocked') === false &&
          _.get(selector, 'isPenalty') === false &&
          _.get(selector, 'level') === selectorPeriod
        ) {
          if (Number(_.get(selector, 'id')) >= max) {
            max = Number(_.get(selector, 'id'))
            setIdLast(max)
          }
        }
      }
    } else {
      let max = 0
      for (let i = 0; i < allLock.length; i++) {
        const selector = allLock[i]
        const selectorPeriod = getLevel(days) + 1
        if (
          _.get(selector, 'isUnlocked') === false &&
          _.get(selector, 'isPenalty') === false &&
          _.get(selector, 'level') === selectorPeriod
        ) {
          if (Number(_.get(selector, 'id')) > max) {
            max = Number(_.get(selector, 'id'))
            setIdLast(max)
          }
        }
      }
    }
  }, [lockTopUp, allLock, days])

  const _superHarvest = useCallback(() => {
    const selected = Object.values(selectedToken).filter((d) => _.get(d, 'checked') === true)
    if (harvestProgress !== -1 && harvestProgress <= Object.values(selected).length) {
      if (_.get(Object.values(selected)[harvestProgress], 'checked')) {
        if (!_.get(Object.values(selected)[harvestProgress], 'pools')) {
          if (_.get(Object.values(selected)[harvestProgress], 'farms')) {
            onSuperHarvest(_.get(Object.values(selected)[harvestProgress], 'pid'))
              .then(() => {
                // farm
                setHarvestProgress(harvestProgress + 1)
              })
              .catch(() => {
                setHarvestProgress(-1)
                showToastSuperStake(false)
              })
          } else {
            // vfinix
            handleHarvest()
              .then(() => {
                setHarvestProgress(harvestProgress + 1)
              })
              .catch(() => {
                setHarvestProgress(-1)
                showToastSuperStake(false)
              })
          }
        } else {
          // pool
          onReward(_.get(Object.values(selected)[harvestProgress], 'sousId'))
            .then(() => {
              setHarvestProgress(harvestProgress + 1)
            })
            .catch(() => {
              setHarvestProgress(-1)
              showToastSuperStake(false)
            })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harvestProgress, selectedToken, handleHarvest])

  const lockPlus = useCallback(async () => {
    try {
      const res = await onLockPlus()
      setAmount('')
      if (res === true) {
        setHarvestProgress(-1)
        setLengthSelect(0)
        setAmount('')
        setSelectedToken({})
      }
    } catch {
      setAmount('')
      showToastSuperStake(false)
    }
  }, [onLockPlus, setHarvestProgress, showToastSuperStake])

  useEffect(() => {
    if (harvestProgress !== -1 && harvestProgress === lengthSelect) {
      if (Object.values(selectedToken)[0]) {
        lockPlus()
      } else if (Object.values(selectedToken).length === 0 && inputFinix !== '' && inputFinix !== '0') {
        lockPlus()
      }
    } else if (harvestProgress !== -1) {
      _superHarvest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harvestProgress, _superHarvest])

  useEffect(() => {
    if (Object.values(selectedToken).length > 0 && inputFinix !== '' && inputFinix !== '0') {
      const dataArray = []
      for (let i = 0; i < Object.values(selectedToken).length; i++) {
        const selector = Object.values(selectedToken)[i]
        if (_.get(selector, 'checked')) {
          dataArray.push(_.get(selector, 'pendingReward'))
        } else {
          dataArray.splice(i)
        }
      }
      const sum = dataArray.reduce((r, n) => r + n, 0)
      setLengthSelect(dataArray.length)
      const total = Number(inputFinix) + sum
      setAmount(new BigNumber(parseFloat(total)).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length === 0 && inputFinix !== '' && inputFinix !== '0') {
      setAmount(new BigNumber(Number(inputFinix)).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length > 0 && inputFinix === '') {
      const dataArray = []
      for (let i = 0; i < Object.values(selectedToken).length; i++) {
        const selector = Object.values(selectedToken)[i]
        if (_.get(selector, 'checked')) {
          dataArray.push(_.get(selector, 'pendingReward'))
        } else {
          dataArray.splice(i)
        }
      }
      const sum = dataArray.reduce((r, n) => r + n, 0)
      setLengthSelect(dataArray.length)
      setAmount(new BigNumber(parseFloat(Number(inputFinix) + sum)).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length > 0 && Number(inputFinix) <= 0) {
      const dataArray = []
      for (let i = 0; i < Object.values(selectedToken).length; i++) {
        const selector = Object.values(selectedToken)[i]
        if (_.get(selector, 'checked')) {
          dataArray.push(_.get(selector, 'pendingReward'))
        } else {
          dataArray.splice(i)
        }
      }
      const sum = dataArray.reduce((r, n) => r + n, 0)
      setLengthSelect(dataArray.length)
      setAmount(new BigNumber(parseFloat(Number(inputFinix) + sum)).times(new BigNumber(10).pow(18)).toFixed())
    } else {
      setAmount('')
    }
  }, [selectedToken, inputFinix])

  useEffect(() => {
    let totalPendingReward = 0
    for (let i = 0; i < Object.values(selectedToken).length; i++) {
      const selector = Object.values(selectedToken)[i]
      if (_.get(selector, 'checked')) {
        totalPendingReward += _.get(selector, 'pendingReward')
      }
    }
    setInputHarvest(String(totalPendingReward))
  }, [selectedToken, setInputHarvest])

  return (
    <>
      {show && (
        <>
          <Text mb="S_12" textStyle="R_16M" color="deepgrey">
            Choose farm/pool you want to harvest reward
          </Text>
          <Wrap>
            {!!balancevfinix && balancevfinix > 0 && (
              <StyledCheckboxLabel
                control={
                  <Checkbox
                    scale="sm"
                    disabled={harvestProgress !== -1}
                    checked={_.get(selectedToken, `${18}.checked`) || false}
                    onChange={(event) => {
                      setSelectedToken({
                        ...selectedToken,
                        18: {
                          checked: event.target.checked,
                          pools: false,
                          farms: false,
                          status: false,
                          pendingReward: finixEarn,
                        },
                      })
                    }}
                  />
                }
              >
                <Flex alignItems="center" ml="S_4">
                  <Flex>
                    <Coin symbol="VFINIX" size="24px" />
                  </Flex>
                  <Text textStyle="R_14M" color="black" ml="26px">
                    VFINIX
                  </Text>
                </Flex>
                <Flex style={{ position: 'absolute', right: '5px' }}>
                  <Text textStyle="R_14R" color="black">
                    {`${numeral(finixEarn).format('0,0.00')}`}
                  </Text>
                  <Text textStyle="R_14R" color="mediumgrey" ml="S_6">
                    FINIX
                  </Text>
                </Flex>
              </StyledCheckboxLabel>
            )}

            {farmsList(stackedOnlyFarms, false).map((d) => {
              const imgs = d.props.farm.lpSymbol.split(' ')[0].split('-')
              return (
                <StyledCheckboxLabel
                  key={d.props.farm.pid}
                  control={
                    <Checkbox
                      scale="sm"
                      disabled={harvestProgress !== -1}
                      checked={_.get(selectedToken, `${d.props.farm.pid}.checked`) || false}
                      onChange={(event) => {
                        setSelectedToken({
                          ...selectedToken,
                          [d.props.farm.pid]: {
                            checked: event.target.checked,
                            pools: false,
                            farms: true,
                            pid: d.props.farm.pid,
                            status: false,
                            pendingReward: new BigNumber(d.props.farm.userData.earnings)
                              .div(new BigNumber(10).pow(18))
                              .toNumber(),
                          },
                        })
                      }}
                    />
                  }
                >
                  <Flex alignItems="center" ml="S_4">
                    <Flex>
                      {imgs[0] && <Coin symbol={imgs[0]} size="24px" />}
                      {imgs[1] && (
                        <Flex style={{ marginLeft: '-6px', zIndex: '-1' }}>
                          <Coin symbol={imgs[1]} size="24px" />
                        </Flex>
                      )}
                    </Flex>
                    <Text textStyle="R_14M" color="black" ml="S_8">
                      {(d.props.farm.lpSymbol || '').replace(/ LP$/, '')}
                    </Text>
                  </Flex>
                  <Flex style={{ position: 'absolute', right: '5px' }}>
                    <Text textStyle="R_14R" color="black">
                      {new BigNumber(d.props.farm.userData.earnings)
                        .div(new BigNumber(10).pow(18))
                        .toNumber()
                        .toFixed(2)}{' '}
                    </Text>
                    <Text textStyle="R_14R" color="mediumgrey" ml="S_6">
                      FINIX
                    </Text>
                  </Flex>
                </StyledCheckboxLabel>
              )
            })}

            {stackedOnlyPools.map((d, i) => {
              const imgs = d.tokenName.split(' ')[0].split('-')
              return (
                <StyledCheckboxLabel
                  key={d.sousId}
                  control={
                    <Checkbox
                      scale="sm"
                      checked={_.get(selectedToken, `${d.sousId}.checked`) || false}
                      disabled={harvestProgress !== -1}
                      onChange={(event) => {
                        setSelectedToken({
                          ...selectedToken,
                          [i]: {
                            checked: event.target.checked,
                            pools: true,
                            sousId: d.sousId,
                            farms: false,
                            status: false,
                            pendingReward: new BigNumber(d.userData.pendingReward)
                              .div(new BigNumber(10).pow(18))
                              .toNumber(),
                          },
                        })
                      }}
                    />
                  }
                >
                  <Flex alignItems="center" ml="S_4">
                    <Flex>
                      <Coin symbol={imgs[0]} size="24px" />
                    </Flex>
                    <Text textStyle="R_14M" color="black" ml="26px">
                      {d.tokenName}
                    </Text>
                  </Flex>
                  <Flex style={{ position: 'absolute', right: '5px' }}>
                    <Text textStyle="R_14R" color="black">
                      {new BigNumber(d.userData.pendingReward).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                    </Text>
                    <Text textStyle="R_14R" color="mediumgrey" ml="S_6">
                      FINIX
                    </Text>
                  </Flex>
                </StyledCheckboxLabel>
              )
            })}
          </Wrap>
        </>
      )}
    </>
  )
}

export default SuperFarmPool
