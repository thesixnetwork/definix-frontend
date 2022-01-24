import React, { useState } from 'react'
import { Route, useRouteMatch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import useMyInvestments from 'hooks/useMyInvestments'
import { Box, Card, DropdownOption } from '@fingerlabs/definixswap-uikit-v2'
import useWallet from 'hooks/useWallet'
import CardSummary from './components/CardSummary'
import MyProductsFilter from './components/MyProductsFilter'
import MyProducts from './components/MyProducts'

const Wrap = styled(Box)`
  padding-bottom: ${({ theme }) => theme.spacing.S_80}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-bottom: ${({ theme }) => theme.spacing.S_40}px;
  }
`

const MyInvestments: React.FC = () => {
  const { path } = useRouteMatch()

  const [currentProductType, setCurrentProductType] = useState<string>('')
  const [selectedOrderBy, setSelectedOrderBy] = useState<DropdownOption>()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const { account } = useWallet()
  const stakedProducts = useMyInvestments()

  return account ? (
    <Wrap>
      <Route exact path={`${path}`}>
        <CardSummary products={stakedProducts} />
        <Card className="mt-s16">
          <MyProductsFilter
            onChangeDisplayFilter={(keyword: string) => setCurrentProductType(keyword)}
            onChangeOrderFilter={(orderBy: DropdownOption) => setSelectedOrderBy(orderBy)}
            onChangeSearchInput={(keyword: string) => setSearchKeyword(keyword)}
          />
          <MyProducts
            currentProductType={currentProductType}
            currentOrderBy={selectedOrderBy}
            searchKeyword={searchKeyword}
            products={stakedProducts}
          />
        </Card>
      </Route>
    </Wrap>
  ) : (
    <Redirect to="/" />
  )
}

export default MyInvestments
