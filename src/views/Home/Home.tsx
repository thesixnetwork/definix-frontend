import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { useTranslation } from 'react-i18next'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useProfile } from 'state/hooks'
import styled from 'styled-components'
import { useMatchBreakpoints, Box } from 'definixswap-uikit'
import CardTVL from './components/CardTVL'
import CardTweet from './components/CardTweet'
import HomeNotice from './components/Notice'
import CardFinix from './components/CardFinix'
import CardHighAPR from './components/CardHighAPR'
import CardAudit from './components/CardAudit'

const WrapGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 32px;
  grid-template-areas: 
    "notice notice"
    "tvl finix"
    "apr finix"
    "apr tweet"
    "audit tweet";
    "audit";

  ${({ theme }) => theme.mediaQueries.mobile} {
    column-gap: 16px;
    grid-template-areas: 
      "notice"
      "tvl"
      "finix"
      "apr"
      "tweet"
      "audit";
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
`

const Home: React.FC = () => {

  return (
    <>
      <Helmet>
        <title>Home - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <WrapGrid>
        <FullColumnGrid pt="S_30" area="notice">
          <HomeNotice />
        </FullColumnGrid>
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
    </>
  )
}

export default Home
