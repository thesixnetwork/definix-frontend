import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import numeral from 'numeral'
import {
  Flex,
  Text,
  ModalProps,
} from '@fingerlabs/definixswap-uikit-v2'
import VoteOptionLabel from './VoteOptionLabel'
import Translate from './Translate'

interface Props extends ModalProps {
  selectedVotes: string[];
  balances: string[];
}

const VotingReceipt = styled(Flex)`
  flex-direction: column;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const ConfirmContentModal: React.FC<Props> = ({ selectedVotes, balances }) => {
  const { t } = useTranslation();
  const totalBalance = useMemo(() => balances.slice(1).reduce((sum, cur) => {
    sum.add(cur);
    return sum;
  }, numeral(balances[0])), [balances]);

  return (
    <>
      <VotingReceipt>
        {
          selectedVotes.map((selectedVote, index) => <Flex justifyContent="space-between">
            <VoteOptionLabel label={<Translate text={selectedVote} type="opinion" />} />
            <Text textStyle="R_14M">{numeral(balances[index]).format('0,0.00')}</Text>
          </Flex>)
        }
      </VotingReceipt>
      <Flex flexDirection="column" pt="24px">
        <Flex justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">{t('Period End')}</Text>
          <Flex flexDirection="column" alignItems="flex-end">
            <Text textStyle="R_14M" color="deepgrey">test</Text>
            <Text textStyle="R_12R" color="mediumgrey">*GMT+9 Asia/Seoul</Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" mt="10px">
          <Text textStyle="R_14R" color="mediumgrey">{t('Total Vote')}</Text>
          <Flex>
            <Text textStyle="R_14B" color="black">{totalBalance.format('0,0.00')}</Text>
            <Text textStyle="R_14B" color="black" ml="5px">{t('vFINIX')}</Text>
          </Flex>
        </Flex>
        
      </Flex>
    </>
  )
}

export default ConfirmContentModal
