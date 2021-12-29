import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Modal, Button, ModalBody, ModalFooter } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface ModalProps {
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 464px) {
    width: 416px;
  }
`

const SuperStakeModal: React.FC<ModalProps> = ({ onDismiss = () => null }) => {
  const { t } = useTranslation()

  return (
    <Modal title={`${t('Super Stake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_30">
          <Text>super stake</Text>
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        <Button onClick={() => null}>{t('Next')}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default SuperStakeModal
