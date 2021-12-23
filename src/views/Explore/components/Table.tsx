import styled from 'styled-components'
import { Text } from '@fingerlabs/definixswap-uikit-v2'

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
        border-top-left-radius: 8px;
      }
      &:last-child {
        border-top-right-radius: 8px;
      }
    }
  }

  &:last-child {
    td,
    th {
      &:first-child {
        border-bottom-left-radius: 8px;
      }
      &:last-child {
        border-bottom-right-radius: 8px;
      }
    }
  }
`

export const TH = styled.th<{ align?: string; sm?: boolean; oneline?: boolean }>`
  background: ${({ theme }) => theme.colors.backgroundDisabled};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 11px ${({ sm }) => (sm ? '16px' : '24px')};
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
  ${({ oneline }) => oneline && `white-space: nowrap;`};
  ${Text} {
    white-space: inherit;
  }
`

export const TD = styled.td<{ align?: string; sidecolor?: string; sm?: boolean; oneline?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 18px ${({ sm }) => (sm ? '16px' : '24px')};
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};

  ${({ sidecolor }) =>
    sidecolor &&
    `
    position: relative;
    &:before {
      content: "";
      position: absolute;
      background: ${sidecolor};
      width: 4px;
      left: 0;
      top: 0;
      height: 100%;
    }
  `};

  ${({ oneline }) => oneline && `white-space: nowrap;`};

  ${Text} {
    white-space: inherit;
  }
`
