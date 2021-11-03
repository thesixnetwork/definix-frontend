import React from 'react'
import { CardBody } from 'definixswap-uikit'

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
      <CardBody>
        <FundDetail className="mb-4" rebalance={rebalance} periodPriceTokens={periodPriceTokens} />
      </CardBody>
      <CardBody>
        <KeyFacts rebalance={rebalance} />
      </CardBody>
    </>
  )
}

export default Overview
