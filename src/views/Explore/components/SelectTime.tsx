import React from 'react'
import styled from 'styled-components'
import { Button } from 'uikit-dev'

const GroupButton = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.small};

  button {
    flex-shrink: 0;
    width: 56px;
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

const SelectTime = ({ timeframe, setTimeframe, className = '' }) => {
  const times = ['1 D', '1 W', '1 M', '3 M', 'ALL']

  return (
    <GroupButton className={className}>
      {times.map((t) => (
        <Button
          fullWidth
          variant={t.split(' ').join('') === timeframe ? 'primary' : 'text'}
          radii="card"
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
