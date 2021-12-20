import React, { ChangeEvent, InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { Box, CloseIcon, IconButton, Input, InputProps } from '../../../uikit-dev'

interface ChoiceProps extends InputProps, InputHTMLAttributes<HTMLInputElement> {
  onTextInput: (value: string) => void
  onRemove?: () => void
  hasMinimumChoices?: boolean
}

const StyledInput = styled(Input)`
  border-radius: 30px;
  height: 42px;
`

const InputChoice: React.FC<ChoiceProps> = ({ onRemove, onTextInput, hasMinimumChoices, ...props }) => {
  const [isWarning, setIsWarning] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    onTextInput(value)
  }

  return (
    <Box position="relative" mb="16px">
      <StyledInput {...props} onChange={handleChange} isWarning={isWarning} />
      {onRemove && (
        <Box position="absolute" right="8px" top="0px" zIndex={30}>
          <IconButton variant="text" onClick={onRemove}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default InputChoice
