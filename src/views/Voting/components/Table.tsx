import styled from 'styled-components'

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

export const TR = styled.tr`
  td,
  th {
    &:first-child {
      border-left: 1px solid ${({ theme }) => theme.colors.border};
    }
    &:last-child {
      border-right: 1px solid ${({ theme }) => theme.colors.border};
    }
  }

  &:first-child {
    td,
    th {
      border-top: 1px solid ${({ theme }) => theme.colors.border};

      &:first-child {
        border-top-left-radius: ${({ theme }) => theme.radii.card};
      }
      &:last-child {
        border-top-right-radius: ${({ theme }) => theme.radii.card};
      }
    }
  }

  &:last-child {
    td,
    th {
      &:first-child {
        border-bottom-left-radius: ${({ theme }) => theme.radii.card};
      }
      &:last-child {
        border-bottom-right-radius: ${({ theme }) => theme.radii.card};
      }
    }
  }
`

export const TH = styled.th<{ align?: string }>`
  background: ${({ theme }) => theme.colors.backgroundDisabled};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 16px;
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
`

export const TD = styled.td<{ align?: string }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  height: 64px;
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
`
