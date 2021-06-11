import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useProfile } from 'state/hooks'
import styled from 'styled-components'
import { Heading, Text, useMatchBreakpoints } from 'uikit-dev'
import CountDownBanner from 'uikit-dev/components/CountDownBanner'
import { Overlay } from 'uikit-dev/components/Overlay'
import {
  LeftPanel,
  MaxWidthLeft,
  MaxWidthRight,
  RightPanel,
  ShowHideButton,
  TwoPanelLayout,
} from 'uikit-dev/components/TwoPanelLayout'
import CardAudit from './components/CardAudit'
import CardComingSoon from './components/CardComingSoon'
import CardGetStarted from './components/CardGetStarted'
import CardMyFarmsAndPools from './components/CardMyFarmsAndPools'
import CardTVL from './components/CardTVL'
import CardTweet from './components/CardTweet'

const Caption = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.primary};
  padding: 4px 16px;
  border-radius: ${({ theme }) => theme.radii.card};
  display: inline-block;
`

const Home: React.FC = () => {
  const { isXl } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl

  const { account } = useWallet()
  const { hasProfile } = useProfile()
  // const TranslateString = useI18n()

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  const [isShowRightPanel, setIsShowRightPanel] = useState(!isMobileOrTablet)

  useEffect(() => {
    if (isMobileOrTablet) {
      setIsShowRightPanel(false)
    }
  }, [isMobileOrTablet])

  useEffect(() => {
    return () => {
      setIsShowRightPanel(true)
    }
  }, [])

  return (
    <>
      <CountDownBanner title="Definix Farms will be available in" endTime={phrase2TimeStamp} />
      <TwoPanelLayout>
        <LeftPanel isShowRightPanel={isShowRightPanel}>
          <Overlay
            show={isShowRightPanel && isMobileOrTablet}
            style={{ position: 'absolute', zIndex: 1 }}
            onClick={() => {
              setIsShowRightPanel(false)
            }}
          />
          <MaxWidthLeft>
            <div className="mb-5">
              <Heading as="h1" fontSize="32px !important" className="mb-2" textTransform="uppercase">
                Home
              </Heading>
              <Caption>Put your helmet on!! We are going to the MOON!!</Caption>
            </div>

            <CardComingSoon showBtn className="mb-5" />

            <div className={`flex align-stretch ${isMobileOrTablet ? 'flex-wrap' : ''}`}>
              <div className={isMobileOrTablet ? 'col-12' : 'col-6 mr-2'}>
                <CardTVL className="mb-5" />
                <CardAudit />
              </div>
              <div className={isMobileOrTablet ? 'col-12 mt-5' : 'col-6 ml-3'}>
                <CardTweet />
              </div>
            </div>
          </MaxWidthLeft>
        </LeftPanel>

        <RightPanel isShowRightPanel={isShowRightPanel}>
          <ShowHideButton
            isShow={isShowRightPanel}
            action={() => {
              setIsShowRightPanel(!isShowRightPanel)
            }}
          />

          {isShowRightPanel && (
            <MaxWidthRight>
              {account && !hasProfile ? (
                <>
                  <Heading className="mb-3" fontSize="20px !important" textTransform="uppercase">
                    My farms & pools
                  </Heading>

                  <CardMyFarmsAndPools />
                </>
              ) : (
                <>
                  <Heading className="mb-3" fontSize="20px !important" textTransform="uppercase">
                    TUTORIALS
                  </Heading>
                  <CardGetStarted />
                </>
              )}
            </MaxWidthRight>
          )}
        </RightPanel>
      </TwoPanelLayout>
    </>
  )
}

export default Home
