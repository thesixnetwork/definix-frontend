import React from 'react'
import { CardBody, useMatchBreakpoints } from 'definixswap-uikit'

import { Rebalance } from '../../../state/types'
import KeyFacts from './KeyFacts'
import FundDetail from './FundDetail'

interface OverviewType {
  rebalance: Rebalance | any
  periodPriceTokens?: number[]
}

const Overview: React.FC<OverviewType> = ({ rebalance, periodPriceTokens }) => {
  const { isMaxXl } = useMatchBreakpoints()
  return (
    <>
      <CardBody p={isMaxXl ? 'S_20' : 'S_32'}>
        <FundDetail rebalance={rebalance} periodPriceTokens={periodPriceTokens} />
      </CardBody>
      <CardBody p={isMaxXl ? 'S_20' : 'S_32'}>
        <KeyFacts rebalance={rebalance} />
      </CardBody>
    </>
  )
}

export default Overview
