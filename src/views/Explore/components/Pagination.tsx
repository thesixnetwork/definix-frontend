import React from 'react'
import styled from 'styled-components'
import { Button } from 'uikit-dev'

interface PaginationType {
  count: number
  current: number
  setCurrent: (idx: number) => void
  className?: string
}

const StyledButton = styled(Button)<{ active: boolean }>``

const Pagination: React.FC<PaginationType> = ({ className = '', count, current = 0, setCurrent }) => {
  const pages = []

  for (let idx = 0; idx < count; idx++) {
    pages.push(
      <StyledButton
        variant="text"
        size="xs"
        active={current === idx}
        onClick={() => {
          setCurrent(idx)
        }}
        key={idx}
      >
        {idx + 1}
      </StyledButton>,
    )
  }

  return <div className={`flex ${className}`}>{pages}</div>
}

export default Pagination
