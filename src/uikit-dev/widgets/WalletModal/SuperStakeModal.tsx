import React, { useState, useCallback, useEffect } from 'react'
import _ from 'lodash'
import Lottie from 'react-lottie'
import moment from 'moment'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Button, Card } from 'uikit-dev'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {
  useFarms,
  usePools,
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
import { getBalanceNumber } from 'utils/formatBalance'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/types'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import {
  useHarvest as useHarvestLongterm,
  usePrivateData,
  useSuperHarvest,
  useSousHarvest,
  useBalances,
  useLockTopup,
  useAllDataLock,
  useAllLock,
} from 'hooks/useLongTermStake'
import { useLockPlus } from 'hooks/useTopUp'
import vFinix from 'uikit-dev/images/for-ui-v2/vFinix.png'
import success from 'uikit-dev/animation/complete.json'
import exclusive from 'uikit-dev/images/for-ui-v2/topup-stake/exclusive-holder.png'
import ModalStake from '../Modal/ModalStake'
import ModalResponses from '../Modal/ModalResponses'
import { Text } from '../../components/Text'
import StakePeriodButton from '../../../views/LongTermStake/components/StakePeriodButton'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

interface Props {
  onDismiss?: () => void
}

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const CardList = styled(Card)`
  width: 100%;
  background-color: ${({ theme }) => (theme.isDark ? '#000000' : '#FCFCFC')};
  border-radius: 24px;
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-self: center;
`

const Balance = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
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

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 22px;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000')};
  -webkit-flex: 1 1 auto;
  padding: 0px;
`

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: ${({ theme }) => theme.colors.success} !important;
  }

  &.MuiCheckbox-root {
    color: #fcfcfc;
  }
`

const BpIcons = styled.span`
  border-radius: 2px;
  width: 0.65em;
  height: 0.65em;
  background-color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#E3E6EC')} !important;
  border: 1.5px solid #979797;
  margin-left: 2px;
  &.Mui-focusVisible {
    outline: 2px auto rgba(19, 124, 189, 0.6);
    outline-offset: 2;
  }
`

const SuperStakeModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const { allLockPeriod } = useAllLock()
  const balanceOf = useBalances()
  const { finixEarn, balancevfinix } = usePrivateData()
  const { handleHarvest } = useHarvestLongterm()
  const { isDark } = useTheme()
  const { levelStake, allLock } = useAllDataLock()
  const lockTopUp = useLockTopup()
  const [selectedToken, setSelectedToken] = useState({})
  // const [sousId, setSousId] = useState(0)
  const [period, setPeriod] = useState(0)
  const [idLast, setIdLast] = useState(0)
  const [lengthSelect, setLengthSelect] = useState(0)
  const [harvestProgress, setHarvestProgress] = useState(-1)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('-')
  const [sumpendingReward, setSumPendingReward] = useState('0')
  const [value, setValue] = useState('0')
  const [showLottie, setShowLottie] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [harvested, setHarvested] = useState(false)
  const [keyDown, setKeyDown] = useState(false)
  const realPenaltyRate = _.get(allLockPeriod, '0.realPenaltyRate')
  const { onLockPlus, status } = useLockPlus(period - 1 !== 3 ? period - 1 : 2, idLast, amount)
  const { onReward } = useSousHarvest()
  const [vFINIX, setVFINIX] = useState(0)
  const [vFinixEarn, setVFinixEarn] = useState(0)

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
        const selectorPeriod = period === 4 ? 3 : period
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
        const selectorPeriod = period === 4 ? 3 : period
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
  }, [lockTopUp, allLock, period])

  useEffect(() => {
    const balance = Math.floor(Number(balanceOf) * 1000000) / 1000000
    if (keyDown === false) {
      setValue(numeral(balance).format('0.00'))
    }
  }, [value, balanceOf, keyDown])

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

  function escapeRegExp(string: string): string {
    return string.replace(/[.*?^${}()|[\]\\]/g, '\\$&')
  }

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setValue(nextUserInput)
      setAmount(new BigNumber(Number(value.replace(',', ''))).times(new BigNumber(10).pow(18)).toFixed())
    }
  }

  const handleChange = (e) => {
    enforcer(e.target.value.replace(/,/g, '.'))
  }

  const { onSuperHarvest } = useSuperHarvest()

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
              })
          } else {
            // vfinix
            handleHarvest()
              .then(() => {
                setHarvestProgress(harvestProgress + 1)
              })
              .catch(() => {
                setHarvestProgress(-1)
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
            })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harvestProgress, selectedToken, handleHarvest])

  const lockPlus = useCallback(() => {
    onLockPlus()
      .then((res) => {
        setAmount('')
        if (res === true) {
          setHarvested(false)
          setHarvestProgress(-1)
          setLengthSelect(0)
          setAmount('')
          setPendingTx(false)
          setShowLottie(true)
          // setInterval(() => setShowLottie(false), 5000)
          // setInterval(() => onDismiss(), 5000)
          setSelectedToken({})
        }
      })
      .catch(() => {
        setAmount('')
      })
  }, [onLockPlus])

  useEffect(() => {
    if (harvestProgress !== -1 && harvestProgress === lengthSelect) {
      setHarvested(true)
      setPendingTx(true)
      if (period !== -Infinity) {
        if (Object.values(selectedToken)[0]) {
          lockPlus()
        } else if (Object.values(selectedToken).length === 0 && value !== '' && value !== '0') {
          lockPlus()
        }
      }
    } else if (harvestProgress !== -1) {
      setPendingTx(true)
      _superHarvest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harvestProgress, _superHarvest, lockPlus])

  useEffect(() => {
    if (harvested === true) {
      if (period === -Infinity) {
        setHarvested(false)
        setHarvestProgress(-1)
        setLengthSelect(0)
        setPendingTx(false)
        setShowLottie(true)
        setSelectedToken({})
      }
    }
  }, [harvestProgress, period, harvested])

  useEffect(() => {
    if (Object.values(selectedToken).length > 0 && value !== '' && value !== '0') {
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
      setSumPendingReward(parseFloat(sum).toFixed(2))
      const total = Number(value.replace(',', '')) + sum
      setAmount(new BigNumber(parseFloat(total)).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length === 0 && value !== '' && value !== '0') {
      setAmount(new BigNumber(Number(value.replace(',', ''))).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length > 0 && value === '') {
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
      setSumPendingReward(parseFloat(sum).toFixed(2))
      setAmount(
        new BigNumber(parseFloat(Number(value.replace(',', '')) + sum)).times(new BigNumber(10).pow(18)).toFixed(),
      )
    } else if (Object.values(selectedToken).length > 0 && Number(value) <= 0) {
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
      setSumPendingReward(parseFloat(sum).toFixed(2))
      setAmount(
        new BigNumber(parseFloat(Number(value.replace(',', '')) + sum)).times(new BigNumber(10).pow(18)).toFixed(),
      )
    } else {
      setAmount('')
    }
  }, [selectedToken, value])

  useEffect(() => {
    const offset = 2
    const now = new Date()
    const utc = now.getTime()
    let localDateTime = new Date(utc + 3600000 * offset)
    const dateTime = now.getTimezoneOffset() / 60
    if (dateTime === -9) {
      localDateTime = new Date()
    }

    if (period === 1) {
      localDateTime.setDate(localDateTime.getDate() + 90)
      localDateTime = new Date(localDateTime)
      setDate(moment(localDateTime).format(`DD-MMM-YYYY HH:mm:ss`))
    } else if (period === 2) {
      localDateTime.setDate(localDateTime.getDate() + 180)
      localDateTime = new Date(localDateTime)
      setDate(moment(localDateTime).format(`DD-MMM-YYYY HH:mm:ss`))
    } else if (period === 4) {
      localDateTime.setDate(localDateTime.getDate() + 365)
      localDateTime = new Date(localDateTime)
      setDate(moment(localDateTime).format(`DD-MMM-YYYY HH:mm:ss`))
    }
    const vfinix = Number(value.replace(',', '')) + Number(sumpendingReward)
    const vfinixEarn = (Number(value.replace(',', '')) + Number(sumpendingReward)) * period
    setVFinixEarn(numeral(vfinixEarn).format('0,0.00'))
    setVFINIX(numeral(vfinix).format('0,0.00'))
  }, [period, value, allLockPeriod, realPenaltyRate, sumpendingReward])

  const harvestOrStake = () => {
    return harvested ? (
      <Button fullWidth id="harvest-all" radii="small" className="mt-3" disabled>
        Staking...
      </Button>
    ) : (
      <Button fullWidth id="harvest-all" radii="small" className="mt-3" disabled>
        {`Harvesting...(${harvestProgress} /${lengthSelect})`}
      </Button>
    )
  }

  const CardResponse = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss} className="">
        <div className="pb-6 pt-2">
          <Lottie options={SuccessOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  const lenghtOrvalue = lengthSelect === 0 && value === ''

  return (
    <>
      {showLottie ? (
        <CardResponse />
      ) : (
        <ModalStake
          title={
            <img
              src={exclusive}
              alt=""
              style={{
                borderBottomRightRadius: '60px',
                borderBottomLeftRadius: '60px',
                boxShadow: '0 3px 6px rgb(0, 0 ,0, 0.16)',
              }}
            />
          }
          onDismiss={onDismiss}
          className=""
        >
          <div className="flex flex-column w-100 mt-2">
            <Text fontSize="18px" fontWeight="600">
              Super Stake
            </Text>
            <Text paddingTop="2" color={isDark ? 'white' : '#737375'}>
              Super Stake is a feature that can harvest all of your FINIX reward to stake in <b> Long-term stake </b>{' '}
              with no minimum amount.
            </Text>
            <Text paddingTop="2" color={isDark ? 'white' : '#737375'}>
              You can stake as much as FINIX you prefer under the same lock period <b>within 28 days</b>, your lock
              period <b>will not be extended.</b>
            </Text>
          </div>
          <Text paddingTop="3" color="#737375" fontWeight="500">
            Choose farm/pool you want to harvest reward
          </Text>

          <div className="flex flex-column align-center justify-center">
            {!!balancevfinix && balancevfinix > 0 && (
              <CardList key="VFINIX" className="px-4">
                <div className="flex align-center">
                  <FormControlLabelCustom
                    control={
                      <CustomCheckbox
                        size="small"
                        disabled={harvestProgress !== -1}
                        checked={_.get(selectedToken, `${18}.checked`)}
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
                        icon={<BpIcons />}
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
                <Text bold>{`${numeral(finixEarn).format('0,0.00')}`} FINIX</Text>
              </CardList>
            )}

            {farmsList(stackedOnlyFarms, false).map((d) => {
              const imgs = d.props.farm.lpSymbol.split(' ')[0].split('-')
              return (
                <CardList className="px-4">
                  <div className="flex align-center">
                    <FormControlLabelCustom
                      control={
                        <CustomCheckbox
                          size="small"
                          disabled={harvestProgress !== -1}
                          checked={_.get(selectedToken, `${d.props.farm.pid}.checked`)}
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
                          icon={<BpIcons />}
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
                  <Text bold>
                    {new BigNumber(d.props.farm.userData.earnings).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}{' '}
                    FINIX
                  </Text>
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
                        <CustomCheckbox
                          size="small"
                          checked={_.get(selectedToken, `${d.sousId}.checked`)}
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
                          icon={<BpIcons />}
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
            <Text className="mt-5" style={{ alignSelf: 'start' }} color="textSubtle" fontWeight="500">
              Please select available duration
            </Text>
            <StakePeriodButton
              setPeriod={setPeriod}
              status={status}
              levelStake={levelStake}
              isTopUp
              harvestProgress={harvestProgress}
            />
            <div className="flex mt-4 w-100">
              <Text className="col-6" color="textSubtle" fontSize="12px" fontWeight="500">
                From your wallet:
                <span style={{ color: '#0973B9' }} className="pl-2">
                  {balanceOf ? numeral(balanceOf).format('0,0.00') : '-'} FINIX
                </span>
              </Text>
              <Text className="col-6 pl-3" color="textSubtle" fontSize="12px" fontWeight="500">
                Pending rewards
              </Text>
            </div>
            <div className="flex w-100 align-center">
              <Balance className="mr-2">
                <NumberInput
                  style={{ width: '45%', color: '#2A9D8F' }}
                  placeholder="0.00"
                  value={value}
                  disabled={harvestProgress !== -1}
                  onChange={handleChange}
                  onKeyDown={() => setKeyDown(true)}
                  className="text-right"
                  pattern="^[0-9]*[,]?[0-9]*$"
                />
              </Balance>
              <Text className="align-center" fontSize="40px" color="#2A9D8F">
                +
              </Text>
              <Balance className="ml-2">
                <NumberInput
                  style={{ width: '45%', color: '#2A9D8F' }}
                  placeholder="0.00"
                  value={sumpendingReward}
                  disabled
                  className="text-right"
                  pattern="^[0-9]*[,]?[0-9]*$"
                />
              </Balance>
            </div>
            <div className="flex mt-4 w-100">
              <Text className="col-6" color={isDark ? 'white' : '#000'} fontWeight="500">
                Estimated Period End
              </Text>
              <Text className="col-6 text-right" color="#0973B9" fontWeight="500">
                {date} {date !== '-' && 'GMT+9'}
              </Text>
            </div>
            <div className="flex mt-2 w-100">
              <Text className="col-6" color={isDark ? 'white' : '#000'} fontWeight="500">
                Total FINIX stake
              </Text>
              <div className="flex flex-row justify-end w-100">
                <Text className="text-right" color="#0973B9" fontWeight="500">
                  {vFINIX}
                </Text>
                <Text className="text-right ml-1" color={isDark ? 'white' : '#000'} fontWeight="500">
                  vFINIX
                </Text>
              </div>
            </div>
            <div className="flex mt-2 w-100">
              <Text className="col-6" color={isDark ? 'white' : '#000'} fontWeight="500">
                vFINIX earn
              </Text>
              <div className="flex flex-row justify-end w-100">
                <Text className="text-right" color="#0973B9" fontWeight="500">
                  {vFinixEarn}
                </Text>
                <Text className="text-right ml-1" color={isDark ? 'white' : '#000'} fontWeight="500">
                  vFINIX
                </Text>
              </div>
            </div>
            {pendingTx ? (
              harvestOrStake()
            ) : (
              <Button
                fullWidth
                disabled={period === -Infinity && lengthSelect === 0 ? true : lenghtOrvalue}
                id="harvest-all"
                radii="small"
                className="mt-3"
                onClick={() => setHarvestProgress(0)}
              >
                Stake
              </Button>
            )}
          </div>
        </ModalStake>
      )}
    </>
  )
}

export default SuperStakeModal
