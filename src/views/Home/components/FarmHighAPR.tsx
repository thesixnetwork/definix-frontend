import React, { useMemo } from 'react'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { Flex, Box } from 'definixswap-uikit-v2'
import { useFarms } from 'state/hooks'
import useFarmsList from 'hooks/useFarmsList'
import { getLpImageUrls } from 'utils/getTokenImage'
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

const FarmHighAPR = () => {
  const farmsLP = useFarms()
  const farmsWithApy = useFarmsList(farmsLP)
  const activeFarms = farmsWithApy.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')
  const sortedFarmData = useMemo(() => activeFarms.sort((a, b) => +a.apy - +b.apy).reverse(), [activeFarms])
  const lpImages = useMemo(
    () => (sortedFarmData[0] ? getLpImageUrls(sortedFarmData[0].lpSymbol) : []),
    [sortedFarmData],
  )

  return sortedFarmData[0] ? (
    <FormAPR
      title={sortedFarmData[0].lpSymbol}
      totalAssetValue={numeral(_.get(sortedFarmData[0], 'totalLiquidityValue', 0)).format('0,0.00')}
      apr={numeral(sortedFarmData[0].apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}
      Images={
        <WrapImage>
          {lpImages.map((image, index) => (
            <Box key={image} width="50%" height="100%" style={{ marginLeft: index > 0 ? '-10px' : '0' }}>
              <img src={image} width="100%" height="100%" alt="" />
            </Box>
          ))}
        </WrapImage>
      }
    />
  ) : (
    <></>
  )
}

export default FarmHighAPR
