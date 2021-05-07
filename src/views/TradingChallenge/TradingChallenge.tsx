import { useWallet } from '@binance-chain/bsc-use-wallet'
import Page from 'components/layout/Page'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text, useModal } from 'uikit-dev'
import ConnectModal from 'uikit-dev/widgets/WalletModal/ConnectModal'
import TraderProfileModal from './components/TraderProfileModal'
import TradingChallengeBanner from './components/TradingChallengeBanner'

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

const TradingChallenge = () => {
  const { connect, account } = useWallet()
  const [isTradingEnd, setIsTradingEnd] = useState(false)

  const [onPresentConnectModal] = useModal(<ConnectModal login={connect} />)
  const [onPresentTraderProfileModal] = useModal(<TraderProfileModal />)

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

            <Button
              fullWidth
              variant="success"
              onClick={() => {
                if (!account) {
                  onPresentConnectModal()
                } else {
                  onPresentTraderProfileModal()
                }
              }}
              disabled={isTradingEnd}
            >
              {isTradingEnd ? 'Registration is now closed' : 'Register'}
            </Button>
          </Detail>
        </Card>
      </MaxWidth>
    </Page>
  )
}

export default TradingChallenge
