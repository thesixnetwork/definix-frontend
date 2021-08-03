import FlexLayout from 'components/layout/FlexLayout'
import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { useRebalances } from 'state/hooks'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import HelpButton from 'uikit-dev/components/HelpButton'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { Rebalance } from '../../state/types'
import ExploreCard from './components/ExploreCard'
import ExploreTabButtons from './components/ExploreTabButtons'
import ExploreDetail from './ExploreDetail'
import Invest from './Invest'
import Withdraw from './Withdraw'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Explore: React.FC = () => {
  const { path } = useRouteMatch()
  const [listView, setListView] = useState(true)
  const [isInvested, setIsInvested] = useState(false)
  const [selectedRebalance, setSelectedRebalance] = useState<Rebalance | undefined>()
  const rebalances = useRebalances()

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
                  You can invest your tokens in our vaults on this list. Every vaults is administered by a
                  DEFINIX-certified vault manager.
                </Text>
              </div>

              <ExploreTabButtons
                listView={listView}
                setListView={setListView}
                isInvested={isInvested}
                setIsInvested={setIsInvested}
              />

              <FlexLayout cols={listView ? 1 : 3}>
                {(rebalances || []).map((rebalance) => {
                  return (
                    <ExploreCard
                      isHorizontal={listView}
                      rebalance={rebalance}
                      onClickViewDetail={() => {
                        setSelectedRebalance(rebalance)
                      }}
                    />
                  )
                })}
              </FlexLayout>
            </MaxWidth>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>

      <Route exact path={`${path}/detail`}>
        <ExploreDetail rebalance={selectedRebalance} />
      </Route>

      <Route exact path={`${path}/invest`}>
        <Invest rebalance={selectedRebalance} />
      </Route>

      <Route exact path={`${path}/withdraw`}>
        <Withdraw rebalance={selectedRebalance} />
      </Route>
    </>
  )
}

export default Explore
