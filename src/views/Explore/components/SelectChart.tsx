import React from 'react'
import styled from 'styled-components'
import { Button } from 'definixswap-uikit'

export type TypeChartName = 'Normalize' | 'Price'

const GroupButton = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;

  button {
    flex-shrink: 0;
    width: 60px;
    border-radius: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.border} !important;

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    &:last-child {
      border: none !important;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
`

const SelectChart = ({ chartName, setChartName, className = '' }) => {
  const charts: TypeChartName[] = ['Normalize', 'Price']

  return (
    <GroupButton className={className}>
      {charts.map((t) => (
        <Button
          scale="sm"
          variant={t === chartName ? 'primary' : 'text'}
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
