import React, { useState, useEffect } from 'react'
import { Card, Flex } from '@fingerlabs/definixswap-uikit-v2'
import { useLockCount, usePrivateData } from 'hooks/useLongTermStake'
import styled from 'styled-components'

import StakeListHead from './StakeListHead'
import StakeListContentPc from './StakeListContentPc'
import StakeListContentMobile from './StakeListContentMobile'
import StakeListPagination from './StakeListPagination'
import { IsMobileType, AllDataLockType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardStakeList: React.FC<IsMobileType> = ({ isMobile }) => {
  const { allDataLock } = usePrivateData()
  const lockCount = useLockCount()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemPerPage, setItemPerPage] = useState<number>(5)
  const [lastIndex, setLastIndex] = useState<number>(5)
  const [dataLength, setDataLength] = useState<number>(0)
  const [stakeList, setStakeList] = useState<AllDataLockType[] | null>(allDataLock)

  const getCurrentData = (data: AllDataLockType[]) => {
    return data.slice(lastIndex - itemPerPage, lastIndex)
  }

  useEffect(() => {
    setItemPerPage(isMobile ? 5 : 5)
  }, [isMobile])

  useEffect(() => {
    setLastIndex(currentPage * itemPerPage)
  }, [currentPage, itemPerPage])

  useEffect(() => {
    const data = allDataLock.filter((item: AllDataLockType) => !item.isUnlocked)
    setStakeList(data)

    if (dataLength > data.length) setCurrentPage(1)
    setDataLength(data.length)

    return () => {
      setStakeList(null)
    }
  }, [lockCount, allDataLock, dataLength])

  return (
    <>
      {stakeList.length > 0 && (
        <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
          <FlexCard>
            {!isMobile && <StakeListHead />}
            {isMobile ? (
              <StakeListContentMobile isMobile={isMobile} allDataLock={getCurrentData(stakeList)} />
            ) : (
              <StakeListContentPc isMobile={isMobile} allDataLock={getCurrentData(stakeList)} />
            )}
            <StakeListPagination
              isMobile={isMobile}
              itemPerPage={itemPerPage}
              dataLength={dataLength}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </FlexCard>
        </Card>
      )}
    </>
  )
}

export default CardStakeList
