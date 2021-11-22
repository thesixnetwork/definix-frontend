import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Lottie from 'react-lottie'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import moment from 'moment'
import ModalSorry from '../../uikit-dev/widgets/Modal/ModalSorry'
import useTheme from '../../hooks/useTheme'
import { Card, Button, useMatchBreakpoints, Text, Heading, useModal } from '../../uikit-dev'
import ConnectModal from '../../uikit-dev/widgets/WalletModal/ConnectModal'
import logoExclusive from '../../uikit-dev/images/for-ui-v2/long-term-stake/logo-exclusive-vfinix.png'
import badgeExclusive from '../../uikit-dev/images/for-ui-v2/long-term-stake/badge-exclusive.png'
import success from '../../uikit-dev/animation/complete.json'
import loading from '../../uikit-dev/animation/farmPool.json'
import * as klipProvider from '../../hooks/klipProvider'
import {
  useBalances,
  useAllowance,
  useApprove,
  useAllLock,
  usePrivateData,
  useLockTopup,
  useAllDataLock,
} from '../../hooks/useLongTermStake'
import { useLockPlus } from '../../hooks/useTopUp'
import StakePeriodButton from './components/StakePeriodButton'
import LongTermTab from './components/LongTermTab'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const options = {
  loop: true,
  autoplay: true,
  animationData: loading,
}

const FinixStake = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  align-items: center;

  a {
    display: block;
  }
`

const Balance = styled.div`
  display: flex;
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

const StylesButton = styled(Button)`
  padding: 11px 12px 11px 12px;
  border: ${({ theme }) => theme.isDark && '1px solid #707070'};
  border-radius: 8px;
  font-size: 12px;
  background-color: ${({ theme }) => (theme.isDark ? '#ffff0000' : '#EFF4F5')};
  height: 38;
  width: auto;
  color: ${({ theme }) => (theme.isDark ? theme.colors.textSubtle : '#1587C9')};

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: ${({ theme }) => (theme.isDark ? '#ffff0000' : '#EFF4F5')};
    border: ${({ theme }) => theme.isDark && '1px solid #707070'};
    color: ${({ theme }) => (theme.isDark ? theme.colors.textSubtle : '#1587C9')};
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

const ExclusiveCard = styled.div<{ isDark: boolean }>`
  width: 110px;
  align-items: start;
  display: flex;
  box-shadow: ${({ isDark }) => !isDark && 'unset'};
`

const BadgeExclusive = styled.div`
  position: relative;
  text-align: center;
  justify-content: space-between;
  display: contents;
