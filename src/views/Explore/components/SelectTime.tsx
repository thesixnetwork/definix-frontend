import React from 'react'
import styled from 'styled-components'
import { Button } from 'definixswap-uikit'

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

const SelectTime = ({ timeframe, setTimeframe, className = '' }) => {
  const times = ['1 D', '1 W', '1 M', '3 M', 'ALL']

  return (
    <GroupButton className={className}>
      {times.map((t) => (
        <Button
          scale="sm"
          variant={t.split(' ').join('') === timeframe ? 'primary' : 'text'}
          onClick={() => {
            setTimeframe(t.split(' ').join(''))
          }}
        >
          {t}
        </Button>
      ))}
    </GroupButton>
  )
}

export default SelectTime
