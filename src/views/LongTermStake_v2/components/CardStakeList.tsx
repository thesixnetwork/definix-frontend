import React from 'react'
import { Card, Flex } from 'definixswap-uikit-v2'
import { usePrivateData } from 'hooks/useLongTermStake'
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
  const { lockAmount, allDataLock } = usePrivateData()

  return (
    <>
      {lockAmount ? (
        <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
          <FlexCard>
            {!isMobile && <StakeListHead />}
            {isMobile ? (
              <StakeListContentMobile isMobile={isMobile} allDataLock={allDataLock} />
            ) : (
              <StakeListContentPc isMobile={isMobile} allDataLock={allDataLock} />
            )}
            <StakeListPagination isMobile={isMobile} />
          </FlexCard>
        </Card>
      ) : (
        <></>
      )}
    </>
  )
}

export default CardStakeList
