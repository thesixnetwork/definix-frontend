import { Pagination, styled } from '@mui/material'
import React from 'react'

const PaginationStyle = styled(Pagination)`
  padding: 20px;

  .MuiPagination-ul {
    justify-content: flex-end;
  }

  .MuiPaginationItem-root {
    background: transparent !important;
    color: ${({ theme }) => theme.palette.text.disabled};
    font: inherit;
    margin: 0;
    font-size: 0.875rem;
  }

  .Mui-selected {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    padding: 24px 32px;
  }
`

const PaginationCustom = (props) => {
  return <PaginationStyle {...props} />
}

export default PaginationCustom
