import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeftGIcon, ArrowRightGIcon } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface Props {
  curPage: number;
  totalPage: number;
  pageOffset: number;
  updatePage: (page: number) => void;
}

const WrapPage = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
`

const ItemPage = styled.li`
  width: 24px;
  height: 20px;
  margin: 0 2px;

  button {
    ${({ theme }) => theme.textStyle.R_14R}
    color: ${({ theme }) => theme.colors.mediumgrey};
  }

  &.active button {
    ${({ theme }) => theme.textStyle.R_14B}
    color: ${({ theme }) => theme.colors.black};
  }
`

const LinkPage = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
`



const DISPLAY_PAGE = 5;

const Pagination: React.FC<Props> = ({ curPage, totalPage, pageOffset, updatePage }) => {
  const totalOffsetPage = useMemo(() => Math.ceil(totalPage / pageOffset), [pageOffset, totalPage]);
  const curOffsetPage = useMemo(() => Math.floor(curPage / pageOffset), [curPage, pageOffset]);
  console.log(totalOffsetPage, curOffsetPage)
  const [showPage, setShowPage] = useState([]);

  useEffect(() => {
    setShowPage(Array(DISPLAY_PAGE).fill(true).map((val, index) => {
      return (curOffsetPage * pageOffset) + index
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curOffsetPage])

  const onPrev = useCallback(() => {
    updatePage((curOffsetPage - 1) * pageOffset);
  }, [updatePage, curOffsetPage, pageOffset]);

  const onNext = useCallback(() => {
    updatePage((curOffsetPage + 1) * pageOffset);
  }, [updatePage, curOffsetPage, pageOffset]);

  return <WrapPage>
    {
      curOffsetPage > 0 && <LinkPage onClick={onPrev}>
        <ArrowLeftGIcon />
      </LinkPage>
    }
    {
      showPage.map((page) => <ItemPage className={page === curPage ? 'active' : ''}>
        <LinkPage onClick={() => updatePage(page)}>{page}</LinkPage>
      </ItemPage>)
    }
    {
      curOffsetPage <= totalOffsetPage && <LinkPage onClick={onNext}>
        <ArrowRightGIcon />
      </LinkPage>
    }
  </WrapPage>
}

export default Pagination
