import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { useProfile } from 'state/hooks'
import styled from 'styled-components'
import { Button, ChevronRightIcon, Heading, Text } from 'uikit-dev'
import CountDownBanner from 'uikit-dev/components/CountDownBanner'
import bg from 'uikit-dev/images/for-ui-v2/bg.png'
import CardAudit from './components/CardAudit'
import CardComingSoon from './components/CardComingSoon'
import CardGetStarted from './components/CardGetStarted'
import CardMyFarmsAndPools from './components/CardMyFarmsAndPools'
import CardTVL from './components/CardTVL'
import CardTweet from './components/CardTweet'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const MaxWidthLeft = styled(MaxWidth)`
  max-width: 1000px;
`

const MaxWidthRight = styled(MaxWidth)`
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`

const LeftPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: ${({ isShowRightPanel }) => (isShowRightPanel ? 'calc(100% - 480px)' : '100%')};
  padding: 32px;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.2s;
`

const RightPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: ${({ isShowRightPanel }) => (isShowRightPanel ? '480px' : '0')};
  padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '40px 32px 32px 32px' : '40px 0 32px 0')};
  position: relative;
  transition: 0.2s;
  transform: ${({ isShowRightPanel }) => (isShowRightPanel ? 'translateX(0)' : 'translateX(100%)')};
  background: ${({ theme }) => theme.colors.backgroundRadial};

  > button {
    position: absolute;
    top: 24px;
    right: 100%;
    background: ${({ theme }) => theme.colors.white};
    border-radius: 0;
    border-top-left-radius: ${({ theme }) => theme.radii.medium};
    border-bottom-left-radius: ${({ theme }) => theme.radii.medium};
    flex-direction: column;
    align-items: center;
    padding: 12px 16px;
    height: auto;
    color: ${({ theme }) => theme.colors.textSubtle};
    box-shadow: ${({ theme }) => theme.shadows.elevation1};

    svg {
      margin: 0 0 8px 0;
    }
  }
`

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
      <div>
        <div className="flex">
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
            <Button
              startIcon={<ChevronRightIcon />}
              variant="tertiary"
              onClick={() => {
                setIsShowRightPanel(!isShowRightPanel)
              }}
            >
              Hide
            </Button>
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
        </div>
      </div>
    </>
  )
}

export default Home
