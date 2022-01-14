import React, { useState, useCallback, useMemo } from 'react'
import {
  Modal,
  ModalProps,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
} from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import ConfirmContentModal from './ConfirmContentModal'
import VotingContentModal from './VotingContentModal'
import { TransactionState, ModalState } from '../types'

interface Props extends ModalProps {
  selectedVotes: string[];
  onVote: (balances: string[]) => void;
  trState: TransactionState;
}

const ModalBodyWrap = styled(ModalBody)`
  margin-top: ${({ theme }) => theme.spacing.S_16}px;
  width: 464px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
  }
`

const VotingConfirmModal: React.FC<Props> = ({ onDismiss, selectedVotes, onVote, trState }) => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<ModalState>(ModalState.VOTING);
  const [balances, setBalances] = useState<string[]>(selectedVotes.map(() => '0'));
  const [showNotis, setShowNotis] = useState<string[]>([]);
  const isNext = useMemo(() => balances.length === 0 || balances.some((balance) => !balance || +balance <= 0 || showNotis.some((showNoti) => showNoti.length > 0)), [balances, showNotis]);
  const isVotingModal = useMemo(() => activeModal === ModalState.VOTING, [activeModal])

  const onPrev = useCallback(() => {
    setActiveModal(ModalState.VOTING);
  }, []);

  const onNext = useCallback(() => {
    setActiveModal(ModalState.CONFIRM);
  }, []);

  return (
    <Modal title={t('Voting')} onDismiss={onDismiss} mobileFull>
      <ModalBodyWrap isBody>
        {isVotingModal ? <VotingContentModal selectedVotes={selectedVotes} balances={balances} setBalances={setBalances} showNotis={showNotis} setShowNotis={setShowNotis} /> : <ConfirmContentModal selectedVotes={selectedVotes} balances={balances} />}
      </ModalBodyWrap>
      <ModalFooter isFooter>
        {isVotingModal ? <Button lg onClick={onNext} disabled={isNext}>{t('Next')}</Button> : <Flex>
          <Button width="50%" mr="8px" lg variant="line" onClick={onPrev}>{t('Back')}</Button>
          <Button width="50%" ml="8px" lg onClick={() => onVote(balances)} disabled={trState === TransactionState.START}>{t('Cast Vote')}</Button>
        </Flex>}
      </ModalFooter>
    </Modal>
  )
}

export default VotingConfirmModal
