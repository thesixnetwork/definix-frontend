import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import {
  Box,
  Flex,
  Text,
  Modal,
  Button,
  Divider,
  ImgTokenFinixIcon,
  AlertIcon,
  ModalBody,
  ModalFooter,
} from '@fingerlabs/definixswap-uikit-v2'
import BalanceText from 'components/BalanceText'
import styled from 'styled-components'

interface ModalProps {
  balance: string
  period: number
  end: string
  earn: number
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

  const getLockDay = (day: number) => {
    switch (day) {
      case 90:
        return 'FINIX amount will be locked 7 days'
      case 180:
        return 'FINIX amount will be locked 14 days'
      case 365:
        return 'FINIX amount will be locked 28 days'
      default:
        return ''
    }
  }

  return (
    <Modal title={`${t('Confirm Stake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_30">
          <Flex mt="S_14" mb="S_24" justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
              <Text ml="S_10" textStyle="R_16M" color="black">
                {t('FINIX')}
              </Text>
            </Flex>
            <BalanceText textStyle="R_16R" color="black" value={balance} />
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
                  {end} GMT+9
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
              <Flex>
                <BalanceText textStyle="R_14M" color="deepgrey" value={earn} />
                <Text ml="S_4" textStyle="R_14M" color="deepgrey">
                  {t('vFINIX')}
                </Text>
              </Flex>
            </Flex>
            <Flex mt="S_12" alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red" width="396px">
                <Trans i18nKey={getLockDay(period)} components={[<strong />]} />
              </Text>
            </Flex>
          </Flex>
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        <Button onClick={onOK}>{t('Stake')}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default StakeModal
