import React from 'react'
import styled from 'styled-components'
import { Button, CloseIcon, Heading, Modal, Text } from 'uikit-dev'

const Icon = styled.div`
  background: ${({ theme }) => theme.colors.failure};
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.circle};
`

const FailureModal = ({ title = '', detail = '', onDismiss = () => null }) => {
  return (
    <Modal title="" onDismiss={onDismiss} isRainbow bodyPadding="32px 24px 24px 24px" hideCloseButton>
      <div style={{ width: '400px', maxWidth: '100%' }}>
        <div className="flex flex-column align-center mx-auto mb-6 px-7">
          <Icon className="mb-4">
            <CloseIcon color="white" width="32px" />
          </Icon>
          <Heading className="mb-2" textAlign="center">
            {title}
          </Heading>
          <Text textAlign="center">{detail}</Text>
        </div>

        <Button fullWidth variant="primary" onClick={onDismiss}>
          OK!
        </Button>
      </div>
    </Modal>
  )
}

export default FailureModal
