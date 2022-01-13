import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  Modal,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
  Button,
} from '@fingerlabs/definixswap-uikit-v2'
import VoteOptionLabel from './VoteOptionLabel'

const ModalBodyWrap = styled(ModalBody)`
  margin-top: ${({ theme }) => theme.spacing.S_16}px;
  width: 464px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
  }
`

const VotingReceipt = styled(Flex)`
  flex-direction: column;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const ConfirmModal = ({
  onDismiss = () => null,
}) => {
  const { t } = useTranslation();
  return (
    <Modal title={t('Confirm Voting')} onDismiss={onDismiss} mobileFull>
      <ModalBodyWrap isBody>
        <VotingReceipt>
          <Flex justifyContent="space-between">
            <VoteOptionLabel label="test1" />
            <Text textStyle="R_14M">1,000,000,000</Text>
          </Flex>
        </VotingReceipt>
        <Flex flexDirection="column" pt="24px">
          <Flex justifyContent="space-between">
            <Text textStyle="R_14R" color="mediumgrey">{t('Period End')}</Text>
            <Flex flexDirection="column" alignItems="flex-end">
              <Text textStyle="R_14M" color="deepgrey">08-Nov-21 14:57:20</Text>
              <Text textStyle="R_12R" color="mediumgrey">*GMT+9 Asia/Seoul</Text>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" mt="10px">
            <Text textStyle="R_14R" color="mediumgrey">{t('Total Vote')}</Text>
            <Flex>
              <Text textStyle="R_14B" color="black">246,913,578</Text>
              <Text textStyle="R_14B" color="black" ml="5px">{t('vFINIX')}</Text>
            </Flex>
          </Flex>
          
        </Flex>
      </ModalBodyWrap>
      <ModalFooter isFooter>
        <Flex>
          <Button width="50%" mr="8px" lg variant="line">{t('Back')}</Button>
          <Button width="50%" ml="8px" lg>{t('Cast Vote')}</Button>
        </Flex>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmModal
