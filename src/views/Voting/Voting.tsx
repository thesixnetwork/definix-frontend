import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'
// import StartVoting from './components/StartVoting'
import VotingDescription from './components/VotingDescription'
import VotingCast from './components/VotingCast'
import VotingList from './components/VotingList'
import VotingDetails from './components/VotingDetails'
import VotingResults from './components/VotingResults'
import VotingPower from './components/VotingPower'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin: auto;
`

const MaxWidthLeft = styled(MaxWidth)`
  max-width: unset;
  margin: 60px 100px;
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
