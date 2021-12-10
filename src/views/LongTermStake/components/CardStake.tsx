import React, { useState, useEffect, useCallback } from 'react'
import Lottie from 'react-lottie'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import moment from 'moment'
import { Card, Button, useMatchBreakpoints, Text, Heading, useModal } from 'uikit-dev'
import success from 'uikit-dev/animation/complete.json'
import loading from 'uikit-dev/animation/farmPool.json'
import ConnectModal from 'uikit-dev/widgets/WalletModal/ConnectModal'
import definixLongTerm from 'uikit-dev/images/for-ui-v2/long-term-stake-opacity.png'
import badgeLock from 'uikit-dev/images/for-ui-v2/badge-lock.png'
import * as klipProvider from '../../../hooks/klipProvider'
import { useBalances, useAllowance, useLock, useApprove, useAllLock, useApr } from '../../../hooks/useLongTermStake'
import StakePeriodButton from './StakePeriodButton'
import LongTermTab from './LongTermTab'

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

const APRBOX = styled.div`
  position: relative;
  text-align: center;
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

const Apr = styled(Text)`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  line-height: 1;
  font-weight: 500;
  // font-size: 28px;
  text-shadow: #00000050 0px 2px 4px;
`

const AprValue = styled(Text)`
  position: absolute;
  // top: 56%;
  // left: 50%;
  transform: translate(-50%, -50%);
  line-height: 1;
  font-weight: 600;
  text-shadow: #00000050 0px 2px 4px;
