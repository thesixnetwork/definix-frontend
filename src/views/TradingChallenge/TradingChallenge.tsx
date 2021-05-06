import { useWallet } from '@binance-chain/bsc-use-wallet'
import Page from 'components/layout/Page'
import React from 'react'
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

const TradingChallenge = () => {
  const { connect, account } = useWallet()

  const [onPresentConnectModal] = useModal(<ConnectModal login={connect} />)
  const [onPresentTraderProfileModal] = useModal(<TraderProfileModal />)

  return (
    <Page>
      <MaxWidth>
        <Card isRainbow>
          <TradingChallengeBanner large />
          <Detail>
            <Heading as="h3" className="mb-3">
              Trading Rules
            </Heading>
            <Text className="mb-6" lineHeight="2">
              1. The participants must create a new account with 1 $BNB deposit before the beginning of the competition.
              <br />
              2. The participants are only allowed to swap/farm on specified symbols and exchanges, Pancakeswap and
              Definix only. Please see the qualified symbols and exchange on the following list link <br />
              3. Minimum 5 days of swap/farming activities is mandatory. <br />
              4. Deposit or withdrawal of fund or swap/farm in unspecified symbols of the competition account will not
              be counted toward PnL calculation and will result in a disqualification. <br />
              5. The competition result will be based on the participants’ portfolio percentage gain/loss only and the
              results are final.
            </Text>

            <Heading as="h3" className="mb-3">
              Reward List:
            </Heading>
            <Text className="mb-6" lineHeight="2">
              1st price 300 $FINIX <br />
              2nd price 200 $FINIX <br />
              3rd price 100 $FINIX
            </Text>

            <Heading as="h3" className="mb-3">
              What you need for this competition are:
            </Heading>
            <Text className="mb-6" lineHeight="2">
              1. New decentralized account with 1 $BNB deposit before the competition. <br />
              2. Start trading on the event date.
            </Text>

            <Heading as="h3" className="mb-3">
              Trading Period
            </Heading>
            <Text className="mb-6" lineHeight="2">
              Start from X May 2021 - X May 2021
            </Text>

            <Button
              fullWidth
              variant="success"
              className="btn-secondary-disable"
              onClick={() => {
                if (!account) {
                  onPresentConnectModal()
                } else {
                  onPresentTraderProfileModal()
                }
              }}
            >
              Register
            </Button>
          </Detail>
        </Card>
      </MaxWidth>
    </Page>
  )
}

export default TradingChallenge