`
const CardSuperStake = () => {
  /* eslint-enable no-unused-vars */
  const { connect, account } = useWallet()
  const { isDark } = useTheme()
  const balanceOf = useBalances()
  const allowance = useAllowance()
  const lockTopUp = useLockTopup()
  const { allLockPeriod } = useAllLock()
  const { levelStake, allLock } = useAllDataLock()
  const { onApprove } = useApprove(klipProvider.MAX_UINT_256_KLIP)
  const [onPresentConnectModal] = useModal(<ConnectModal login={connect} />)
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl && !isMd && !isLg
  const { allDataLock, lockAmount } = usePrivateData()
  const [period, setPeriod] = useState(0)
  const [date, setDate] = useState('-')
  const [value, setValue] = useState('')
  const [vFINIX, setVFINIX] = useState(0)
  const [idLast, setIdLast] = useState(0)
  const [lockFinix, setLockFinix] = useState('')
  const [percent, setPercent] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [flgButton, setFlgButton] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const isStake = useMemo(() => lockAmount > 0, [lockAmount])
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
  const minimum = _.get(allLockPeriod, '0.minimum')
  const periodEnd = _.get(allLockPeriod, '0.periodMap')
  const realPenaltyRate = _.get(allLockPeriod, '0.realPenaltyRate')
  const { onLockPlus, loadings, status } = useLockPlus(period - 1 !== 3 ? period - 1 : 2, idLast, lockFinix)
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  useEffect(() => {
    if (lockTopUp !== null && lockTopUp.length > 0) {
      const arrStr = lockTopUp.map((i) => Number(i))
      const removeTopUpId = allLock.filter((item, index) => !arrStr.includes(Number(_.get(item, 'id'))))
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
          if (Number(_.get(selector, 'id')) >= max) {
            max = Number(_.get(selector, 'id'))
            setIdLast(max)
          }
        }
      }
    }
  }, [lockTopUp, allLock, period, allDataLock])

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setValue(nextUserInput)
    }
  }
  const handleChange = (e) => {
    setPercent(0)
    enforcer(e.target.value.replace(/,/g, '.'))
  }

  useEffect(() => {
    const offset = 2
    const now = new Date()
    const utc = now.getTime()
    let nd = new Date(utc + 3600000 * offset)
    const dateTime = now.getTimezoneOffset() / 60
    if (dateTime === -9) {
      nd = new Date()
    }

    if (period === 1) {
      nd.setDate(nd.getDate() + 90)
      nd = new Date(nd)
      setDate(moment(nd).format(`DD-MMM-YYYY HH:mm:ss`))
    } else if (period === 2) {
      nd.setDate(nd.getDate() + 180)
      nd = new Date(nd)
      setDate(moment(nd).format(`DD-MMM-YYYY HH:mm:ss`))
    } else if (period === 4) {
      nd.setDate(nd.getDate() + 365)
      nd = new Date(nd)
      setDate(moment(nd).format(`DD-MMM-YYYY HH:mm:ss`))
    }
    setVFINIX(numeral(Number(value.replace(',', '')) * period).format('0,0.00'))
    setLockFinix(new BigNumber(parseFloat(value)).times(new BigNumber(10).pow(18)).toFixed())
  }, [period, value, periodEnd, allLockPeriod, realPenaltyRate])

  useEffect(() => {
    if (status) {
      setVFINIX(0)
      setValue('')
      setDate('-')
      // setPeriod(0)
    }
  }, [status])

  const hadleStakeButton = useCallback(() => {
    setFlgButton('enter amount')
    setIsDisabled(true)
    if (Number(value) > Number(balanceOf)) {
      setFlgButton('insufficient')
      setIsDisabled(false)
    } else if (period === 1 && value !== '' && Number(value) > 0) {
      setFlgButton('')
      setIsDisabled(false)
    } else if (period === 2 && value !== '' && Number(value) > 0) {
      setFlgButton('')
      setIsDisabled(false)
    } else if (period === 4 && value !== '' && Number(value) > 0) {
      setFlgButton('')
      setIsDisabled(false)
    }
  }, [value, period, balanceOf])

  const hadleInsufficient = useCallback(() => {
    setFlgButton('insufficient')
  }, [])

  useEffect(() => {
    if (Number(balanceOf) <= 0) {
      hadleInsufficient()
    } else {
      hadleStakeButton()
    }
  }, [value, period, balanceOf, minimum, hadleStakeButton, hadleInsufficient])

  const renderStakeDOrStake = () => {
    return (
      <Button fullWidth disabled={isDisabled} className="align-self-center" radii="small" onClick={onLockPlus}>
        Stake
      </Button>
    )
  }

  const renderStakeOrEnter = () => {
    return flgButton === 'enter amount' ? (
      <Button fullWidth disabled className="align-self-center" radii="small">
        Enter an amount
      </Button>
    ) : (
      renderStakeDOrStake()
    )
  }

  const renderStakeOrInsufficient = () => {
    return flgButton === 'insufficient' ? (
      <Button fullWidth disabled className="align-self-center" radii="small">
        Insufficient Balance
      </Button>
    ) : (
      renderStakeOrEnter()
    )
  }

  const renderApprovalOrStakeButton = () => {
    return isApproved || transactionHash !== '' ? (
      renderStakeOrInsufficient()
    ) : (
      <Button fullWidth className="align-self-center" radii="small" onClick={handleApprove}>
        Approve Contract
      </Button>
    )
  }

  useEffect(() => {
    const percentOf = percent * Number(balanceOf)
    const balance = Math.floor(percentOf * 1000000) / 1000000
    if (percent !== 0) {
      setValue(balance.toString())
    }
  }, [percent, balanceOf])

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await onApprove()
      if (txHash) {
        setTransactionHash(_.get(txHash, 'transactionHash'))
      }
    } catch (e) {
      setTransactionHash('')
    }
  }, [onApprove])

  return (
    <div className="align-stretch mt-5">
      <LongTermTab current="/long-term-stake/top-up" />
      <FinixStake className="flex">
        {!isStake && (
          <div
            style={{
              position: 'absolute',
              left: (loadings === 'loading' && '20%') || (!isMobileOrTablet && '19%'),
              top: loadings === 'loading' ? '18%' : 'unset',
              zIndex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <ModalSorry title="Sorry, this feature is only for vFINIX holder" hideCloseButton>
              <div className="flex flex-column w-100 mt-2">
                <Text color={isDark ? 'white' : '#737375'}>
                  You have never lock in Long-term Stake. Do you want to start staking in the Long-term Stake to get
                  this exclusive feature?
                </Text>
              </div>
            </ModalSorry>
          </div>
        )}
        {loadings !== '' && (
          <div
            style={{
              position: 'absolute',
              left: loadings === 'loading' ? '20%' : '38%',
              top: loadings === 'loading' ? '18%' : '32%',
              zIndex: 1,
            }}
          >
            <Lottie
              options={loadings === 'loading' ? options : SuccessOptions}
              height={loadings === 'loading' ? 300 : 155}
              width={loadings === 'loading' ? 444 : 185}
            />
          </div>
        )}
        <div
          style={{ opacity: !isStake || loadings !== '' ? 0.1 : 1 }}
          className={`${!isMobileOrTablet ? 'col-8 pt-5' : 'col-12 pr-5'} pb-5 pl-5`}
        >
          <div className={`${!isMobileOrTablet ? '' : 'flex align-items-center justify-space-between'}`}>
            <Heading
              as="h1"
              fontSize={`${isMobileOrTablet ? '16px !important' : '18px !important'}`}
              className={`${!isMobileOrTablet ? 'mb-4' : 'flex align-center'}`}
            >
              Super Stake
            </Heading>
            {isMobileOrTablet && (
              <ExclusiveCard isDark={isDark}>
                <img src={badgeExclusive} alt="" />
              </ExclusiveCard>
            )}
          </div>
          <Text paddingTop="2" color={isDark ? 'white' : '#737375'}>
            Super Stake is a feature that can harvest all of your FINIX reward to stake in Long-term stake with no
            minimum amount.
          </Text>
          <Text paddingTop="2" color={isDark ? 'white' : '#737375'}>
            You can stake as much as FINIX you prefer under the same lock period <b>within 28 days</b>, your lock period{' '}
            <b>will not be extended.</b>
          </Text>

          <Text className="mt-4" color="textSubtle">
            Please select available duration
          </Text>
          <StakePeriodButton setPeriod={setPeriod} status={status} levelStake={levelStake} isTopUp />
          <div className="flex mt-4">
            <Text className="col-6" color="textSubtle">
              Deposit
            </Text>
            <Text className="col-6 text-right" color="textSubtle">
              Balance: {balanceOf ? numeral(balanceOf).format('0,0.00000') : '-'}
            </Text>
          </div>

          {isMobileOrTablet ? (
            <Balance style={{ flexWrap: 'wrap' }}>
              <NumberInput
                style={{ width: isMobileOrTablet ? '20%' : '45%' }}
                placeholder="0.00"
                value={value}
                onChange={handleChange}
                pattern="^[0-9]*[,]?[0-9]*$"
              />
              {percent !== 1 && (
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
              )}
              <Coin>
                <img src={`/images/coins/${'FINIX'}.png`} alt="" />
                <Heading as="h1" fontSize="16px !important">
                  FINIX
                </Heading>
              </Coin>
            </Balance>
          ) : (
            <Balance>
              <NumberInput
                style={{ width: isMobileOrTablet ? '20%' : '45%' }}
                placeholder="0.00"
                value={value}
                onChange={handleChange}
                pattern="^[0-9]*[,]?[0-9]*$"
              />
              {percent !== 1 && (
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
              )}
              <Coin>
                <img src={`/images/coins/${'FINIX'}.png`} alt="" />
                <Heading as="h1" fontSize="16px !important">
                  FINIX
                </Heading>
              </Coin>
            </Balance>
          )}
          <div className="flex mt-4">
            <Text className="col-6" color={isDark ? 'white' : '#000000'}>
              Estimated Period End
            </Text>
            <Text className="col-6 text-right" color="#30ADFF">
              {date} {date !== '-' && 'GMT+9'}
            </Text>
          </div>
          <div className="flex mt-2">
            <Text className="col-6" color={isDark ? 'white' : '#000000'}>
              vFINIX earn
            </Text>
            <div className="flex flex-row justify-end w-100">
              <Text className="text-right" color="#30ADFF">
                {vFINIX}
              </Text>
              <Text className="text-right ml-1" color={isDark ? 'white' : '#000000'}>
                vFINIX
              </Text>
            </div>
          </div>
          <div className="flex mt-4">
            {!account ? (
              <Button
                fullWidth
                className="align-self-center"
                radii="small"
                onClick={() => {
                  onPresentConnectModal()
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              renderApprovalOrStakeButton()
            )}
          </div>
        </div>
        {!isMobileOrTablet && (
          <BadgeExclusive className="col-4 flex flex-column" style={{ opacity: !isStake || loadings !== '' ? 0.1 : 1 }}>
            <img src={badgeExclusive} alt="" />
            <img src={logoExclusive} alt="" style={{ opacity: '0.6' }} />
          </BadgeExclusive>
        )}
      </FinixStake>
    </div>
  )
}

export default CardSuperStake
