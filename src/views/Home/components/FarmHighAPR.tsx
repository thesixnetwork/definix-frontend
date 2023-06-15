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
  const activeFarms = farmsWithApy.filter(
    (farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X' && farm.apy.toString() !== 'Infinity',
  )
  const activeFavorFarms = farmsWithApy.filter(
    (farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X' && farm.favorApy.toString() !== 'Infinity',
  )
  const sortedFarmData = useMemo(() => activeFarms.sort((a, b) => +a.apy - +b.apy).reverse(), [activeFarms])
  const sortedFavorFarmData = useMemo(
    () => activeFavorFarms.sort((a, b) => +a.favorApy - +b.favorApy).reverse(),
    [activeFavorFarms],
  )

  const sortedData = useMemo(() => {
    if (sortedFarmData[0] && sortedFavorFarmData[0]) {
      const isFarmHighApy = sortedFarmData[0].apy.isGreaterThanOrEqualTo(sortedFavorFarmData[0].favorApy)
      return isFarmHighApy
        ? {
            lpSymbol: sortedFarmData[0].lpSymbol,
            apy: sortedFarmData[0].apy,
            lpSymbols: sortedFarmData[0].lpSymbols,
            totalLiquidityValue: sortedFarmData[0].totalLiquidityValue,
          }
        : {
            lpSymbol: sortedFavorFarmData[0].lpSymbol,
            apy: sortedFavorFarmData[0].favorApy,
            lpSymbols: sortedFavorFarmData[0].lpSymbols,
            totalLiquidityValue: sortedFavorFarmData[0].totalLiquidityValue,
          }
    }
    return null
  }, [sortedFarmData, sortedFavorFarmData])

  return sortedData ? (
    <FormAPR
      title={sortedData.lpSymbol}
      totalAssetValue={get(sortedData, 'totalLiquidityValue', 0)}
      apr={numeral(sortedData.apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}
      Images={
        <WrapImage>
          <StyledLp lpSymbols={sortedData.lpSymbols.map(({ symbol }) => symbol)} size="48px" />
        </WrapImage>
      }
    />
  ) : (
    <></>
  )
}

export default FarmHighAPR
