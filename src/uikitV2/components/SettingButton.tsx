import { SettingsRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'
import { useModal } from 'uikit-dev'
import SettingsModal from './SettingsModal'

const SettingButton = () => {
  const [onPresentSettingModal] = useModal(<SettingsModal />)

  return (
    <IconButton onClick={onPresentSettingModal}>
      <SettingsRounded />
    </IconButton>
  )
}

export default SettingButton
