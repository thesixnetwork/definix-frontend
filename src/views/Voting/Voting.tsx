import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout, MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import { Heading } from 'uikit-dev'
import CardVoting from './components/CardVoting'
import VotingInfos from './VotingInfos'
import VotingProposal from './VotingProposal'

const Voting: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <Route exact path={path}>
        {/* <StartVoting /> */}
        <TwoPanelLayout>
          <LeftPanel isShowRightPanel={false}>
            <MaxWidth>
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                    Voting
                  </Heading>
                  {/* <div className="mt-2 flex align-center justify-center">
                    <Text paddingRight="1">I’m new to this,</Text>
                    <TutorailsLink
                      href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/long-term-staking-pool/how-to-stake-in-long-term-staking-pool"
                      target="_blank"
                    >
                      How to stake.
                    </TutorailsLink>
                  </div> */}
                </div>
                <CardVoting />
              </div>
            </MaxWidth>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>

      <Route exact path={`${path}/detail/:id/:proposalIndex`}>
        <VotingInfos isParticipate={false} />
      </Route>

      <Route exact path={`${path}/participate/:id/:proposalIndex`}>
        <VotingInfos isParticipate />
      </Route>

      <Route exact path={`${path}/make-proposal`}>
        <VotingProposal />
      </Route>
    </>
  )
}

export default Voting
