import React from 'react'
import { InjectedModalProps, Modal } from 'uikit-dev'
import useI18n from 'hooks/useI18n'
import useEditProfile, { Views } from './reducer'
import StartView from './StartView'
import PauseProfileView from './PauseProfileView'
import ChangeProfilePicView from './ChangeProfilePicView'
import ApproveFinixView from './ApproveFinixView'

type EditProfileModalProps = InjectedModalProps

const viewTitle = {
  [Views.START]: { id: 999, label: 'Edit Profile' },
  [Views.CHANGE]: { id: 999, label: 'Change Profile Pic' },
  [Views.REMOVE]: { id: 999, label: 'Remove Profile Pic' },
  [Views.APPROVE]: { id: 999, label: 'Approve FINIX' },
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onDismiss }) => {
  const { currentView, goToChange, goToRemove, goToApprove, goPrevious } = useEditProfile()
  const TranslateString = useI18n()
  const { id, label } = viewTitle[currentView]

  const isStartView = currentView === Views.START
  const handleBack = isStartView ? null : () => goPrevious()

  return (
    <Modal
      title={TranslateString(id, label)}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      isRainbow
    >
      <div style={{ maxWidth: '400px' }}>
        {currentView === Views.START && (
          <StartView goToApprove={goToApprove} goToChange={goToChange} goToRemove={goToRemove} onDismiss={onDismiss} />
        )}
        {currentView === Views.REMOVE && <PauseProfileView onDismiss={onDismiss} />}
        {currentView === Views.CHANGE && <ChangeProfilePicView onDismiss={onDismiss} />}
        {currentView === Views.APPROVE && <ApproveFinixView goToChange={goToChange} onDismiss={onDismiss} />}
      </div>
    </Modal>
  )
}

export default EditProfileModal
