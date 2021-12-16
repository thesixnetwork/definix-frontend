import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'

import AddProposal from './components/AddProposal'
import AddChoices from './components/AddChoices'
// import AddActions from './components/AddActions'
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

const VotingProposal: React.FC = () => {
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
          <AddProposal />
          <div className={`flex align-stretch mt-1 ${isMobile ? 'flex-wrap' : ''}`}>
            <div className={isMobile ? 'col-12' : 'col-8 mr-2'}>
              <AddChoices />
            </div>
            <div className={isMobile ? 'col-12 mt-2' : 'col-4 ml-3'}>
              <VotingPower />
            </div>
          </div>
        </MaxWidthLeft>
      </Route>
    </>
  )
}

export default VotingProposal
