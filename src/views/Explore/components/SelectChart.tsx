import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

export type TypeChartName = 'Normalize' | 'Price'

const SelectChart = ({ chartName, setChartName, className = '' }) => {
  const charts: TypeChartName[] = ['Normalize', 'Price']

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={chartName}
      onChange={(e, newValue) => {
        setChartName(newValue)
      }}
      color="primary"
      className={className}
    >
      {charts.map((t) => (
        <ToggleButton value={t} key={t}>
          {t}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default SelectChart
