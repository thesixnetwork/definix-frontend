import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useTradingCompetRegisContract } from 'hooks/useContract'
import _ from 'lodash'
import Page from 'components/layout/Page'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text, useModal, Modal } from 'uikit-dev'
import ConnectModal from 'uikit-dev/widgets/WalletModal/ConnectModal'
import TraderProfileModal from './components/TraderProfileModal'
import TradingChallengeBanner from './components/TradingChallengeBanner'
import Flip from '../../uikit-dev/components/Flip'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Detail = styled.div`
  padding: 48px 32px;

  button {
    max-width: 320px;
    display: block;
    margin: 0 auto 0 auto;
  }
`
const Dot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: ${({ theme }) => theme.radii.circle};
  background: ${({ theme }) => theme.colors.text};
  margin-right: 12px;
`
const Title = styled.div`
  color: #404041;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
`
const CountDownFarm = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  padding: 20px 24px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  strong {
    margin-left: 4px;
    color: #ffd157;
    font-size: 24px;
  }
`
const TradingChallenge = () => {
  const { connect, account } = useWallet()
  const [isTradingEnd, setIsTradingEnd] = useState(false)
  const [isRegisterSuccess, setIsRegisterSuccess] = useState('')
  const [onPresentConnectModal] = useModal(<ConnectModal login={connect} />)
  const [onPresentTraderProfileModal] = useModal(<TraderProfileModal />)

  const tradingCompetRegisContract = useTradingCompetRegisContract()

  useEffect(() => {
    async function checkAccount() {
      await tradingCompetRegisContract.methods
        .traderInfo(account)
        .call()
        .then((data) => {
          const traderAddress = _.get(data, 'traderAddr', '')
          setIsRegisterSuccess(traderAddress)
        })
        .catch((error) => {
          console.log('error = ', error)
        })
    }
    checkAccount()
  }, [account, tradingCompetRegisContract])

  const [isTrade, setIsTrade] = useState(true)
  const tradeTimeStamp = process.env.REACT_APP_TRADE_COMPETITION_TIMESTAMP
    ? parseInt(process.env.REACT_APP_TRADE_COMPETITION_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  // console.log('tradeTimeStamp =', tradeTimeStamp)
  const currentTime = new Date().getTime()
  // console.log('currentTime =', currentTime)
  useEffect(() => {
    if (currentTime < tradeTimeStamp) {
      // console.log('===== if ======', currentTime < tradeTimeStamp)
      setTimeout(() => {
        setIsTrade(true)
      }, tradeTimeStamp - currentTime)
    } else {
      // console.log('===== else ======', currentTime > tradeTimeStamp)
      setIsTrade(true)
    }
  }, [currentTime, tradeTimeStamp])

  const DateModal = ({ date }) => {
    return (
      <div>
        <Title className="text-bold text-center">
          Your wallet has been registered for the tournament. The tournament will be open in
        </Title>
        <Flip date={date} />
      </div>
    )
  }
  const addLeadingZeros = (value) => {
    let val = String(value)
    while (val.length < 2) {
      val = `0${val}`
    }
    return val
  }
  const [timer, setTime] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  })

  const calculateCountdown = (endDate) => {
    let diff = (new Date(endDate).getTime() - new Date().getTime()) / 1000

    // clear countdown when date is reached
    if (diff <= 0) return false

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    }

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400))
      diff -= timeLeft.years * 365.25 * 86400
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400)
      diff -= timeLeft.days * 86400
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600)
      diff -= timeLeft.hours * 3600
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60)
      diff -= timeLeft.min * 60
    }
    timeLeft.sec = Math.floor(diff)

    return timeLeft
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const d = calculateCountdown(tradeTimeStamp)

      if (d) {
        setTime(d)
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [tradeTimeStamp])

  return (
    <Page>
      <MaxWidth>
        <Card isRainbow>
          <TradingChallengeBanner large />
          <Detail>
            <Heading as="h3" className="mb-3">
              Trading Rules:
            </Heading>
            <div className="mb-6">
              <Text lineHeight="2">
                1. The participants must create a new account with 1 $BNB deposit before the beginning of the
                competition.
              </Text>
              <Text lineHeight="2">
                2. The participants are only allowed to swap/farm on specified symbols and exchanges, Pancakeswap and
                Definix swap only. Please see the qualified symbols and exchange on the following list (Refer pic
                1.1–1.2).
              </Text>
              <Text lineHeight="2">
                3. Minimum 5 days of trading (farming is not included) activities are mandatory for qualification.
              </Text>
              <Text lineHeight="2">
                4. Deposit or withdrawal of fund or swap/farm in unspecified symbols of the competition account will not
                be counted toward PnL calculation and will result in disqualification.
              </Text>
              <Text lineHeight="2">
                5. The competition result will be based on the participants’ portfolio percentage gain/loss only and the
                results are final.
              </Text>
            </div>

            <Heading as="h3" className="mb-3">
              Scenarios:
            </Heading>
            <div className="mb-6">
              <Text lineHeight="2">
                <Dot />
                The participants are allowed to use their initial deposited of 1 $BNB as an initial asset inorder to
                perform these actions:{' '}
              </Text>
              <Text lineHeight="2">
                <Dot />
                Trading (swap) : exchange the token other coins based on their strategy on the permitted pool and
                decentralized exchange.{' '}
              </Text>
              <Text lineHeight="2">
                <Dot />
                Staking: The participant put the asset in the permitted pool if the participant staking in the pool that
                is not listed in the rule, the participant will be disqualified
              </Text>
              <Text lineHeight="2" className="ml-6">
                - Single sided pool - stake the asset in the permitted pool to earn more asset given by permitted
                protocol
              </Text>
              <Text lineHeight="2" className="ml-6">
                - Farm - stake LP token to the only permitted farm to earn a reward.
              </Text>
              <Text lineHeight="2">
                <Dot />
                Gas Fee: Please manage your gas well. We do not allow the participants to add any assets from external
                sources, which means the participants can only earn more gas fee from the two actions above. Please note
                that if the participants added more resources in their trading account. The participants’ accounts will
                be automatically disqualified from the tournament.
              </Text>
            </div>

            <Heading as="h3" className="mb-3">
              Reward List:
            </Heading>
            <div className="mb-6">
              <Text lineHeight="2">
                <Dot />
                1st price 1000 $FINIX
              </Text>
              <Text lineHeight="2">
                <Dot />
                2nd price 500 $FINIX
              </Text>
              <Text lineHeight="2">
                <Dot />
                3rd price 300 $FINIX
              </Text>
              <Text lineHeight="2">
                <Dot />
                Top 30 outstanding traders from this tournament will be selected to join the Elite Community of the
                traders and can be joined exclusively by invitation only.
              </Text>
              <Text lineHeight="2">
                <Dot />
                The Elite Community will be the conference point of every trader to share their knowledge, experience,
                and perspective on how to be a better version of a trader that they already are.{' '}
              </Text>
            </div>

            <Heading as="h3" className="mb-3">
              Registration Period:
            </Heading>
            <Text className="mb-6" lineHeight="2">
              12 May 2021, 8:00 A.M. - 14 May 2021, 7:59 A.M. (GMT+0)
            </Text>

            <Heading as="h3" className="mb-3">
              Competition Period:
            </Heading>
            <Text className="mb-6" lineHeight="2">
              14 May 2021, 8:00 A.M. - 23 May 2021, 8:00 A.M. (GMT+0)
            </Text>
            {isRegisterSuccess === account ? (
              <>
                {/* {currentTime < tradeTimeStamp && (
                  <CountDownFarm>
                    <MaxWidth>
                      <p>
                        Definix Farms will be available in{' '}
                        <strong>
                          {addLeadingZeros(timer.hours)}:{addLeadingZeros(timer.min)}:{addLeadingZeros(timer.sec)}
                        </strong>
                      </p>
                    </MaxWidth>
                  </CountDownFarm>
                )} */}
                {/* <DateModal date={tradeTimeStamp} /> */}
                <Button
                  fullWidth
                  variant="success"
                  onClick={() => {
                    onPresentTraderProfileModal()
                  }}
                  disabled={isRegisterSuccess === account}
                >
                  Register Successfully
                </Button>
              </>
            ) : (
              <>
                {!account ? (
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() => {
                      onPresentConnectModal()
                    }}
                  >
                    Connect Wallet
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="success"
                    onClick={() => {
                      onPresentTraderProfileModal()
                    }}
                    disabled={isTradingEnd}
                  >
                    Register
                    {/* {isTradingEnd ? 'Registration successfully' : 'Register'} */}
                  </Button>
                )}
              </>
            )}
          </Detail>
        </Card>
      </MaxWidth>
    </Page>
  )
}

export default TradingChallenge
