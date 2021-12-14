import React from 'react'
import { Button, ButtonGroup } from 'definixswap-uikit-v2'
import styled from 'styled-components'

const TimeButton = styled(Button)`
  white-space: nowrap;
  max-width: 60px;
  height: 32px;
`

const SelectTime = ({ timeframe, setTimeframe }) => {
  const times = [
    { value: '1D', label: '1 D' },
    { value: '1W', label: '1 W' },
    { value: '1M', label: '1 M' },
    { value: '3M', label: '3 M' },
    { value: 'ALL', label: 'ALL' },
  ]

  return (
    <ButtonGroup>
      {times.map(({ label, value }) => (
        <TimeButton
          key={value}
          scale="sm"
          variant={value === timeframe ? 'primary' : 'text'}
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => {
            setTimeframe(value)
          }}
        >
          {label}
        </TimeButton>
      ))}
    </ButtonGroup>
  )
}

export default SelectTime
