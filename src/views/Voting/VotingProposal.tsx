import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import styled from 'styled-components'
import AddProposal from './components/AddProposal'

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

  return (
    <>
      <Route exact path={path}>
        <MaxWidthLeft>
          <AddProposal />
        </MaxWidthLeft>
      </Route>
    </>
  )
}

export default VotingProposal
