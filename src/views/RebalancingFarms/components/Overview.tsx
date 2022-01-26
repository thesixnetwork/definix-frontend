import React from 'react'
import { CardBody, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import { Rebalance } from '../../../state/types'
import KeyFacts from './KeyFacts'
import FundDetail from './FundDetail'
import AssetDetail from './AssetDetail'

interface OverviewType {
  rebalance: Rebalance | any
  periodPriceTokens?: number[]
}

const Overview: React.FC<OverviewType> = ({ rebalance, periodPriceTokens }) => {
  const { isMaxXl } = useMatchBreakpoints()
  return (
    <>
      <CardBody p={isMaxXl ? 'S_20' : 'S_32'}>
        <FundDetail rebalance={rebalance} />
      </CardBody>

      <AssetDetail rebalance={rebalance} periodPriceTokens={periodPriceTokens} mx={isMaxXl ? 'S_20' : 'S_32'} />
      <CardBody p={isMaxXl ? 'S_20' : 'S_32'}>
        <KeyFacts rebalance={rebalance} />
      </CardBody>
    </>
  )
}

export default Overview