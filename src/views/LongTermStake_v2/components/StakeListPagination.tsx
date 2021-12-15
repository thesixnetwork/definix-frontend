import React, { useState, useEffect } from 'react'
import { Flex, Text, ArrowLeftGIcon, ArrowRightGIcon } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { IsMobileType } from './types'

interface StakeListPaginationProps extends IsMobileType {
  itemPerPage: number
  dataLength: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const StyledText = styled(Text)`
  margin: 0 2px;
  width: 24px;
  text-align: center;
  cursor: pointer;
`

const StyledArrow = styled(Flex)`
  cursor: 'pointer';
`

const StakeListPagination: React.FC<StakeListPaginationProps> = ({
  isMobile,
  itemPerPage,
  dataLength,
  currentPage,
  setCurrentPage,
}) => {
  const [pageNumbers, setPageNumbers] = useState<number[]>([])

  useEffect(() => {
    const pageArray = []

    for (let i = 1; i <= Math.ceil(dataLength / itemPerPage); i++) {
      if (Math.ceil(i / 5) === Math.ceil(currentPage / 5)) pageArray.push(i)
    }

    setPageNumbers(pageArray)
  }, [currentPage, dataLength, itemPerPage])

  useEffect(() => {
    if (pageNumbers.length !== 0 && currentPage > pageNumbers.length) {
      setCurrentPage(pageNumbers[pageNumbers.length - 1])
    }
  }, [isMobile, currentPage, pageNumbers, setCurrentPage])

  return (
    <>
      <Flex mt={`${isMobile ? 'S_12' : 'S_20'}`}>
        {Math.ceil(currentPage / 5) !== 1 ? (
          <StyledArrow mr="S_10" alignItems="center" onClick={() => setCurrentPage(Math.ceil(currentPage / 5) * 5 - 5)}>
            <ArrowLeftGIcon viewBox="0 0 16 16" width={16} height={16} />
          </StyledArrow>
        ) : (
          <div style={{ width: '26px' }} />
        )}

        {pageNumbers.map((num) => {
          return (
            <StyledText
              key={num}
              textStyle={`${currentPage === num ? 'R_14B' : 'R_14R'}`}
              color={`${currentPage === num ? 'black' : 'mediumgrey'}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </StyledText>
          )
        })}

        {Math.ceil(currentPage / 5) !== Math.ceil(dataLength / itemPerPage / 5) ? (
          <StyledArrow ml="S_10" alignItems="center" onClick={() => setCurrentPage(Math.ceil(currentPage / 5) * 5 + 1)}>
            <ArrowRightGIcon viewBox="0 0 16 16" width={16} height={16} />
          </StyledArrow>
        ) : (
          <div style={{ width: '26px' }} />
        )}
      </Flex>
    </>
  )
}

export default StakeListPagination
