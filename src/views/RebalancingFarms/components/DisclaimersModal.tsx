import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Checkbox,
  CheckboxLabel,
  Text,
  Modal,
  ModalBody,
  ModalFooter,
} from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

const ContentBox = styled(Box)`
  border: 1px solid rgba(224, 224, 224, 0.5);
  border-radius: 8px;
  padding-bottom: 0;
  overflow: auto;
`

const AlertBoxStyle = styled(Box)`
  border: 1px solid rgba(224, 224, 224, 0.5);
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
`

const H2 = ({ children, ...props }) => (
  <Text textStyle="R_14R" mt="S_24" mb="S_6" {...props}>
    {children}
  </Text>
)
const DESC = ({ children, ...props }) => (
  <Text textStyle="R_12R" color="text" {...props}>
    {children}
  </Text>
)

const DisclaimersModal = ({ onDismiss = () => null, isConfirm = false }) => {
  const [isAccept, setIsAccept] = useState(false)
  const [isSkip, setIsSkip] = useState(false)
  const { t } = useTranslation()
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    return () => {
      setIsAccept(false)
      setIsSkip(false)
    }
  }, [])

  const onExit = () => {
    setShowAlert(true)
    if (isSkip) localStorage.setItem('disclaimerSkipped', 'true')
    // onDismiss()
  }
  const onCheckBoxChange = (event) => {
    setIsSkip(event.target.checked)
  }
  return (
    <>
      {showAlert ? (
        <Modal title="Announcement" onDismiss={showAlert && onDismiss}>
          <ModalBody isBody maxHeight="328px" maxWidth="490px">
            <AlertBoxStyle>
              <DESC>
                Sorry for your inconvenience. We are currently investigating the case and tracing all the transactions
                and evidence that cause the abnormality in the price of the asset. Please refrain to perform a deposit
                or withdrawal during the investigation. We will be back shortly. Please follow our Twitter for further
                update.
              </DESC>
            </AlertBoxStyle>
          </ModalBody>
        </Modal>
      ) : (
        <Modal title={t('Disclaimers')} hideCloseButton mobileFull onDismiss={onDismiss} maxWidth="486px">
          <ModalBody isBody maxHeight="328px">
            <ContentBox p="S_16">
              <DESC>{t('Definix is solely')}</DESC>
              <H2>{t('No advice on investment')}</H2>
              <DESC>{t('Risk of Loss Each investor')}</DESC>
              <H2>{t('Performance Disclosures')}</H2>
              <DESC>{t('Performance information is provided for')}</DESC>
              <DESC mt="S_6" mb="S_16">
                {t('The information on this Website')}
              </DESC>
            </ContentBox>
          </ModalBody>
          <ModalFooter isFooter>
            {isConfirm ? (
              <div className="flex flex-column">
                <CheckboxLabel
                  mb="S_24"
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
                <CheckboxLabel
                  control={
                    <Checkbox onChange={onCheckBoxChange} checked={isSkip} scale="sm" variantColor="lightbrown" />
                  }
                  mt="S_4"
                >
                  <Text textStyle="R_12R" color="mediumgrey">
                    {t('Do not show')}
                  </Text>
                </CheckboxLabel>
                <Button onClick={onExit} scale="lg" mt="S_20" disabled={!isAccept}>
                  {t('Confirm')}
                </Button>
              </div>
            ) : (
              <Button onClick={onDismiss} scale="lg" mt="S_24" width="100%">
                {t('Close')}
              </Button>
            )}
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

export default DisclaimersModal
