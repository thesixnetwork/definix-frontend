import React from 'react'
import styled from 'styled-components'
import { CogIcon, IconButton, useModal } from 'uikit-dev'
import SettingsModal from './SettingsModal'

const StyleButton = styled(IconButton)`
  flex-shrink: 0;

  svg {
    stroke: ${({ theme }) => theme.colors.textSubtle} !important;
  }

  &:hover {
    svg {
      stroke: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

const SettingButton = () => {
  const [onPresentSettingModal] = useModal(<SettingsModal />)

  return (
    <StyleButton variant="text" title="Settings" onClick={onPresentSettingModal}>
      <CogIcon />
    </StyleButton>
  )
}

export default SettingButton
