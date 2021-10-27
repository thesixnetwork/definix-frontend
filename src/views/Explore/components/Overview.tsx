import React from 'react'

import { Rebalance } from '../../../state/types'
import KeyFacts from './KeyFacts'
import FundDetail from './FundDetail'

interface OverviewType {
  rebalance: Rebalance | any
  periodPriceTokens?: number[]
}

const Overview: React.FC<OverviewType> = ({ rebalance, periodPriceTokens }) => {
  return (
    <>
      <FundDetail className="mb-4" rebalance={rebalance} periodPriceTokens={periodPriceTokens} />
      <KeyFacts rebalance={rebalance} />
    </>
  )
}

export default Overview
