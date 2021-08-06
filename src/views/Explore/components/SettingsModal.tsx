import React from 'react'
import { Modal } from 'uikit-dev'
import SlippageToleranceSetting from './SlippageToleranceSettings'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

type SettingsModalProps = {
  onDismiss?: () => void
}

const SettingsModal = ({ onDismiss }: SettingsModalProps) => {
  return (
    <Modal title="Settings" onDismiss={onDismiss} isRainbow={false}>
      <SlippageToleranceSetting />
      <TransactionDeadlineSetting />
    </Modal>
  )
}

SettingsModal.defaultProps = {
  onDismiss: () => null,
}

export default SettingsModal
