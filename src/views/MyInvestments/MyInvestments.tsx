import React, { useState } from 'react'
import { Route, useRouteMatch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
// import useMyInvestments from 'hooks/useMyInvestments'
import PageTitle from 'uikitV2/components/PageTitle'
import { Box, Card, DropdownOption, ImgMyinvestmentDefault3x } from '@fingerlabs/definixswap-uikit-v2'
// import useWallet from 'hooks/useWallet'
import CardSummary from './components/CardSummary'
import MyProductsFilter from './components/MyProductsFilter'
import MyProducts from './components/MyProducts'
import { mediaQueries, spacing } from 'uikitV2/base'
import { useWallet } from '@binance-chain/bsc-use-wallet'
const Wrap = styled(Box)`
  padding-bottom: ${spacing.S_80}px;
  ${mediaQueries.mobileXl} {
    padding-bottom: ${spacing.S_40}px;
  }
`

const MyInvestments: React.FC = () => {
  const { path } = useRouteMatch()

  const [currentProductType, setCurrentProductType] = useState<string>('')
  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const { account } = useWallet()
  const stakedProducts = [] // useMyInvestments()

  return account ? (
    <Wrap>
      <Route exact path={`${path}`}>
        <PageTitle
          title="My Investment"
          caption="Check your investment history and profit on Definix."
          // img={ImgMyinvestmentDefault3x}
        >
          <>
            <CardSummary products={stakedProducts} />
            <Card
              className="mt-s16"
              style={{
                overflow: 'visible',
              }}
            >
              {/* <MyProductsFilter
            onChangeDisplayFilter={(keyword: string) => setCurrentProductType(keyword)}
            onChangeOrderFilter={(orderBy: DropdownOption) => setSelectedOrderBy(orderBy)}
            onChangeSearchInput={(keyword: string) => setSearchKeyword(keyword)}
          />
          <MyProducts
            currentProductType={currentProductType}
            currentOrderBy={selectedOrderBy}
            searchKeyword={searchKeyword}
            products={stakedProducts}
          /> */}
            </Card>
          </>
        </PageTitle>
      </Route>
    </Wrap>
  ) : (
    <Redirect to="/" />
  )
}

export default MyInvestments
