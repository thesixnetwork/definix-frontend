import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import {
  LeftPanel,
  TwoPanelLayout,
  RightPanel,
  ShowHideButton,
  MaxWidthRight,
  MaxWidthLeft,
} from 'uikit-dev/components/TwoPanelLayout'
import { Overlay } from 'uikit-dev/components/Overlay'
import { Heading, useMatchBreakpoints, Text, Link } from 'uikit-dev'
import styled from 'styled-components'
import StakeTable from './components/StakeTeble'
import CardStake from './components/CardStake'
import CardWhatIs from './components/CardWhatIs'
import Unstake from './Unstake'
import CardSuperStake from './CardSuperStake'

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const LongTermStake: React.FC = () => {
  const { path } = useRouteMatch()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl
  const isMobile = !isXl && !isLg && !isMd
  const [isViewTurial, setIsViewTurial] = useState(false)
  const [isShowRightPanel, setIsShowRightPanel] = useState(!isMobileOrTablet)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()

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

  const handlePresent = useCallback((node: React.ReactNode) => {
    setModalNode(node)
    setIsOpenModal(true)
    window.scrollTo(0, 0)
  }, [])

  const handleDismiss = useCallback(() => {
    setModalNode(undefined)
    setIsOpenModal(false)
  }, [])

  return (
    <>
      <Route exact path="/long-term-stake">
        <Helmet>
          <title>Long-term Stake - Definix - Advance Your Crypto Assets</title>
        </Helmet>
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
                <div className={isMobile ? 'mb-2' : 'flex align-center mb-2'}>
                  <Heading
                    as="h1"
                    fontSize={isMobile ? '28px !important' : '32px !important'}
                    className={isMobile ? 'mr-3' : 'mr-3 text-center'}
                  >
                    Long-term Stake
                  </Heading>
                  <div className="mt-2 flex align-center">
                    <Text paddingRight="1">I’m new to this,</Text>
                    <TutorailsLink
                      href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/long-term-staking-pool/how-to-stake-in-long-term-staking-pool"
                      target="_blank"
                    >
                      How to stake.
                    </TutorailsLink>
                  </div>
                </div>
                <Route exact path="/long-term-stake">
                  <CardStake isShowRightPanel={isShowRightPanel} />
                </Route>
                <Route exact path="/long-term-stake/top-up">
                  <CardSuperStake />
                </Route>
                <StakeTable />
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
                <Heading
                  fontSize="18px !important"
                  textTransform="uppercase"
                  className={`mr-3 ${!isViewTurial ? 'current' : ''} mb-4`}
                  onClick={() => {
                    setIsViewTurial(false)
                  }}
                >
                  What is long-term stake?
                </Heading>
                <CardWhatIs />
              </MaxWidthRight>
            )}
          </RightPanel>
        </TwoPanelLayout>
      </Route>

      <Route exact path="/long-term-stake/top-up">
        <Helmet>
          <title>Long-term Stake - Definix - Advance Your Crypto Assets</title>
        </Helmet>
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
                <div className={`${!isMobile ? 'flex align-center mb-2' : 'mb-2'}`}>
                  <Heading as="h1" fontSize="32px !important" className="mr-3">
                    Long-term Stake
                  </Heading>
                  <div className="mt-2 flex align-center">
                    <Text paddingRight="1">I’m new to this,</Text>
                    <TutorailsLink
                      href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/long-term-staking-pool/how-to-stake-in-long-term-staking-pool"
                      target="_blank"
                    >
                      How to stake.
                    </TutorailsLink>
                  </div>
                </div>
                <Route exact path="/long-term-stake">
                  <CardStake isShowRightPanel={isShowRightPanel} />
                </Route>
                <Route exact path="/long-term-stake/top-up">
                  <CardSuperStake />
                </Route>
                <StakeTable />
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
                <Heading
                  fontSize="18px !important"
                  textTransform="uppercase"
                  className={`mr-3 ${!isViewTurial ? 'current' : ''} mb-4`}
                  onClick={() => {
                    setIsViewTurial(false)
                  }}
                >
                  What is long-term stake?
                </Heading>
                <CardWhatIs />
              </MaxWidthRight>
            )}
          </RightPanel>
        </TwoPanelLayout>
      </Route>
      <Route exact path={`${path}/unstake`}>
        <Unstake />
      </Route>
    </>
  )
}

export default LongTermStake
