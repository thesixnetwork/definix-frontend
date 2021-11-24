import React from 'react'
import styled from 'styled-components'
import { Button } from '../../../uikit-dev'
import group from '../../../uikit-dev/images/for-ui-v2/group.png'
import list from '../../../uikit-dev/images/for-ui-v2/list.png'

export type TypeChartName = 'Normalize' | 'Price'

const GroupButton = styled.div`
  //   display: flex;
  //   border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.small};

  button {
    flex-shrink: 0;
    width: 10%;
    height: 40px;
    padding: 0 12px;
    border-radius: 0;
    // border-right: 1px solid ${({ theme }) => theme.colors.border} !important;

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

const SelectView = ({ chartName, setChartName, className = '' }) => {
  const charts: TypeChartName[] = ['Normalize', 'Price']

  return (
    <GroupButton className={className}>
      {charts.map((t) => (
        <Button
          fullWidth
          variant={t === chartName ? 'primary' : 'text'}
          radii="small"
          onClick={() => {
            setChartName(t)
          }}
        >
          {t === 'Normalize' && <img alt="" src={list} />}
          {t === 'Price' && <img alt="" src={group} />}

          {/* {t} */}
        </Button>
      ))}
    </GroupButton>
  )
}

export default SelectView
