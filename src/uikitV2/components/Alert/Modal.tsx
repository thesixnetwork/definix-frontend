import React from 'react'
import { InjectedModalProps, Modal, ModalBody, ModalFooter } from '../../Modal'
import { Button } from '../Button'
import { AlertIcon } from '../Icon'
import { Text } from '../Text'

interface Props extends InjectedModalProps {
  title: string
  content: string
  callback: () => void
  buttonLabel: string
}

const AlertModal: React.FC<Props> = ({ title, content, callback, buttonLabel, onDismiss }) => {
  return (
    <Modal title={title} onDismiss={onDismiss}>
      <ModalBody isBody maxWidth="298px" pt="6px" display="flex" justifyContent="center" alignItems="center">
        <AlertIcon width="40" height="40" viewBox="0 0 16 17" />
        <Text textStyle="R_14R" mt="16px" color="deepgrey" textAlign="center">
          {content}
        </Text>
      </ModalBody>
      <ModalFooter isFooter>
        <Button
          onClick={() => {
            callback()
            onDismiss && onDismiss()
          }}
        >
          {buttonLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default AlertModal
