import React from 'react'
import { Card, Flex } from 'definixswap-uikit'
import styled from 'styled-components'

import StakeListHead from './StakeListHead'
import StakeListContentPc from './StakeListContentPc'
import StakeListContentMobile from './StakeListContentMobile'
import StakeListPagination from './StakeListPagination'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardStakeList: React.FC<IsMobileType> = ({ isMobile }) => {
  const data = [
    {
      period: '90 days',
      amount: '3,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
    {
      period: '180 days',
      amount: '10,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
    {
      period: '365 days',
      amount: '30,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
    {
      period: '365 days',
      amount: '30,000,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
  ]

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
        <FlexCard>
          {!isMobile && <StakeListHead />}
          {isMobile ? <StakeListContentMobile data={data} /> : <StakeListContentPc data={data} />}
          <StakeListPagination isMobile={isMobile} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardStakeList
