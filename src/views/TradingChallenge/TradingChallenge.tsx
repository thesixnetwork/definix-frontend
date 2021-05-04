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

  const RegisterBtn = () => (
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
  )

  return (
    <Page>
      <MaxWidth>
        <Card isRainbow>
          <TradingChallengeBanner large>
            <RegisterBtn />
          </TradingChallengeBanner>
          <Detail>
            <Heading as="h3" className="mb-3">
              Trading Rules
            </Heading>
            <Text className="mb-6">
              For non-crypto investors, trading cryptocurrencies is difficult and very risky. Liquidity providing &
              farming are much more friendly for new comers. Definix has various pools and farms with fruitful return as
              lower risk choices to start growing crypto assets. Provided liquidity will be fuels to the decentralized
              exchange on the plat
              <br />
              <br />
              For non-crypto investors, trading cryptocurrencies is difficult and very risky. Liquidity providing &
              farming are much more friendly for new comers. Definix has various pools and farms with fruitful return as
              lower risk choices to start growing crypto assets. Provided liquidity will be fuels to the decentralized
              exchange on the plat
            </Text>

            <Heading as="h3" className="mb-3">
              Terms & Conditions
            </Heading>
            <Text className="mb-6">
              For non-crypto investors, trading cryptocurrencies is difficult and very risky. Liquidity providing &
              farming are much more friendly for new comers. Definix has various pools and farms with fruitful return as
              lower risk choices to start growing crypto assets. Provided liquidity will be fuels to the decentralized
              exchange on the plat
              <br />
              <br />
              For non-crypto investors, trading cryptocurrencies is difficult and very risky. Liquidity providing &
              farming are much more friendly for new comers. Definix has various pools and farms with fruitful return as
              lower risk choices to start growing crypto assets. Provided liquidity will be fuels to the decentralized
              exchange on the plat
            </Text>

            <Heading as="h3" className="mb-3">
              Trading Period
            </Heading>
            <Text className="mb-6">Start from 1 May 2021 - 16 May 2021</Text>

            <RegisterBtn />
          </Detail>
        </Card>
      </MaxWidth>
    </Page>
  )
}

export default TradingChallenge
