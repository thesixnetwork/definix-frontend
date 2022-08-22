import { styled } from '@mui/material'

export const Table = styled('table')`
  width: 100%;
  border-collapse: separate;
`

export const TR = styled('tr')`
  &:first-child {
    td,
    th {
      border-top: 1px solid ${({ theme }) => theme.palette.divider};
    }
  }
`

export const TH = styled('th')<{ align?: string }>`
  background: rgba(224, 224, 224, 0.2);
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
  padding: 12px 24px;
  text-transform: initial;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.text.disabled};
`

export const TD = styled('td')<{ align?: string }>`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  padding: 16px 24px;
  height: 60px;
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
`
