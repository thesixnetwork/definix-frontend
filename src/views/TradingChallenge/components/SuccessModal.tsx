import React from 'react'
import styled from 'styled-components'
import { Button, CheckmarkIcon, Heading, Modal, Text } from 'uikit-dev'

const Icon = styled.div`
  background: ${({ theme }) => theme.colors.success};
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.circle};
`

const SuccessModal = ({ title = '', detail = '', onDismiss = () => null, onSuccessRefresh }) => {
  return (
    <Modal title="" onDismiss={onDismiss} isRainbow bodyPadding="32px 24px 24px 24px" hideCloseButton>
      <div style={{ width: '400px', maxWidth: '100%' }}>
        <div className="flex flex-column align-center mx-auto mb-6 px-7">
          <Icon className="mb-4">
            <CheckmarkIcon color="white" width="32px" />
          </Icon>
          <Heading className="mb-2" textAlign="center">
            {title}
          </Heading>
          <Text textAlign="center">{detail}</Text>
        </div>

        <Button
          fullWidth
          variant="primary"
          onClick={() => {
            onSuccessRefresh(window.scrollTo(0, 400))
            onDismiss()
          }}
        >
          OK!
        </Button>
      </div>
    </Modal>
  )
}

export default SuccessModal
