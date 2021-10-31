import React from 'react'
import styled from 'styled-components'
import { Modal } from 'uikit-dev'
import { useActiveWeb3React } from '../../hooks'
import ConfirmationPendingContent from './ConfirmationPendingContent'

interface ConfirmationModalProps {
  isOpen: boolean
  isPending: boolean
  isSubmitted: boolean
  isError: boolean
  confirmContent: () => React.ReactNode
  pendingIcon?: any
  submittedContent: () => React.ReactNode
  errorContent: () => React.ReactNode
  onDismiss: () => void
}

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 24px;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  background: url(${({ theme }) => theme.colors.backgroundPolygon});
  background-size: cover;
  background-repeat: no-repeat;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 40px;
  }
`

const TransactionConfirmationModal = ({
  isOpen,
  isPending,
  isSubmitted,
  isError,
  confirmContent,
  pendingIcon,
  submittedContent,
  errorContent,
  onDismiss,
}: ConfirmationModalProps) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return isOpen ? (
    <ModalWrapper>
      <Modal
        title=""
        onBack={!isPending ? onDismiss : undefined}
        onDismiss={onDismiss}
        isRainbow={false}
        bodyPadding="0"
        maxWidth="480px"
        hideCloseButton
        classHeader="bd-b-n"
        className="w-100"
      >
        {isPending ? (
          <ConfirmationPendingContent pendingIcon={pendingIcon} />
        ) : isSubmitted ? (
          submittedContent()
        ) : isError ? (
          errorContent()
        ) : (
          confirmContent()
        )}
      </Modal>
    </ModalWrapper>
  ) : (
    <></>
  )
}

export default TransactionConfirmationModal
