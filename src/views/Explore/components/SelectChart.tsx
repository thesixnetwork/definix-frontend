import React from 'react'
import styled from 'styled-components'
import { Button } from 'uikit-dev'

export type TypeChartName = 'Price' | 'Normalize'

const GroupButton = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.small};

  button {
    flex-shrink: 0;
    width: 100px;
    height: 40px;
    padding: 0 12px;
    border-radius: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.border} !important;

    &:first-child {
      border-top-left-radius: ${({ theme }) => theme.radii.small};
      border-bottom-left-radius: ${({ theme }) => theme.radii.small};
    }
    &:last-child {
      border: none !important;
      border-top-right-radius: ${({ theme }) => theme.radii.small};
      border-bottom-right-radius: ${({ theme }) => theme.radii.small};
    }
  }
`

const SelectChart = ({ chartName, setChartName, className = '' }) => {
  const charts: TypeChartName[] = ['Price', 'Normalize']

  return (
    <GroupButton className={className}>
      {charts.map((t) => (
        <Button
          fullWidth
          variant={t === chartName ? 'primary' : 'text'}
          radii="card"
          onClick={() => {
            setChartName(t)
          }}
        >
          {t}
        </Button>
      ))}
    </GroupButton>
  )
}

export default SelectChart
