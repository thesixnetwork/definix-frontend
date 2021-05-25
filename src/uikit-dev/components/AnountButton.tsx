import React from 'react'
import styled from 'styled-components'
import { Button } from './Button'

const StyleButton = styled(Button)`
  padding: 0 12px;
  border-radius: 8px;
  margin-right: 8px;
`

const AnountButton = ({ title, onClick, className = '' }) => {
  return (
    <StyleButton size="sm" onClick={onClick} mr="8px" variant="tertiary" className={className}>
      {title}
    </StyleButton>
  )
}
export default AnountButton
