import React from 'react'
import { Button, Modal } from 'uikit-dev'

const ConfirmModal = ({ type, tokenName, stakedBalance, onOK = () => null, onDismiss = () => null }) => {
  return (
    <Modal
      title={`Confirm ${type}`}
      onDismiss={onDismiss}
      isRainbow={false}
      bodyPadding="0 32px 32px 32px"
      classHeader="bd-b-n"
    >
      <p>tokenName: {tokenName}</p>
      <p>stakedBalance: {stakedBalance}</p>
      <Button
        onClick={() => {
          onOK()
          onDismiss()
        }}
        fullWidth
        className="mt-5"
        radii="card"
      >
        {type}
      </Button>
    </Modal>
  )
}

export default ConfirmModal
