import React from 'react'
import { Button, ErrorIcon, Modal, Text } from 'uikit-dev'

const ErrorOverLimitModal = ({ onDismiss = () => null }) => {
  return (
    <Modal title="" isRainbow={false} hideCloseButton classHeader="pa-0">
      <ErrorIcon width="80px" color="failure" className="mb-3 mx-auto" />
      <Text fontSize="24px" bold textAlign="center">
        Error
      </Text>
      <Text textAlign="center">
        The maximum that you can invest in <br /> Beta version is $100
      </Text>
      <Button fullWidth onClick={onDismiss} radii="card" className="mt-5">
        Close
      </Button>
    </Modal>
  )
}

export default ErrorOverLimitModal
