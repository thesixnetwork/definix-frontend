import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout, MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import styled from 'styled-components'
import { Heading, useMatchBreakpoints, Text, Link } from 'uikit-dev'
// import StartVoting from './components/StartVoting'
import CardVoting from './components/CardVoting'
import StartVoting from './components/StartVoting'
import VotingDescription from './components/VotingDescription'
import VotingCast from './components/VotingCast'
import VotingList from './components/VotingList'
import VotingDetails from './components/VotingDetails'
import VotingResults from './components/VotingResults'
import VotingPower from './components/VotingPower'

// const MaxWidth = styled.div`
//   max-width: 1280px;
//   margin: auto;
// `

const MaxWidthLeft = styled(MaxWidth)`
  max-width: unset;
  margin: 60px 100px;
`

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const Voting: React.FC = () => {
  const { path } = useRouteMatch()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  // const isMobile = !isXl && !isLg
  const [isShowRightPanel, setIsShowRightPanel] = useState(!isMobile)
  const [listView, setListView] = useState(true)

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Voting - Definix - Advance Your Crypto Assets</title>
        </Helmet>

        {/* <StartVoting /> */}
        <TwoPanelLayout>
          <LeftPanel isShowRightPanel={false}>
            <MaxWidth>
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                    Voting
                  </Heading>
                  <div className="mt-2 flex align-center justify-center">
                    <Text paddingRight="1">I’m new to this,</Text>
                    <TutorailsLink
                      href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/long-term-staking-pool/how-to-stake-in-long-term-staking-pool"
                      target="_blank"
                    >
                      How to stake.
                    </TutorailsLink>
                  </div>
                </div>
                <CardVoting />
              </div>
            </MaxWidth>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>

      <Route exact path={`${path}/detail`}>
        <MaxWidthLeft>
          <div className={`flex align-stretch mt-5 ${isMobile ? 'flex-wrap' : ''}`}>
            <div className={isMobile ? 'col-12' : 'col-8 mr-2'}>
              <VotingDescription />
              <VotingCast />
              <VotingList rbAddress />
            </div>
            <div className={isMobile ? 'col-12 mt-5' : 'col-4 ml-3'}>
              <VotingDetails />
              <VotingResults />
              <VotingPower />
            </div>
          </div>
        </MaxWidthLeft>
      </Route>
    </>
  )
}

export default Voting
