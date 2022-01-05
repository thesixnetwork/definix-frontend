import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout, MaxWidth } from '../../uikit-dev/components/TwoPanelLayout'
import { Heading } from '../../uikit-dev'

const APRVoting: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Voting - Definix - Advance Your Crypto Assets</title>
        </Helmet>

        <TwoPanelLayout>
          <LeftPanel isShowRightPanel={false}>
            <MaxWidth>
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                    APR Voting
                  </Heading>
                </div>
              </div>
            </MaxWidth>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>
    </>
  )
}

export default APRVoting
