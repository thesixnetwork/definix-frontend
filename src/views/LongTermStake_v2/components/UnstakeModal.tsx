import React from 'react'
import numeral from 'numeral'
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
} from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface ModalProps {
  canBeUnlock: boolean
  balance: number
  period: number
  apr: number
  fee: number
  periodPenalty: string
  received: number
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
  canBeUnlock,
  balance,
  period,
  apr,
  fee,
  periodPenalty,
  received,
  onOK = () => null,
  onDismiss = () => null,
}) => {
  const { t } = useTranslation()

  return (
    <Modal title={`${t('Confirm Unstake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_10">
          <Flex mt="S_14" justifyContent="space-between" alignItems="flex-start">
            <Flex alignItems="flex-start">
              <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
              <Flex ml="S_10" mt="S_4" flexDirection="column">
                <Text textStyle="R_16M" color="black">
                  {t('FINIX')}
                </Text>
                <Flex my="S_4" alignItems="center">
                  <Text mr="S_8" textStyle="R_14R" color="mediumgrey">
                    {period} {t('days')}
                  </Text>
                  <Flex height="12px">
                    <VDivider color="lightgrey" />
                  </Flex>
                  <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                    {t('APR')} {numeral(apr).format('0, 0.[00]')}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Text mt="S_4" textStyle="R_16R" color="black">
              {numeral(balance).format(0, 0)}
            </Text>
          </Flex>
          {!canBeUnlock && (
            <>
              <Divider mt="S_24" />
              <Flex mt="S_24" flexDirection="column">
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('Early Unstake Fee')}
                  </Text>
                  <Text textStyle="R_14M" color="deepgrey">
                    {fee}%
                  </Text>
                </Flex>
                <Flex mb="S_8" justifyContent="space-between">
                  <Text textStyle="R_14R" color="mediumgrey">
                    {t('Lock Up Period End')}
                  </Text>
                  <Flex flexDirection="column" alignItems="flex-end">
                    <Text textStyle="R_14M" color="deepgrey">
                      {periodPenalty} GMT+9
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
                    {numeral(received).format(0, 0)} {t('FINIX')}
                  </Text>
                </Flex>
                <Flex mt="S_12" alignItems="flex-start">
                  <Flex mt="S_2">
                    <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
                  </Flex>
                  <Text ml="S_4" textStyle="R_14R" color="red" width="396px">
                    <Trans
                      i18nKey="Do you want to unstake?"
                      values={{ '15-Nov-21 14:57:20 GMT+9': `${periodPenalty} GMT+9` }}
                      components={[<strong />]}
                    />
                  </Text>
                </Flex>
              </Flex>
            </>
          )}
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        <Button onClick={onOK}>{canBeUnlock ? t('Unstake') : t('Early Unstake')}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default UnstakeModal
