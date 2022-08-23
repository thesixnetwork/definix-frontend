import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

const SelectTime = ({ timeframe, setTimeframe, className = '' }) => {
  const times = ['1 D', '1 W', '1 M', '3 M', 'ALL']

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={timeframe}
      onChange={(e, newValue) => {
        setTimeframe(newValue.split(' ').join(''))
      }}
      color="primary"
      className={className}
    >
      {times.map((t) => (
        <ToggleButton value={t.split(' ').join('')} key={t}>
          {t}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default SelectTime
