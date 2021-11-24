import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { Heading, Button } from 'uikit-dev'
import styled from 'styled-components'
import CardMarketplace from './components/CardMarketplace'
import CardMyNFT from './components/CardMyNFT'


const NFTButton = styled(Button)`
  padding: 10px 16px;
  border-radius: 24px;
  background: #0973B9;
  color: ${({ theme }) => theme.colors.white};

`

const NFTMarketplace: React.FC = () => {
  const { path } = useRouteMatch()
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <>
      <Route exact>
        <Helmet>
          <title>NFT - Definix - Advance Your Crypto Assets</title>
        </Helmet>
        <TwoPanelLayout style={{ display: isOpenModal ? 'none' : 'block' }}>
          <LeftPanel isShowRightPanel={false}>
            <div className="pb-3">
              <Heading as="h1" fontSize="30px !important">
                NFT Marketplace
              </Heading>
              <div className="mt-6">
                <NFTButton as="a" href="/NFT">
                  My NFT
              </NFTButton>
                <NFTButton as="a" href="/NFT/market-place" className="ml-2">
                  Marketplace
              </NFTButton>
              </div>
            </div>
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
