import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Box, useModal, AlertModal } from '@fingerlabs/definixswap-uikit-v2'
import useWallet from 'hooks/useWallet'
import CardTVL from './components/CardTVL'
import CardTweet from './components/CardTweet'
import HomeNotice from './components/Notice'
import CardFinix from './components/CardFinix'
import CardHighAPR from './components/CardHighAPR'
import CardAudit from './components/CardAudit'
import CardInvestment from './components/CardInvestment'
import CardRelease from './components/CardRelease'
import { useTranslation } from 'react-i18next'

const WrapGrid = styled.div<{ isAccount: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 32px;
  padding-bottom: 48px;
  grid-template-areas:
    'notice notice'
    ${({ isAccount }) => isAccount && `"investment investment"`}
    'tvl finix'
    'apr finix'
    'apr release'
    'apr tweet'
    'audit tweet'
    'audit tweet';

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-top: 0;
    padding-bottom: 20px;
    column-gap: 16px;
    grid-template-areas:
      'notice'
      ${({ isAccount }) => isAccount && `"investment"`}
      'tvl'
      'finix'
      'apr'
      'release'
      'audit'
      'tweet';
  }
`

const LeftColumnGrid = styled.div<{ area: string }>`
  grid-area: ${({ area }) => area};
  position: relative;
  grid-column-start: 1;
  grid-column-end: 7;

  > div {
    margin-bottom: 32px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    grid-column-start: 1;
    grid-column-end: 13;

    > div {
      margin-bottom: 20px;
    }
  }
`

const RightColumnGrid = styled.div<{ area: string }>`
  grid-area: ${({ area }) => area};
  position: relative;
  grid-column-start: 7;
  grid-column-end: 13;

  > div {
    margin-bottom: 32px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    grid-column-start: 1;
    grid-column-end: 13;

    > div {
      margin-bottom: 20px;
    }
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
  /** @Todo Rebalancing */
  const { t } = useTranslation()
  const [onPresentAlertModal] = useModal(
    <AlertModal
      title={t('Instant notice')}
      content={t('Maintenance work including smart contract')}
      buttonLabel={t('Confirm')}
      callback={() => {
        return
      }}
    />,
  )

  useEffect(() => {
    onPresentAlertModal()
  }, [])
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
      <RightColumnGrid area="release">
        <CardRelease />
      </RightColumnGrid>
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
