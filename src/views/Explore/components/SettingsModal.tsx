import React from 'react'
import { Box, Modal } from 'definixswap-uikit-v2'
import SlippageToleranceSetting from './SlippageToleranceSettings'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

type SettingsModalProps = {
  onDismiss?: () => void
}

const defaultOnDismiss = () => null

const SettingsModal = ({ onDismiss = defaultOnDismiss }: Partial<SettingsModalProps>) => {
  return (
    <Modal title="Settings" onDismiss={onDismiss}>
      <Box px="S_24" pb="S_24">
        <SlippageToleranceSetting />
        <TransactionDeadlineSetting />
      </Box>
    </Modal>
  )
}

export default SettingsModal
