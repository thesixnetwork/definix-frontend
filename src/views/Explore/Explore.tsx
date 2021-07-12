import FlexLayout from 'components/layout/FlexLayout'
import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import HelpButton from 'uikit-dev/components/HelpButton'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import ExploreCard from './components/ExploreCard'
import ExploreTabButtons from './components/ExploreTabButtons'
import ExploreDetail from './ExploreDetail'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Explore: React.FC = () => {
  const { path } = useRouteMatch()
  const [listView, setListView] = useState(true)

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Explore - Definix - Advance Your Crypto Assets</title>
        </Helmet>
        <TwoPanelLayout>
          <LeftPanel isShowRightPanel={false}>
            <MaxWidth>
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                    Explore
                  </Heading>

                  <HelpButton
                    size="sm"
                    variant="secondary"
                    className="px-2"
                    startIcon={<HelpCircle className="mr-2" />}
                  >
                    Help
                  </HelpButton>
                </div>
                <Text>
                  You can invest your tokens in our mutual funds on this list. Every fund is administered by a
                  DEFINIX-certified fund manager.
                </Text>
              </div>

              <ExploreTabButtons listView={listView} setListView={setListView} />

              <FlexLayout cols={listView ? 1 : 3}>
                <ExploreCard isHorizontal={listView} />
              </FlexLayout>
            </MaxWidth>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>

      <Route exact path={`${path}/detail`}>
        <ExploreDetail />
      </Route>
    </>
  )
}

export default Explore
