import React from 'react'
import { Modal, Box } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'

const SettingModal = ({ onDismiss = () => null, isConfirm = false }) => {
  const { t } = useTranslation()
  return (
    <Modal title={t('Setting')} onDismiss={onDismiss}>
      <Box>test</Box>
    </Modal>
  )
}

export default SettingModal
