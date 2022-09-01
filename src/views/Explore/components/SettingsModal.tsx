import React from 'react'
import ModalV2 from 'uikitV2/components/ModalV2'
import SlippageToleranceSetting from './SlippageToleranceSettings'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

type SettingsModalProps = {
  onDismiss?: () => void
}

const SettingsModal = ({ onDismiss }: SettingsModalProps) => {
  return (
    <ModalV2 title="Settings" onDismiss={onDismiss}>
      <SlippageToleranceSetting />
      <TransactionDeadlineSetting />
    </ModalV2>
  )
}

SettingsModal.defaultProps = {
  onDismiss: () => null,
}

export default SettingsModal
