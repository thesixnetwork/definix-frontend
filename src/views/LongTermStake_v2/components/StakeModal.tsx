import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text, Modal, Button, Divider, ImgTokenFinixIcon, AlertIcon } from 'definixswap-uikit'
import styled from 'styled-components'

interface ModalProps {
  balance: string
  period: string
  end: string
  earn: string
  onOK?: () => any
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 464px) {
    width: 416px;
  }
`

const StakeModal: React.FC<ModalProps> = ({
  balance,
  period,
  end,
  earn,
  onOK = () => null,
  onDismiss = () => null,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Modal title={`${t('Confirm Stake')}`} onDismiss={onDismiss} mobileFull>
        <StyledBox mb="S_30">
          <Flex mt="S_14" mb="S_24" justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
              <Text ml="S_10" textStyle="R_16M" color="black">
                {t('FINIX')}
              </Text>
            </Flex>
            <Text textStyle="R_16R" color="black">
              {balance}
            </Text>
          </Flex>
          <Divider />
          <Flex mt="S_24" flexDirection="column">
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('Stake Period')}
              </Text>
              <Text textStyle="R_14M" color="deepgrey">
                {period} {t('days')}
              </Text>
            </Flex>
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('Period End')}
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
                {t('vFINIX Earn')}
              </Text>
              <Text textStyle="R_14M" color="deepgrey">
                {earn} {t('vFINIX')}
              </Text>
            </Flex>
            <Flex mt="S_12" alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red">
                {t('FINIX amount will be locked 7 days')}
              </Text>
            </Flex>
          </Flex>
        </StyledBox>
        <Button onClick={onOK}>{t('Stake')}</Button>
      </Modal>
    </>
  )
}

export default StakeModal
