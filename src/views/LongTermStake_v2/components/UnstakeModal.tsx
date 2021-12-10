import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import {
  Box,
  Flex,
  Text,
  Modal,
  Button,
  Divider,
  VDivider,
  ImgTokenFinixIcon,
  AlertIcon,
  ModalBody,
  ModalFooter,
} from 'definixswap-uikit-v2'
import styled from 'styled-components'

interface ModalProps {
  balance: string
  period: number
  apr: string
  fee: string
  end: string
  received: string
  unstake: string
  onOK?: () => any
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 464px) {
    width: 416px;
  }
`

const UnstakeModal: React.FC<ModalProps> = ({
  balance,
  period,
  apr,
  fee,
  end,
  received,
  unstake,
  onOK = () => null,
  onDismiss = () => null,
}) => {
  const { t } = useTranslation()

  return (
    <Modal title={`${t('Confirm Unstake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_30">
          <Flex mt="S_14" mb="S_24" justifyContent="space-between" alignItems="flex-start">
            <Flex alignItems="flex-start">
              <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
              <Flex ml="S_10" mt="S_4" flexDirection="column">
                <Text textStyle="R_16M" color="black">
                  {t('FINIX')}
                </Text>
                <Flex my="S_4" alignItems="center" height="12px">
                  <Text mr="S_8" textStyle="R_14R" color="mediumgrey">
                    {period} {t('days')}
                  </Text>
                  <VDivider />
                  <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                    {t('APR')} {apr}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Text mt="S_4" textStyle="R_16R" color="black">
              {balance}
            </Text>
          </Flex>
          <Divider />
          <Flex mt="S_24" flexDirection="column">
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('Early Unstake Fee')}
              </Text>
              <Text textStyle="R_14M" color="deepgrey">
                {fee}
              </Text>
            </Flex>
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('Lock Up Period End')}
              </Text>
              <Flex flexDirection="column" alignItems="flex-end">
                <Text textStyle="R_14M" color="deepgrey">
                  {end}
                </Text>
                <Text textStyle="R_12R" color="mediumgrey">
                  {t('*Asia/Seoul')}
                </Text>
              </Flex>
            </Flex>
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('You will receive')}
              </Text>
              <Text textStyle="R_14M" color="deepgrey">
                {received} {t('FINIX')}
              </Text>
            </Flex>
            <Flex mt="S_12" alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red" width="396px">
                <Trans
                  i18nKey="Do you want to unstake?"
                  values={{ '15-Nov-21 14:57:20 GMT+9': end }}
                  components={{ bold: <strong /> }}
                />
              </Text>
            </Flex>
          </Flex>
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        <Button onClick={onOK}>{unstake}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default UnstakeModal
