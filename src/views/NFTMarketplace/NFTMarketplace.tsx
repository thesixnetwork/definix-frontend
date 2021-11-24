import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { Heading, Button } from 'uikit-dev'
import styled from 'styled-components'
import CardMarketplace from './components/CardMarketplace'
import CardMyNFT from './components/CardMyNFT'

const MaxWidth = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const NFTMarketplace: React.FC = () => {
  const { path } = useRouteMatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selected, setSelected] = useState(true)

  useEffect(() => {
    return () => {
      setSelected(true)
    }
  }, [])

  return (
    <>
      <Route exact>
        <Helmet>
          <title>NFT - Definix - Advance Your Crypto Assets</title>
        </Helmet>
        <TwoPanelLayout style={{ display: isOpenModal ? 'none' : 'block' }}>
          <LeftPanel isShowRightPanel={false}>
            {/* <MaxWidth> */}
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" textAlign="center">
                    NFT Marketplace
                  </Heading>
                </div>
              </div>
            {/* </MaxWidth> */}
            <Route exact path={path}>
              <CardMyNFT />
            </Route>
            <Route exact path={`${path}/market-place`}>
              <CardMarketplace />
            </Route>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>
    </>
  )
}

export default NFTMarketplace
