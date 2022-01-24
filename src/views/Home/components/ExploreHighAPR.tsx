import React, { useMemo } from 'react'
import _ from 'lodash-es'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Flex } from '@fingerlabs/definixswap-uikit-v2'
import { usePriceFinixUsdToNumber, useRebalances } from 'state/hooks'
import { Rebalance } from 'state/types'
import FormAPR from './FormAPR'

interface ExtendRebalance extends Rebalance {
  apr: number
}

const WrapImage = styled(Flex)`
  width: 120px;
  height: 48px;
  align-items: flex-end;
  border-radius: 4px;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 90px;
    height: 36px;
  }
`

const ExploreHighAPR: React.FC = () => {
  const rebalances = useRebalances()
  const finixPrice = usePriceFinixUsdToNumber()

  const highAprRebalance = useMemo(() => {
    return rebalances.reduce<ExtendRebalance>((acc, rebalance) => {
      const temp = {
        ...rebalance,
        apr: new BigNumber(finixPrice)
          .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
          .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
          .times(100)
          .toNumber(),
      }

      if (!acc.apr || acc.apr < temp.apr) {
        // eslint-disable-next-line no-param-reassign
        acc = temp
      }

      return acc
    }, {} as ExtendRebalance)
  }, [finixPrice, rebalances])

  return highAprRebalance ? (
    <FormAPR
      isFarm={false}
      title={highAprRebalance.title}
      totalAssetValue={numeral(_.get(highAprRebalance, 'totalAssetValue', 0)).format('0,0.00')}
      apr={numeral(highAprRebalance.apr).format('0,0.00')}
      Images={
        <WrapImage>
          <img src={highAprRebalance.icon[0]} alt="" />
        </WrapImage>
      }
    />
  ) : (
    <></>
  )
}

export default ExploreHighAPR
