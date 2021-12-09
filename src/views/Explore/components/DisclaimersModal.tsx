import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Checkbox, CheckboxLabel, Text, Modal, ModalBody, ModalFooter } from 'definixswap-uikit-v2'
import styled from 'styled-components'

const ScrollArea = styled(Box)`
  border: 1px solid rgba(224, 224, 224, 0.5);
  height: 420px;
  overflow: scroll;
  border-radius: 8px;
  padding-bottom: 0;
`

const ContentText = styled(Text)`
  white-space: pre-line;
`

const DisclaimersModal = ({ onDismiss = () => null, isConfirm = false }) => {
  const [isAccept, setIsAccept] = useState(false)
  const [isSkip, setIsSkip] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    return () => {
      setIsAccept(false)
      setIsSkip(false)
    }
  }, [])

  const onExit = () => {
    if (isSkip) localStorage.setItem('disclaimerSkipped', 'true')
    onDismiss()
  }
  const onCheckBoxChange = (event) => {
    setIsSkip(event.target.checked)
  }
  return (
    <Modal title={t('Disclaimers')} hideCloseButton mobileFull onDismiss={onDismiss}>
      <ModalBody maxWidth="438px">
        <ScrollArea textStyle="R_12R" className="px-s16 pt-s16">
          <ContentText className="mb-3">{t('Definix is solely')}</ContentText>
        </ScrollArea>
      </ModalBody>
      <ModalFooter>
        {isConfirm ? (
          <div className="mt-s24 flex flex-column">
            <CheckboxLabel
              control={
                <Checkbox
                  onChange={() => {
                    setIsAccept(!isAccept)
                  }}
                  checked={isAccept}
                />
              }
            >
              <Text textStyle="R_14R">{t('I have read')}</Text>
            </CheckboxLabel>
            <Button onClick={onExit} scale="lg" className="mt-s24" disabled={!isAccept}>
              {t('Confirm')}
            </Button>
          </div>
        ) : (
          <Button onClick={onDismiss} scale="lg" className="mt-s24" width="100%">
            {t('Close')}
          </Button>
        )}

        <CheckboxLabel
          control={<Checkbox onChange={onCheckBoxChange} checked={isSkip} scale="sm" variantColor="lightbrown" />}
          className="mt-s32"
        >
          <Text textStyle="R_12R" color="mediumgrey">
            {t('Do not show')}
          </Text>
        </CheckboxLabel>
      </ModalFooter>
    </Modal>
  )
}

export default DisclaimersModal
