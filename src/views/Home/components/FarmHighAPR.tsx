import React, { useMemo } from 'react'
import { get } from 'lodash-es'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { Flex, Lp } from '@fingerlabs/definixswap-uikit-v2'
import { useFarms } from 'state/hooks'
import useFarmsList from 'hooks/useFarmsList'
import FormAPR from './FormAPR'

const WrapImage = styled(Flex)`
  width: 96px;
  height: 48px;
  align-items: flex-end;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 72px;
    height: 36px;
  }
`

const StyledLp = styled(Lp)`
  width: 48px;
  height: 48px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
    height: 36px;
  }
`

const FarmHighAPR = () => {
  const farmsLP = useFarms()
  const farmsWithApy = useFarmsList(farmsLP)
  const activeFarms = farmsWithApy.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')
  const sortedFarmData = useMemo(() => activeFarms.sort((a, b) => +a.apy - +b.apy).reverse(), [activeFarms])

  return sortedFarmData[0] ? (
    <FormAPR
      title={sortedFarmData[0].lpSymbol}
      totalAssetValue={get(sortedFarmData[0], 'totalLiquidityValue', 0)}
      apr={numeral(sortedFarmData[0].apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}
      Images={
        <WrapImage>
          <StyledLp lpSymbols={sortedFarmData[0].lpSymbols.map(({ symbol }) => symbol)} size="48px" />
        </WrapImage>
      }
    />
  ) : (
    <></>
  )
}

export default FarmHighAPR
