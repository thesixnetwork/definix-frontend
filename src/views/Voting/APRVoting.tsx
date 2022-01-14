import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout, MaxWidth } from '../../uikit-dev/components/TwoPanelLayout'
import { Heading, useMatchBreakpoints } from '../../uikit-dev'
import VotingPowerAPR from './components/VotingPowerAPR'
import VotingPower from './components/VotingPower'
import VotingBalance from './components/VotingBalance'

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

const APRVoting: React.FC = () => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { path } = useRouteMatch()

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Voting - Definix - Advance Your Crypto Assets</title>
        </Helmet>
        <MaxWidthLeft>
          <div className="mb-5">
            <div className="flex align-center mb-2">
              <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                APR Voting
              </Heading>
            </div>
          </div>
          {/* <div className={`flex align-stretch mt-5 ${isMobile ? 'flex-wrap' : ''}`}>
            <div className={isMobile ? 'col-12' : 'col-8 mr-2'}>
              <VotingPowerAPR />
            </div>
            <div className={isMobile ? 'col-12 mt-5' : 'col-4 ml-3'}>
              <VotingPower />
            </div>
          </div> */}
          <VotingBalance />
        </MaxWidthLeft>
      </Route>
    </>
  )
}

export default APRVoting
