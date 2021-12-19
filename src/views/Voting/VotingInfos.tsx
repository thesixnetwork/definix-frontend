import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'

import VotingDescription from './components/VotingDescription'
import VotingCast from './components/VotingCast'
import YourVoteList from './components/YourVoteList'
import VotingList from './components/VotingList'
import VotingDetails from './components/VotingDetails'
import VotingResults from './components/VotingResults'
import VotingPower from './components/VotingPower'

const MaxWidthLeft = styled(MaxWidth)`
  max-width: unset;
  margin: 60px 100px;

  ${({ theme }) => theme.mediaQueries.xs} {
    margin: 40px 20px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 60px 100px;
  }
`

interface ValueProps {
  isParticipate?: boolean
}

const VotingInfos: React.FC<ValueProps> = ({ isParticipate }) => {
  const { path } = useRouteMatch()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Voting - Definix - Advance Your Crypto Assets</title>
        </Helmet>
        <MaxWidthLeft>
          <div className={`flex align-stretch mt-5 ${isMobile ? 'flex-wrap' : ''}`}>
            <div className={isMobile ? 'col-12' : 'col-8 mr-2'}>
              <VotingDescription />
              {isParticipate ? <YourVoteList /> : <VotingCast />}
              <VotingList rbAddress />
            </div>
            <div className={isMobile ? 'col-12 mt-5' : 'col-4 ml-3'}>
              <VotingDetails index={1}/>
              <VotingResults />
              <VotingPower />
            </div>
          </div>
        </MaxWidthLeft>
      </Route>
    </>
  )
}

export default VotingInfos
