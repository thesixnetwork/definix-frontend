import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Card, Box, Flex, Text, CheckboxLabel, Checkbox, Button, useModal } from '@fingerlabs/definixswap-uikit-v2'
import ReactMarkdown from 'components/ReactMarkdown'
import UnlockButton from 'components/UnlockButton'
import * as klipProvider from 'hooks/klipProvider'
import { useProposalIndex, useGetProposal, useServiceAllowance, useApproveToService, useVote } from 'hooks/useVoting'
import { usePrivateData } from 'hooks/useLongTermStake'
import useRefresh from 'hooks/useRefresh'
import { useToast } from 'state/hooks'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'
import Badge from './Badge'
import VotingConfirmModal from './VotingConfirmModal'
import { BadgeType, TransactionState } from '../types'



const WrapContent = styled(Flex)`
  flex-direction: column;
  padding-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const WrapVote = styled(Flex)`
  flex-direction: column;
  padding-top: 32px;
`

const Range = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrey30};
  border-radius: 4px;
`

const RangeValue = styled(Box)<{ width: number }>`
  width: ${({ width }) => width}%;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.lightbrown};
`

const CardVotingContent: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWallet()
  const [transactionHash, setTransactionHash] = useState('')
  const [mapVoting, setMapVoting] = useState([])
  const { balancevfinix } = usePrivateData()
  const { onCastVote } = useVote()
  const { fastRefresh } = useRefresh()
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { indexProposal } = useProposalIndex(proposalIndex)
  const { proposal } = useGetProposal(id)
  const allowance = useServiceAllowance()
  const { onApprove } = useApproveToService(klipProvider.MAX_UINT_256_KLIP)
  const isMulti = useMemo(() => proposal.choice_type === 'multi', [proposal]);
  const myVFinixBalance = useMemo(() => getBalanceOverBillion(balancevfinix), [balancevfinix]);
  const [selectedIndexs, setSelectedIndexs] = useState<number[]>([]);
  const selectedVotes = useRef<string[]>([]);
  const { toastSuccess, toastError } = useToast()
  const [trState, setTrState] = useState<TransactionState>(TransactionState.NONE);

  const onVote = useCallback((balances: string[]) => {
    setTrState(TransactionState.START);
    const result = proposal.choices.map((choice, index) => {
      const selectedIndex = selectedIndexs.indexOf(index);
      return selectedIndex > -1 ? new BigNumber(Number(balances[selectedIndex].replace(',', ''))).times(new BigNumber(10).pow(18)).toFixed() : '0';
    })
    const res = onCastVote(proposalIndex, result)
    res
      .then(() => {
        setTrState(TransactionState.SUCCESS);
        toastSuccess(t('{{Action}} Complete', {
          Action: t('actionVote')
        }));
      })
      .catch(() => {
        setTrState(TransactionState.ERROR);
        toastError(t('{{Action}} Failed', {
          Action: t('actionVote')
        }));
      })
  }, [onCastVote, proposal.choices, proposalIndex, selectedIndexs, t, toastError, toastSuccess]);

  const [onPresentVotingConfirmModal, onDismiss] = useModal(<VotingConfirmModal trState={trState} selectedVotes={selectedVotes.current} onVote={onVote} />);

  useEffect(() => {
    if ([TransactionState.SUCCESS, TransactionState.ERROR].includes(trState)) {
      onDismiss();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trState]);

  useEffect(() => {
    const voting = indexProposal && _.get(indexProposal, 'optionVotingPower')
    const array = []
    let proposalMap = []
    const fetch = async () => {
      proposalMap = [proposal]
      if (voting && proposalMap) {
        const sum = voting
          .map((datum) => new BigNumber(datum._hex).dividedBy(new BigNumber(10).pow(18)).toNumber())
          .reduce((a, b) => a + b)

        voting.filter((v, index) => {
          _.get(proposalMap, '0.choices').map((i, c) => {
            if (index === c) {
              array.push({
                vote: new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber(),
                value: i,
                percent: Number(
                  (new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber() / sum) * 100,
                ).toFixed(2),
              })
            }
            return array
          })

          return array
        })
      }
      setMapVoting(array)
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastRefresh])

  const onCheckChange = useCallback((isChecked: boolean, index) => {
    function setVoteIndexs(voteIndexs) {
      if (voteIndexs.lnegth === 0) {
        selectedVotes.current = [];
        return;  
      }
      selectedVotes.current = voteIndexs.map((voteIndex) => proposal.choices[voteIndex]);
    }

    function addSelectedIndexs(addIndex) {
      const temp = selectedIndexs.slice(0);
      temp.push(addIndex)
      setSelectedIndexs(temp);
      setVoteIndexs(temp);
    }

    function removeSelectedIndexs(removeIndex) {
      const tempIndex = selectedIndexs.indexOf(removeIndex);
      if (tempIndex > -1) {
        const temp = [
          ...selectedIndexs.slice(0, tempIndex),
          ...selectedIndexs.slice(tempIndex + 1)
        ];
        setSelectedIndexs(temp);
        setVoteIndexs(temp);
      }
    }
    if (isMulti) {
      if (isChecked) {
        addSelectedIndexs(index);
      } else {
        removeSelectedIndexs(index);
      }
      return;
    }
    if (isChecked) {
      setSelectedIndexs([index]);
      setVoteIndexs([index]);
    } else {
      setSelectedIndexs([]);
      setVoteIndexs([]);
    }
  }, [isMulti, setSelectedIndexs, selectedIndexs, proposal]);

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await onApprove()
      if (txHash) {
        setTransactionHash(_.get(txHash, 'transactionHash'))
      }
    } catch (e) {
      setTransactionHash('')
    }
  }, [onApprove])

  const renderVoteButton = useCallback(() => {
    if (!account) {
      return <UnlockButton width="280px" />
    } 
    if (allowance > 0 || transactionHash !== '') {
      return <Button lg width="280px" onClick={() => {
        setTrState(TransactionState.NONE);
        onPresentVotingConfirmModal();
      }} disabled={selectedIndexs.length === 0}>{t('Cast Vote')}</Button>
    }
    return <Button lg width="280px" onClick={handleApprove}>{t('Approve Contract')}</Button>
    
  }, [account, allowance, selectedIndexs.length, t, handleApprove, transactionHash, onPresentVotingConfirmModal]);

  return (
    <Card mt="40px" p="32px">
      <WrapContent>
        <Flex>
          {
            proposal.proposals_type === 'core' && <Badge type={BadgeType.CORE} />
          }
        </Flex>
        <Text textStyle="R_18M" color="black" mt="20px">{proposal.title}</Text>
        <Text textStyle="R_12R" color="mediumgrey" mt="6px">
          <span>{t('End Date')}</span>
          <span>{proposal.endTimestamp}</span>
        </Text>
        <Box mt="32px">
          <Text textStyle="R_14R" color="deepgrey" style={{
            whiteSpace: 'normal'
          }}>
            <ReactMarkdown>{proposal.content}</ReactMarkdown>
          </Text>
        </Box>
      </WrapContent>
      <WrapVote>
        <Flex justifyContent={isMulti ? 'space-between' : 'flex-end'}>
          {isMulti && <Text color="orange" textStyle="R_14M">*{t('Plural vote')}</Text>}
          <Flex>
            <Text color="mediumgrey" textStyle="R_14R" mr="8px">{t('Balance')}</Text>
            <Text color="black" textStyle="R_14B" mr="4px">{myVFinixBalance}</Text>
            <Text color="black" textStyle="R_14M">{t('vFINIX')}</Text>
          </Flex>
        </Flex>
        {proposal?.choices && proposal.choices.map((choice, index) => <Flex key={choice} flexDirection="column" pt="20px" pb="10px">
            <Flex justifyContent="space-between" alignItems="center">
            <CheckboxLabel control={<Checkbox checked={selectedIndexs.indexOf(index) > -1} onChange={(e) => onCheckChange(e.target.checked, index)} />} className="mr-12">
              <Text textStyle="R_16R" color="black">{choice}</Text>
            </CheckboxLabel>
            <Text textStyle="R_16M" color="deepgrey">{mapVoting[index] ? `${mapVoting[index].percent  }%` : ' '}</Text>
          </Flex>
          <Flex ml="36px" mt="14px">
            <Range>
              <RangeValue width={mapVoting[index] ? mapVoting[index].percent : 0} />
            </Range>
          </Flex>
          <Flex ml="36px" mt="6px" minHeight="20px">
            <Text textStyle="R_14R" color="mediumgrey">{mapVoting[index] ? `${mapVoting[index].vote} ${t('Votes')}` : ' '}</Text>
          </Flex>
        </Flex>)}
        <Flex justifyContent="center" mt="22px">
          {renderVoteButton()}
        </Flex>
      </WrapVote>
    </Card>
  )
}

export default CardVotingContent
