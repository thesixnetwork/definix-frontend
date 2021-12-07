import React from 'react'
import { Button, ButtonGroup } from 'definixswap-uikit'

const SelectTime = ({ timeframe, setTimeframe, className = '' }) => {
  const times = ['1 D', '1 W', '1 M', '3 M', 'ALL']

  return (
    <ButtonGroup className={className}>
      {times.map((t) => (
        <Button
          key={t}
          scale="sm"
          variant={t.split(' ').join('') === timeframe ? 'primary' : 'text'}
          onClick={() => {
            setTimeframe(t.split(' ').join(''))
          }}
        >
          {t}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default SelectTime
