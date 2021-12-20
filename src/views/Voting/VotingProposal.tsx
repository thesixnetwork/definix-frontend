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
        </MaxWidthLeft>
      </Route>
    </>
  )
}

export default VotingProposal
