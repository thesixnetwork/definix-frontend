import React from 'react'
import styled from 'styled-components'
import { Box } from '@fingerlabs/definixswap-uikit-v2'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import CardTVL from './components/CardTVL'
import CardTweet from './components/CardTweet'
import HomeNotice from './components/Notice'
import CardFinix from './components/CardFinix'
import CardHighAPR from './components/CardHighAPR'
import CardAudit from './components/CardAudit'
import CardInvestment from './components/CardInvestment'

const WrapGrid = styled.div<{ isAccount: boolean }>`
  position: relative;
  display: grid;
  padding-top: 30px;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 32px;
  grid-template-areas:
    'notice notice'
    ${({ isAccount }) => isAccount && `"investment investment"`}
    'tvl finix'
    'apr finix'
    'apr tweet'
    'apr tweet'
    'audit tweet';

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-top: 0;
    column-gap: 16px;
    grid-template-areas:
      'notice'
      ${({ isAccount }) => isAccount && `"investment"`}
      'tvl'
      'finix'
      'apr'
      'audit'
      'tweet';
  }
`

const LeftColumnGrid = styled.div<{ area: string }>`
  grid-area: ${({ area }) => area};
  position: relative;
  grid-column-start: 1;
  grid-column-end: 7;

  ${({ theme }) => theme.mediaQueries.mobile} {
    grid-column-start: 1;
    grid-column-end: 13;
  }

  > div {
    margin-bottom: 32px;
  }
`

const RightColumnGrid = styled.div<{ area: string }>`
  grid-area: ${({ area }) => area};
  position: relative;
  grid-column-start: 7;
  grid-column-end: 13;

  ${({ theme }) => theme.mediaQueries.mobile} {
    grid-column-start: 1;
    grid-column-end: 13;
  }

  > div {
    margin-bottom: 32px;
  }
`

const FullColumnGrid = styled(Box)<{ area: string }>`
  grid-area: ${({ area }) => area};
  position: relative;
  grid-column-start: 1;
  grid-column-end: 13;
  // padding-top: 30px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    // padding-top: 28px;
  }
`

const Home: React.FC = () => {
  const { account } = useWallet()
  return (
    <WrapGrid isAccount={!!account}>
      <FullColumnGrid area="notice">
        <HomeNotice />
      </FullColumnGrid>
      {account && (
        <FullColumnGrid mb="S_40" area="investment">
          <CardInvestment />
        </FullColumnGrid>
      )}
      <LeftColumnGrid area="tvl">
        <CardTVL />
      </LeftColumnGrid>
      <RightColumnGrid area="finix">
        <CardFinix />
      </RightColumnGrid>
      <LeftColumnGrid area="apr">
        <CardHighAPR />
      </LeftColumnGrid>
      <RightColumnGrid area="tweet">
        <CardTweet />
      </RightColumnGrid>
      <LeftColumnGrid area="audit">
        <CardAudit />
      </LeftColumnGrid>
    </WrapGrid>
  )
}

export default Home
