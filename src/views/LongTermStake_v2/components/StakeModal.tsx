import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text, Modal, Button, Divider } from 'definixswap-uikit'
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
              <img
                style={{ marginRight: '10px' }}
                width={32}
                height={32}
                src={ImgTokenFinix}
                srcSet={`${ImgTokenFinix2x} 2x, ${ImgTokenFinix3x} 3x`}
                alt="Token-Finix"
              />
              <Text textStyle="R_16M" color="black">
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
                {period}
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
              <img
                style={{ marginTop: '2px', marginRight: '4px' }}
                width={16}
                height={16}
                src={IconAlert}
                srcSet={`${IconAlert2x} 2x, ${IconAlert3x} 3x`}
                alt="Icon-Alert"
              />
              <Text textStyle="R_14R" color="red">
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
