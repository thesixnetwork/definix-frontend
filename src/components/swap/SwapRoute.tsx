import { Trade } from 'definixswap-sdk'
import React, { Fragment, memo } from 'react'
import { ArrowRight } from 'react-feather'
import { Text } from 'uikit-dev'
import CurrencyLogo from '../CurrencyLogo'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  return (
    <div className="flex align-center flex-wrap">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <div className="flex flex-column align-center">
              <CurrencyLogo currency={token} size="1.5rem" />
              <Text fontSize="12px" textAlign="center" className="mt-1">
                {token.symbol}
              </Text>
            </div>
            {isLastItem ? null : <ArrowRight size="20" className="mx-3" style={{ marginTop: '-24px' }} />}
          </Fragment>
        )
      })}
    </div>
  )
})
