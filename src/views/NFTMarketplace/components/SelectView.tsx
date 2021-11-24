import React from 'react'
import styled from 'styled-components'
import { Button } from '../../../uikit-dev'
import group from '../../../uikit-dev/images/for-ui-v2/group.png'
import list from '../../../uikit-dev/images/for-ui-v2/list.png'

export type TypeName = 'Grid' | 'Group'

const GroupButton = styled.div`
  border-radius: ${({ theme }) => theme.radii.small};

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
  }
`

const SelectView = ({ typeName, setTypeName, className = '' }) => {
  const charts: TypeName[] = ['Grid', 'Group']

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
          {t === 'Grid' && <img alt="" src={list} />}
          {t === 'Group' && <img alt="" src={group} />}
        </Button>
      ))}
    </GroupButton>
  )
}

export default SelectView
