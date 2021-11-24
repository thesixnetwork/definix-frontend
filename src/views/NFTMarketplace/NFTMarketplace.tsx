import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { Heading, Text, Link, Button } from 'uikit-dev'
import styled from 'styled-components'
import Marketplace from './Marketplace'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const NFTMarketplace: React.FC = () => {
  const { path } = useRouteMatch()
  const [isOpenModal, setIsOpenModal] = useState(false)

  console.log('path', path)

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>NFT - Definix - Advance Your Crypto Assets</title>
        </Helmet>

        <TwoPanelLayout style={{ display: isOpenModal ? 'none' : 'block' }}>
          <LeftPanel isShowRightPanel={false}>
            <MaxWidth>
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                    NFT Marketplace
                  </Heading>
                </div>
                <Button>My NFT</Button>
                <Button className="ml-2">Marketplace</Button>
              </div>
            </MaxWidth>
            <Route exact path={`${path}/market-place`}>
              <Marketplace />
            </Route>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>
    </>
  )
}

export default NFTMarketplace
