import { Backdrop } from '@mui/material'
import React, { createContext, useState } from 'react'
import styled from 'styled-components'
import { Handler } from './types'

interface ModalsContext {
  onPresent: (node: React.ReactNode, key?: string) => void
  onDismiss: Handler
  setCloseOnOverlayClick: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // z-index: ${({ theme }) => theme.zIndices.modal - 1};
  z-index: 9999;
`

export const Context = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null,
  setCloseOnOverlayClick: () => true,
})

const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true)

  const handlePresent = (node: React.ReactNode) => {
    setModalNode(node)
    setIsOpen(true)
  }

  const handleDismiss = () => {
    setModalNode(undefined)
    setIsOpen(false)
  }

  const handleOverlayDismiss = () => {
    if (closeOnOverlayClick) {
      handleDismiss()
    }
  }

  return (
    <Context.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
        setCloseOnOverlayClick,
      }}
    >
      {isOpen && (
        <ModalWrapper>
          <Backdrop open onClick={handleOverlayDismiss} />
          {React.isValidElement(modalNode) &&
            React.cloneElement(modalNode, {
              onDismiss: handleDismiss,
            })}
        </ModalWrapper>
      )}
      {children}
    </Context.Provider>
  )
}

export default ModalProvider
