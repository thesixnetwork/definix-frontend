import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useTradingCompetRegisContract } from 'hooks/useContract'
import _ from 'lodash'
import Page from 'components/layout/Page'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text, useMatchBreakpoints, useModal } from 'uikit-dev'
import routeLarge from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-25.png'
import route from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-26.png'
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

const TradingChallenge = () => {
  const { connect, account } = useWallet()
  const [isTradingEnd, setIsTradingEnd] = useState(false)
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false)
  const { isSm } = useMatchBreakpoints()

  const [onPresentConnectModal] = useModal(<ConnectModal login={connect} />)

  const handleModalSuccess = async () => {
    await tradingCompetRegisContract.methods
      .traderInfo(account)
      .call()
      .then((data) => {
        const traderAddress = _.get(data, 'traderAddr', '')
        setIsRegisterSuccess(traderAddress === account)
      })
      .catch((error) => {
        console.log('error = ', error)
      })
  }
  const [onPresentTraderProfileModal] = useModal(<TraderProfileModal onSuccessRefresh={handleModalSuccess} />)
  const tradingCompetRegisContract = useTradingCompetRegisContract()

  useEffect(() => {
    async function checkAccountTradingExists() {
      await tradingCompetRegisContract.methods
        .traderInfo(account)
        .call()
        .then((data) => {
          const traderAddress = _.get(data, 'traderAddr', '')
          setIsRegisterSuccess(traderAddress === account)
        })
        .catch((error) => {
          console.log('error = ', error)
        })
    }
    checkAccountTradingExists()
  }, [account, tradingCompetRegisContract])

  const [isTrade, setIsTrade] = useState(false)
  const tradeTimeStamp = process.env.REACT_APP_TRADE_COMPETITION_TIMESTAMP
    ? parseInt(process.env.REACT_APP_TRADE_COMPETITION_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  const currentTime = new Date().getTime()
  useEffect(() => {
    if (currentTime < tradeTimeStamp) {
      setTimeout(() => {
        setIsTrade(true)
      }, tradeTimeStamp - currentTime)
    } else {
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
                1. The participants must create a new decentralized wallet (not in use before) and deposit 1 BNB net
                cost before registering with the platform.
              </Text>
              <Text lineHeight="2" className="ml-6">
                - One participant is allowed to have more than one decentralized wallet registered for the trading
                tournament. Each account must deposit a net cost of 1 BNB initial for participating.
              </Text>
              <Text lineHeight="2" className="ml-6">
                - The final results after the trading period ended will be calculated
              </Text>
              <Text lineHeight="2">
                2. The participants are only allowed to swap/farm on specified symbols and exchanges, Pancakeswap and
                Definix swap only. Please see the qualified symbols and exchanges on the following list.
              </Text>
              <img
                src={isSm ? route : routeLarge}
                alt=""
                className="my-5 mx-auto"
                style={{ display: 'block', width: '100%', maxWidth: '800px' }}
              />
              <Text lineHeight="2">
                3. A minimum of 5 days of trading activities is mandatory for qualification. Staying in the farm with no
                movement will not be account for trading. (Must be active 5 out of 10 days; in/out farm(s) during the
                period).
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
                The participants are allowed to use 1 BNB as an initial asset in order to perform these actions:
              </Text>
              <Text lineHeight="2">
                <Dot />
                Trading (swap): Exchange the token for other coins based on their strategy on the permitted pool and
                decentralized exchange.
              </Text>
              <Text lineHeight="2">
                <Dot />
                Staking: The participant put the asset in the permitted pool if the participant staking in the pool that
                is not listed in the rule, the participant will be disqualified
              </Text>
              <Text lineHeight="2" className="ml-6">
                - Single-sided pool: Stake the asset in the permitted pool to earn more asset given by permitted
                protocol.
              </Text>
              <Text lineHeight="2" className="ml-6">
                - Farm: Stake LP token to the only permitted farm to earn a reward.
              </Text>
              <Text lineHeight="2">
                <Dot />
                Gas Fee: Please manage your gas well. We do not allow the participants to top-up any assets from
                external sources, which means the participants can only earn more gas fees from the two actions above.
              </Text>
              <Text lineHeight="2">
                <b className="mr-2">**NOTE**</b>
                Topping up more resources to the trading account will automatically result in disqualification and
                banned from this tournament.
              </Text>
            </div>

            <Heading as="h3" className="mb-3">
              Reward List:
            </Heading>
            <div className="mb-6">
              <Text lineHeight="2">
                <Dot />
                1st Winning Price 1000 $FINIX
              </Text>
              <Text lineHeight="2">
                <Dot />
                2nd Winning Price 500 $FINIX
              </Text>
              <Text lineHeight="2">
                <Dot />
                3rd Winning Price 300 $FINIX
              </Text>
              <Text lineHeight="2">
                <Dot />
                Top 30 outstanding traders from this tournament will be selected to join the Elite Community of the
                traders and can be joined exclusively by invitation only.
              </Text>
              <Text lineHeight="2">
                <Dot />
                The Elite Community will be the conference point of every trader to share their knowledge, experience,
                and perspective on how to be a better version of a trader that they already are.
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
            {isRegisterSuccess ? (
              <>{!isTrade && <DateModal date={tradeTimeStamp} />}</>
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
