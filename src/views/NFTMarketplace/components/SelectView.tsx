import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Button } from '../../../uikit-dev'
import groupBlack from '../../../uikit-dev/images/for-ui-v2/nft/group-view-black.png'
import listBlack from '../../../uikit-dev/images/for-ui-v2/nft/single-view-black.png'
import groupWhite from '../../../uikit-dev/images/for-ui-v2/nft/group-view-white.png'
import listWhite from '../../../uikit-dev/images/for-ui-v2/nft/single-view-white.png'

export type TypeName = 'Grid' | 'Group'

const GroupButton = styled.div`
  border-radius: ${({ theme }) => theme.radii.small};
  align-items: center;
  display: flex;

  button {
    flex-shrink: 0;
    width: 10%;
    height: 40px;
    padding: 0 12px;
    border-radius: 0;

    &:first-child {
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-top-left-radius: ${({ theme }) => theme.radii.small};
      border-bottom-left-radius: ${({ theme }) => theme.radii.small};
    }
    &:last-child {
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-top-right-radius: ${({ theme }) => theme.radii.small};
      border-bottom-right-radius: ${({ theme }) => theme.radii.small};
    }

    ${({ theme }) => theme.mediaQueries.xs} {
      width: 16%;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 6%;
    }
  }
`

const SelectView = ({ typeName, setTypeName, className = '' }) => {
  const charts: TypeName[] = ['Grid', 'Group']
  const { isDark } = useTheme()
  return (
    <GroupButton className={className}>
      {charts.map((t) => (
        <Button
          fullWidth
          variant={t === typeName ? 'primary' : 'text'}
          radii="small"
          onClick={() => {
            setTypeName(t)
          }}
        >
          {t === 'Grid' && <img alt="" src={isDark  ? listWhite  : listBlack} width="18px" />}
          {t === 'Group' && <img alt="" src={isDark ? groupWhite : groupBlack} width="22px" />}
        </Button>
      ))}
    </GroupButton>
  )
}

export default SelectView
