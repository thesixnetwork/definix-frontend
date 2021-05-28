import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { useProfile } from 'state/hooks'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import CountDownBanner from 'uikit-dev/components/CountDownBanner'
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
  border-radius: ${({ theme }) => theme.radii.large};
  display: inline-block;
`

const Home: React.FC = () => {
  const { account } = useWallet()
  const { hasProfile } = useProfile()
  // const TranslateString = useI18n()

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  const [isShowRightPanel, setIsShowRightPanel] = useState(true)

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
          <MaxWidthLeft>
            <div className="mb-5">
              <Heading as="h1" fontSize="32px !important" className="mb-2" textTransform="uppercase">
                Home
              </Heading>
              <Caption>Put your helmet on!! We are going to the MOON!!</Caption>
            </div>

            <CardComingSoon showBtn className="mb-5" />

            <div className="flex align-stretch">
              <div className="col-6 mr-2">
                <CardTVL className="mb-5" />
                <CardAudit />
              </div>
              <div className="col-6 ml-3">
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
                  <Heading className="mb-3" fontSize="18px !important" textTransform="uppercase">
                    My farms & pools
                  </Heading>
                  <CardMyFarmsAndPools />
                </>
              ) : (
                <>
                  <Heading className="mb-3" fontSize="18px !important" textTransform="uppercase">
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
