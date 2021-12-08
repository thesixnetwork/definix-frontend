import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text, Modal, Button, Divider, VDivider } from 'definixswap-uikit'
import styled from 'styled-components'

import ImgTokenFinix from '../../../assets/images/img-token-finix.png'
import ImgTokenFinix2x from '../../../assets/images/img-token-finix@2x.png'
import ImgTokenFinix3x from '../../../assets/images/img-token-finix@3x.png'
import IconAlert from '../../../assets/images/ico-16-alert.png'
import IconAlert2x from '../../../assets/images/ico-16-alert@2x.png'
import IconAlert3x from '../../../assets/images/ico-16-alert@3x.png'

interface ModalProps {
  balance: string
  period: string
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
    <>
      <Modal title={`${t('Confirm Unstake')}`} onDismiss={onDismiss} mobileFull>
        <StyledBox mb="S_30">
          <Flex mt="S_14" mb="S_24" justifyContent="space-between" alignItems="flex-start">
            <Flex alignItems="flex-start">
              <img
                style={{ marginRight: '10px' }}
                width={32}
                height={32}
                src={ImgTokenFinix}
                srcSet={`${ImgTokenFinix2x} 2x, ${ImgTokenFinix3x} 3x`}
                alt="Token-Finix"
              />
              <Flex mt="S_4" flexDirection="column">
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
              <img
                style={{ marginTop: '2px', marginRight: '4px' }}
                width={16}
                height={16}
                src={IconAlert}
                srcSet={`${IconAlert2x} 2x, ${IconAlert3x} 3x`}
                alt="Icon-Alert"
              />
              <Text textStyle="R_14R" color="red">
                {t('Do you want to unstake?', { '15-Nov-21 14:57:20 GMT+9': end })}
              </Text>
            </Flex>
          </Flex>
        </StyledBox>
        <Button onClick={onOK}>{unstake}</Button>
      </Modal>
    </>
  )
}

export default UnstakeModal
