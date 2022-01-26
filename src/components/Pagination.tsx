import React, { useEffect, useCallback, useMemo } from 'react'
import { Flex, Text, ArrowLeftGIcon, ArrowRightGIcon } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface PaginationProps {
  isMobile: boolean
  itemPerPage: number
  dataLength: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const StyledFlex = styled(Flex)<{ $isPagination: boolean }>`
  margin-top: ${({ $isPagination }) => ($isPagination ? '20px' : '0px')};

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 0px;
  }
`

const StyledText = styled(Text)`
  margin: 0 2px;
  width: 24px;
  text-align: center;
  cursor: pointer;
`

const StyledArrow = styled(Flex)`
  cursor: pointer;
`

const Pagination: React.FC<PaginationProps> = ({ isMobile, itemPerPage, dataLength, currentPage, setCurrentPage }) => {
  const pageNumbers = useMemo(() => {
    const pageArray = []

    for (let i = 1; i <= Math.ceil(dataLength / itemPerPage); i++) {
      if (Math.ceil(i / 5) === Math.ceil(currentPage / 5)) pageArray.push(i)
    }

    return pageArray
  }, [currentPage, dataLength, itemPerPage])

  const onClickNumber = useCallback(
    (num: number) => {
      setCurrentPage(num)
    },
    [setCurrentPage],
  )

  const onClickArrow = (direction: string) => {
    let num: number

    if (direction === 'left') {
      num = Math.ceil(currentPage / 5) * 5 - 5
    } else {
      num = Math.ceil(currentPage / 5) * 5 + 1
    }
    onClickNumber(num)
  }

  useEffect(() => {
    onClickNumber(1)
  }, [isMobile, onClickNumber])

  return (
    <>
      {pageNumbers.length > 1 && (
        <StyledFlex $isPagination={pageNumbers.length > 1}>
          {dataLength > itemPerPage * 5 && Math.ceil(currentPage / 5) !== 1 ? (
            <StyledArrow mr="S_10" alignItems="center" onClick={() => onClickArrow('left')}>
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
                onClick={() => onClickNumber(num)}
              >
                {num}
              </StyledText>
            )
          })}

          {dataLength > itemPerPage * 5 && Math.ceil(currentPage / 5) !== Math.ceil(dataLength / itemPerPage / 5) ? (
            <StyledArrow ml="S_10" alignItems="center" onClick={() => onClickArrow('right')}>
              <ArrowRightGIcon viewBox="0 0 16 16" width={16} height={16} />
            </StyledArrow>
          ) : (
            <div style={{ width: '26px' }} />
          )}
        </StyledFlex>
      )}
    </>
  )
}

export default Pagination
