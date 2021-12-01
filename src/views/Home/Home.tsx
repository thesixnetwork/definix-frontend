import { useWallet } from '@binance-chain/bsc-use-wallet'
import axios from 'axios'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
// import { useProfile } from 'state/hooks'
import styled from 'styled-components'
import { Heading, Skeleton, Text, useMatchBreakpoints } from 'uikit-dev'
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
import CardAutoRebalancing from './components/CardAutoRebalancing'
import CardGetStarted from './components/CardGetStarted/CardGetStarted'
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

const CustomTab = styled.div`
  display: flex;

  h2 {
    cursor: pointer;
    position: relative;

    &:before {
      content: '';
      width: 100%;
      height: 2px;
      background: ${({ theme }) => theme.colors.primary};
      position: absolute;
      bottom: -4px;
      left: 0;
      opacity: 0;
      transition: 0.2s;
    }

    &.current:before {
      opacity: 1;
    }
  }
`

const Home: React.FC = () => {
  const { isXl } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl
  const [isLoading, setIsLoading] = useState(false)
  const [isViewTurial, setIsViewTurial] = useState(false)
  const [isShowRightPanel, setIsShowRightPanel] = useState(!isMobileOrTablet)
  const themes = useTheme()
  const TranslateString = useI18n()

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const { account } = useWallet()
  // const { hasProfile } = useProfile()
  // const TranslateString = useI18n()

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  useEffect(() => {
    if (isMobileOrTablet) {
      setIsShowRightPanel(false)
    }
  }, [isMobileOrTablet])

  useEffect(() => {
    if (!account) {
      setIsViewTurial(true)
    }
  }, [account])

  useEffect(() => {
    return () => {
      setIsShowRightPanel(true)
      setIsViewTurial(false)
    }
  }, [])

  const [captionText, setCaptionText] = React.useState()
  useEffect(() => {
    async function fetchCaptionText() {
      const captionTextAPI = process.env.REACT_APP_API_CAPTION_TEXT_BSC
      const response = await axios.get(`${captionTextAPI}`)
      if (response.data.data) {
        const caption = _.get(response.data.data, 'data.0.text', '')
        setCaptionText(caption)
      }
    }
    fetchCaptionText()
  }, [])

  return (
    <>
      <Helmet>
        <title>Home - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <CountDownBanner title="Definix Farms will be available in" endTime={phrase2TimeStamp} />
      <TwoPanelLayout>
        <LeftPanel isShowRightPanel={isShowRightPanel}>
          <Overlay
            show={isShowRightPanel && isMobileOrTablet}
            style={{ position: 'absolute', zIndex: 2 }}
            onClick={() => {
              setIsShowRightPanel(false)
            }}
          />
          <MaxWidthLeft>
            <div className="mb-5">
              <Heading as="h1" fontSize="32px !important" className="mb-2" textTransform="uppercase">
                {TranslateString(190, 'Home')}
              </Heading>
              {isLoading ? (
                <Skeleton
                  animation="pulse"
                  variant="rect"
                  height="29px"
                  width="60%"
                  style={{ background: themes.theme.colors.primary, borderRadius: themes.theme.radii.card }}
                />
              ) : (
                <Caption>{captionText}</Caption>
              )}
            </div>

            <CardAutoRebalancing />

            <div className={`flex align-stretch mt-5 ${isMobileOrTablet ? 'flex-wrap' : ''}`}>
              <div className={isMobileOrTablet ? 'col-12' : 'col-6 mr-2'}>
                <CardTVL className="mb-5 mt-6" />
                <CardAudit />
              </div>
              <div className={isMobileOrTablet ? 'col-12 mt-5' : 'col-6 ml-3'}>
                <CardTweet className="mb-5 mt-6" />
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
              <CustomTab className="mb-4">
                {account && (
                  <Heading
                    fontSize="18px !important"
                    textTransform="uppercase"
                    className={`mr-3 ${!isViewTurial ? 'current' : ''}`}
                    onClick={() => {
                      setIsViewTurial(false)
                    }}
                  >
                    My investments
                  </Heading>
                )}

                <Heading
                  fontSize="18px !important"
                  textTransform="uppercase"
                  className={isViewTurial || !account ? 'current' : ''}
                  onClick={() => {
                    setIsViewTurial(true)
                  }}
                >
                  TUTORIALS
                </Heading>
              </CustomTab>

              {account && !isViewTurial ? <CardMyFarmsAndPools /> : <CardGetStarted />}
            </MaxWidthRight>
          )}
        </RightPanel>
      </TwoPanelLayout>
    </>
  )
}

export default Home
