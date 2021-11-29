import Pagination from '@material-ui/lab/Pagination'
import React from 'react'
import styled from 'styled-components'

const PaginationStyle = styled(Pagination)`
  .MuiPagination-ul {
    justify-content: flex-end;
  }

  .MuiPaginationItem-root {
    background: transparent !important;
    justify-content: flex-end;
    color: ${({ theme }) => theme.colors.textSubtle};
    font: inherit;
    font-size: 12px;
    margin: 0;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }

    span {
      display: none;
    }
  }

  .Mui-selected {
    color: ${({ theme }) => theme.colors.text};
  }
`

const PaginationCustom = (props) => {
  return <PaginationStyle {...props} />
}

export default PaginationCustom
