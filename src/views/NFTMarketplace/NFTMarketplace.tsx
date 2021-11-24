import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { Heading, Button } from 'uikit-dev'
import styled from 'styled-components'
import CardMarketplace from './components/CardMarketplace'
import CardMyNFT from './components/CardMyNFT'
import NFTTabButtons from './components/NFTTabButtons'

const NFTButton = styled(Button)`
  padding: 10px 16px;
  border-radius: 24px;
  border: 1px solid #737375;
  color: ${({ theme }) => theme.colors.text};

  &:active {
    background-color: #0973b9;
  }
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
            <div>
              <Heading as="h1" fontSize="30px !important">
                NFT Marketplace
              </Heading>
              <NFTTabButtons selected={selected} setSelected={setSelected} />
              {/* <div className="mt-6">
                <NFTButton as="a" href="/NFT">
                  My NFT
                </NFTButton>
                <NFTButton as="a" href="/NFT/market-place" className="ml-2">
                  Marketplace
                </NFTButton>
              </div> */}
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
