import React from 'react'
import { ArrowForwardIcon, Button, ButtonProps } from 'definixswap-uikit'

const NextStepButton: React.FC<ButtonProps> = (props) => {
  return <Button endIcon={<ArrowForwardIcon color="currentColor" />} {...props} />
}

export default NextStepButton
