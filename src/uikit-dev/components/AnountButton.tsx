import React from 'react'
import styled from 'styled-components'
import { Button } from './Button'

const StyleButton = styled(Button)`
  padding: 0 12px;
  border-radius: 8px;
  margin-right: 4px;
  font-size: 12px;
`

const AnountButton = ({ title, onClick, className = '' }) => {
  return (
    <StyleButton size="sm" onClick={onClick} variant="tertiary" className={className}>
      {title}
    </StyleButton>
  )
}
export default AnountButton
