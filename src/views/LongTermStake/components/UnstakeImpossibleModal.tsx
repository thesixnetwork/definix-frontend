import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
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
import { useAvailableVotes } from 'hooks/useVoting'
import styled from 'styled-components'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

interface ModalProps {
  days: number
  amount: number
  apr: number
  multiplier: number
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 464px) {
    width: 416px;
  }
`

const UnstakeImpossibleModal: React.FC<ModalProps> = ({ days, amount, apr, multiplier, onDismiss = () => null }) => {
  const { t } = useTranslation()
  const { availableVotes } = useAvailableVotes()

  return (
    <Modal title={`${t('Unstaking Impossible')}`} onDismiss={onDismiss} mobileFull>
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
                    {t(`${days} days`)}
                  </Text>
                  <Flex height="12px">
                    <VDivider color="lightgrey" />
                  </Flex>
                  <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                    {t('APR')} {`${numeral(apr * multiplier || 0).format('0,0.[00]')}%`}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Text mt="S_4" textStyle="R_16R" color="black">
              {getBalanceOverBillion(amount)}
            </Text>
          </Flex>
          <Divider mt="S_24" />
          <Flex mt="S_24" alignItems="flex-start">
            <Flex mt="S_2">
              <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
            </Flex>
            <Text ml="S_4" textStyle="R_14R" color="red" width="396px">
              {t(`You can’t unstake due to`)}
            </Text>
          </Flex>
          <Flex mt="S_20" flexDirection="column">
            <Flex mb="S_8" justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('vFINIX to return')}
              </Text>
              <Text textStyle="R_14M" color="deepgrey">
                {getBalanceOverBillion(amount * multiplier)} {t('vFINIX')}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text textStyle="R_14R" color="mediumgrey">
                {t('Available vFINIX to return')}
              </Text>
              <Text textStyle="R_14M" color="red">
                {getBalanceOverBillion(Number(availableVotes))} {t('vFINIX')}
              </Text>
            </Flex>
          </Flex>
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        <Button height="48px" onClick={onDismiss}>
          {t('Close')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UnstakeImpossibleModal