`

const AprBox = styled(Card)`
  padding: 0.5rem;
  background: linear-gradient(90deg, #0973b9, #5cc096);
  opacity: 1;
  background-size: cover;
  background-repeat: no-repeat;
  margin-left: 0.5rem !important;
  right: 0;
  color: #30adff;
  position: relative;
  box-shadow: unset;
  border-radius: 4px;
  text-align: center;

  a {
    display: block;
  }
`

const CardStake = ({ isShowRightPanel }) => {
  const [period, setPeriod] = useState(0)
  const { isDark } = useTheme()
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl && !isMd && !isLg
  const { connect, account } = useWallet()
  const [date, setDate] = useState('-')
  const [onPresentConnectModal] = useModal(<ConnectModal login={connect} />)
  const balanceOf = useBalances()
  const allowance = useAllowance()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const { allLockPeriod } = useAllLock()
  const [value, setValue] = useState('')
  const [letvel, setLevel] = useState(0)
  const [vFINIX, setVFINIX] = useState(0)
  const [days, setdays] = useState(28)
  const [percentPenalty, setPercentPenalty] = useState(0)
  const [lockFinix, setLockFinix] = useState('')
  const [click, setClick] = useState(false)
  const [percent, setPercent] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [flgTextWarning, setFlgTextWarning] = useState('')
  const [flgButton, setFlgButton] = useState('')
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const { onApprove } = useApprove(klipProvider.MAX_UINT_256_KLIP)
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
  const minimum = _.get(allLockPeriod, '0.minimum')
  const periodEnd = _.get(allLockPeriod, '0.periodMap')
  const apr = useApr()
  const realPenaltyRate = _.get(allLockPeriod, '0.realPenaltyRate')

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
      setPercentPenalty(_.get(realPenaltyRate, '0') * 100)
      setLevel(0)
      setdays(7)
      setDate(moment(nd).format(`DD-MMM-YYYY HH:mm:ss`))
    } else if (period === 2) {
      nd.setDate(nd.getDate() + 180)
      nd = new Date(nd)
      setPercentPenalty(_.get(realPenaltyRate, '1') * 100)
      setLevel(1)
      setdays(14)
      setDate(moment(nd).format(`DD-MMM-YYYY HH:mm:ss`))
    } else if (period === 4) {
      nd.setDate(nd.getDate() + 365)
      nd = new Date(nd)
      setPercentPenalty(_.get(realPenaltyRate, '2') * 100)
      setLevel(2)
      setdays(28)
      setDate(moment(nd).format(`DD-MMM-YYYY HH:mm:ss`))
    }
    setVFINIX(numeral(Number(value.replace(',', '')) * period).format('0,0.00'))
    setLockFinix(new BigNumber(parseFloat(value)).times(new BigNumber(10).pow(18)).toFixed())
  }, [period, value, periodEnd, allLockPeriod, realPenaltyRate])

  const { onStake, status, loadings } = useLock(letvel, lockFinix, click)
  useEffect(() => {
    if (status) {
      setVFINIX(0)
      setValue('')
      setDate('-')
      // setPeriod(0)
    }
  }, [status])

  const hadleTxtWarning = useCallback(() => {
    setFlgTextWarning('')
    if (period === 1 && Number(value) < _.get(minimum, '0') && value !== '') {
      setFlgTextWarning('minimum')
    }
    if (period === 2 && Number(value) < _.get(minimum, '1') && value !== '') {
      setFlgTextWarning('minimum')
    }
    if (period === 4 && Number(value) < _.get(minimum, '2') && value !== '') {
      setFlgTextWarning('minimum')
    }

    if (period === 1 && Number(value) >= _.get(minimum, '0') && value !== '') {
      setFlgTextWarning('stake')
    }

    if (period === 2 && Number(value) >= _.get(minimum, '1') && value !== '') {
      setFlgTextWarning('stake')
    }
    if (period === 4 && Number(value) >= _.get(minimum, '2') && value !== '') {
      setFlgTextWarning('stake')
    }
  }, [period, value, minimum])

  const hadleStakeButton = useCallback(() => {
    setFlgButton('enter amount')
    setIsDisabled(true)
    if (Number(value) > Number(balanceOf)) {
      setFlgButton('insufficient')
      setIsDisabled(false)
    } else if (period === 1 && Number(value) >= _.get(minimum, '0') && value !== '') {
      setFlgButton('')
      setIsDisabled(false)
    } else if (period === 2 && Number(value) >= _.get(minimum, '1') && value !== '') {
      setFlgButton('')
      setIsDisabled(false)
    } else if (period === 4 && Number(value) >= _.get(minimum, '2') && value !== '') {
      setFlgButton('')
      setIsDisabled(false)
    } else if (period === 1 && Number(value) < _.get(minimum, '0') && value !== '') {
      setFlgButton('')
      setIsDisabled(true)
    } else if (period === 2 && Number(value) < _.get(minimum, '1') && value !== '') {
      setFlgButton('')
      setIsDisabled(true)
    } else if (period === 4 && Number(value) < _.get(minimum, '2') && value !== '') {
      setFlgButton('')
      setIsDisabled(true)
    }
  }, [value, period, minimum, balanceOf])

  const hadleInsufficient = useCallback(() => {
    setFlgButton('insufficient')
  }, [])

  useEffect(() => {
    hadleTxtWarning()
    if (Number(balanceOf) <= 0) {
      hadleInsufficient()
    } else {
      hadleStakeButton()
    }
  }, [value, period, balanceOf, minimum, hadleTxtWarning, hadleStakeButton, hadleInsufficient])

  const renderStakeDOrStake = () => {
    return (
      <Button fullWidth disabled={isDisabled} className="align-self-center" radii="small" onClick={onStake}>
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
      setRequestedApproval(true)
      const txHash = await onApprove()
      if (txHash) {
        setTransactionHash(_.get(txHash, 'transactionHash'))
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  const handleBalance = () => {
    let text
    if (flgTextWarning === 'stake') {
      text = (
        <Text className="mt-2" fontSize="10px !important" color={isDark ? 'white' : 'textSubtle'}>
          {vFINIX} vFINIX will be received and the staking period will end in {date} GMT+9. Unstaking before the period
          ends your FINIX amount will be locked {days} days and {percentPenalty}% will be deducted from total balance.
        </Text>
      )
    }
    if (flgTextWarning === 'minimum') {
      text = (
        <Text className="mt-2" fontSize="10px !important" color="red">
          The amount of FINIX you are about to stake doesn&apos;t reach the minimum requirement.
        </Text>
      )
    }
    return text
  }

  return (
    <div className="align-stretch mt-5">
      <LongTermTab current="/long-term-stake" />
      <FinixStake className="flex">
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
          style={{ opacity: loadings !== '' ? 0.1 : 1 }}
          className={`${!isMobileOrTablet ? 'col-8' : 'col-12 pr-5'} py-5 pl-5`}
        >
          <div className={`${!isMobileOrTablet ? '' : 'flex align-items-center mb-3'}`}>
            <Heading
              as="h1"
              fontSize={`${isMobileOrTablet ? '16px !important' : '18px !important'}`}
              className={`${!isMobileOrTablet ? 'mb-4' : 'flex align-center'}`}
            >
              Stake FINIX get vFINIX
            </Heading>
            {isMobileOrTablet && (
              <AprBox>
                <Text color="white" bold fontSize="8px !important">
                  APR up to {`${numeral(apr * 4 || 0).format('0,0.[00]')}%`}
                </Text>
              </AprBox>
            )}
          </div>
          <Text color="textSubtle">Please select duration</Text>
          <StakePeriodButton setPeriod={setPeriod} status={status} levelStake={[]} isTopUp={false} harvestProgress={-1} />
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
          {handleBalance()}
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
          <div
            style={{ opacity: loadings !== '' ? 0.1 : 1, justifyContent: 'space-between' }}
            className="col-4 flex flex-column"
          >
            <APRBOX className="px-5 mb-2">
              <img src={badgeLock} alt="" />
              <Apr fontSize={isShowRightPanel ? '1.2vw !important' : '1.2vw !important'} color="white">
                APR up to
              </Apr>
              <AprValue
                style={{ left: isShowRightPanel ? '50%' : '50%', top: isShowRightPanel ? '52%' : '52%' }}
                fontSize={isShowRightPanel ? '2.2vw !important' : '2.2vw !important'}
                color="white"
              >{`${numeral(apr * 4 || 0).format('0,0.[00]')}%`}</AprValue>
            </APRBOX>
            <img src={definixLongTerm} alt="" className="pl-3 pb-5" />
          </div>
        )}
      </FinixStake>
    </div>
  )
}

export default CardStake
