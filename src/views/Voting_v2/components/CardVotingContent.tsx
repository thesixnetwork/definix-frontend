import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Card, CardBody, Box, Flex, Text, CheckboxLabel, Checkbox, Button, useModal } from '@fingerlabs/definixswap-uikit-v2'
import ReactMarkdown from 'components/ReactMarkdown'
import UnlockButton from 'components/UnlockButton'
import * as klipProvider from 'hooks/klipProvider'
import { useProposalIndex, useServiceAllowance, useApproveToService, useVote } from 'hooks/useVoting'
import { usePrivateData } from 'hooks/useLongTermStake'
import useRefresh from 'hooks/useRefresh'
import { useToast } from 'state/hooks'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'
import { Voting } from 'state/types'
import Badge from './Badge'
import VotingConfirmModal from './VotingConfirmModal'
import { BadgeType, TransactionState } from '../types'

interface Props {
  id: string;
  proposalIndex: string;
  proposal: Voting;
}

const WrapCard = styled(Card)`
  margin-top: 40px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 28px;
  }
`

const StyledCardBody = styled(CardBody)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 20px;
  }
`

const TextTitle = styled(Text)`
  ${({ theme }) => theme.textStyle.R_18M}
  color: ${({ theme }) => theme.colors.black};
  margin-top: 20px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 12px;
  }
`

const TextEndDate = styled(Text)`
  display: flex;
  ${({ theme }) => theme.textStyle.R_12R}
  color: ${({ theme }) => theme.colors.mediumgrey};
  margin-top: 6px;

  span:nth-child(2) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 10px;

    span:nth-child(2) {
      margin-left: 0;
      margin-top: 2px;
    }
  }
`

const BoxContent = styled(Box)`
  margin-top: 32px;

  > .text {
    ${({ theme }) => theme.textStyle.R_14R}
    color: ${({ theme }) => theme.colors.deepgrey};
    white-space: normal;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 20px;

    > .text {
      ${({ theme }) => theme.textStyle.R_12R}
    }
  }
`

const WrapContent = styled(Flex)`
  flex-direction: column;
  padding-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .badge {
    margin-left: 10px;

    &:nth-child(1) {
      margin-left: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-bottom: 20px;
  }
`

const WrapVote = styled(Flex)`
  flex-direction: column;
  padding-top: 32px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-top: 20px;
  }
`

const WrapBalance = styled(Flex)<{ isMulti: boolean }>`
  justify-content: ${({ isMulti }) => isMulti? 'space-between' : 'flex-end'};
  ${({ theme }) => theme.mediaQueries.mobile} {
    display: none;
  }
`

const WrapMobileBalance = styled(Flex)`
  display: none;
  ${({ theme }) => theme.mediaQueries.mobile} {
    display: flex;
    justify-content: space-between;
  }
`

const WrapMobilePlural = styled(Flex)`
  display: none;
  ${({ theme }) => theme.mediaQueries.mobile} {
    display: flex;
    margin-top: 24px;
  }
`

const WrapChoice = styled(Flex)<{ isParticipated: boolean }>`
  flex-direction: column;
  padding-top: 20px;
  padding-bottom: 10px;

  .mobile-percent {
    display: none;
  }

  .votes {
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.textStyle.R_14R}
  }

  .wrap-votes {
    margin-left: 36px;
    margin-top: 6px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-top: 0;
    padding-bottom: 24px;

    .choice {
      ${({ theme }) => theme.textStyle.R_14R}
    }

    .votes {
      ${({ theme }) => theme.textStyle.R_12R}
    }

    .percent {
      display: none;
    }

    .wrap-votes {
      justify-content: space-between;
      margin-left: ${({ isParticipated }) => isParticipated ? '0' : '36px'};
    }

    .mobile-percent {
      display: block;
    }
  }
`

const Range = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrey30};
  border-radius: 4px;
`

const RangeValue = styled(Box)<{ width: number, isParticipated: boolean, isMax: boolean }>`
  width: ${({ width }) => width}%;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme, isParticipated, isMax }) => isParticipated && isMax ? theme.colors.red : theme.colors.lightbrown};
`

const WrapVoteMore = styled(Flex)`
  button {
    width: 200px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    button {
      width: 50%;
    }
  }
`

const CardVotingContent: React.FC<Props> = ({ proposalIndex, proposal }) => {
  const { t } = useTranslation();
  const { account } = useWallet()
  const [transactionHash, setTransactionHash] = useState('')
  const [mapVoting, setMapVoting] = useState([])
  const { balancevfinix } = usePrivateData()
  const { onCastVote } = useVote()
  const { fastRefresh } = useRefresh()
  const { indexProposal } = useProposalIndex(proposalIndex)
  const allowance = useServiceAllowance()
  const { onApprove } = useApproveToService(klipProvider.MAX_UINT_256_KLIP)
  const isMulti = useMemo(() => proposal.choice_type === 'multi', [proposal]);
  const myVFinixBalance = useMemo(() => getBalanceOverBillion(balancevfinix), [balancevfinix]);
  const [selectedIndexs, setSelectedIndexs] = useState<number[]>([]);
  const selectedVotes = useRef<string[]>([]);
  const { toastSuccess, toastError } = useToast()
  const [trState, setTrState] = useState<TransactionState>(TransactionState.NONE);
  const [isVoteMore, setIsVoteMore] = useState<boolean>(!!proposal.isParticipated);
  const maxVotingIndex = useMemo(() => {
    const votes = mapVoting.map(({ vote }) => vote).slice(0);
    const maxNum = votes.sort()[0];
    return votes.indexOf(maxNum);
  }, [mapVoting]);

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
    if (proposal.isParticipated) {
      setIsVoteMore(!!proposal.isParticipated)
    }
  }, [proposal.isParticipated])

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

  const handleVoteMore = useCallback(() => {
    setIsVoteMore(!isVoteMore);
  }, [isVoteMore]);

  const renderVoteButton = useCallback(() => {
    if (!account) {
      return <UnlockButton width="280px" lg />
    }
    if (isVoteMore) {
      return <Button lg width="280px" onClick={handleVoteMore} variant="line">{t('Vote More')}</Button>  
    }
    if (allowance > 0 || transactionHash !== '') {
      if (proposal.isParticipated && !isVoteMore) {
        return <WrapVoteMore>
          <Button mr="8px" lg variant="line" onClick={() => {
            setIsVoteMore(true);
          }}>{t('Cancel')}</Button>
          <Button ml="8px" lg onClick={() => {
            setTrState(TransactionState.NONE);
            onPresentVotingConfirmModal();
          }} disabled={selectedIndexs.length === 0}>{t('Cast Vote')}</Button>
        </WrapVoteMore>
      }
      return <Button lg width="280px" onClick={() => {
        setTrState(TransactionState.NONE);
        onPresentVotingConfirmModal();
      }} disabled={selectedIndexs.length === 0}>{t('Cast Vote')}</Button>
    }
    return <Button lg width="280px" onClick={handleApprove}>{t('Approve Contract')}</Button>
    
  }, [account, isVoteMore, allowance, transactionHash, handleApprove, t, handleVoteMore, proposal.isParticipated, selectedIndexs.length, onPresentVotingConfirmModal]);

  return (
    <WrapCard>
      <StyledCardBody>
        <WrapContent>
          <Flex>
            {
              proposal.proposals_type === 'core' && <Badge type={BadgeType.CORE} />
            }
            {proposal.isParticipated && <Badge type={BadgeType.PARTICIPATION} />}
          </Flex>
          <TextTitle>{proposal.title}</TextTitle>
          <TextEndDate>
            <span>{t('End Date')}</span>
            <span>{proposal.endTimestamp}</span>
          </TextEndDate>
          <BoxContent>
            <Text className="text">
              <ReactMarkdown>{proposal.content}</ReactMarkdown>
            </Text>
          </BoxContent>
        </WrapContent>
        <WrapVote>
          <WrapBalance isMulti={isMulti}>
            {isMulti && <Text color="orange" textStyle="R_14M">*{t('Plural vote')}</Text>}
            <Flex>
              <Text color="mediumgrey" textStyle="R_14R" mr="8px">{t('Balance')}</Text>
              <Text color="black" textStyle="R_14B" mr="4px">{myVFinixBalance}</Text>
              <Text color="black" textStyle="R_14M">{t('vFINIX')}</Text>
            </Flex>
          </WrapBalance>
          <WrapMobileBalance>
            <Text color="mediumgrey" textStyle="R_14R" mr="8px">{t('Balance')}</Text>
            <Flex>
              <Text color="black" textStyle="R_14B" mr="4px">{myVFinixBalance}</Text>
              <Text color="black" textStyle="R_14M">{t('vFINIX')}</Text>
            </Flex>
          </WrapMobileBalance>
          <WrapMobilePlural>
            {isMulti && <Text color="orange" textStyle="R_12M">*{t('Plural vote')}</Text>}
          </WrapMobilePlural>
          {proposal?.choices && proposal.choices.map((choice, index) => <WrapChoice key={choice} isParticipated={isVoteMore}>
            <Flex justifyContent="space-between" alignItems="center">
              {
                isVoteMore ? <Text className="choice" textStyle="R_16R" color="black">{choice}</Text> : <CheckboxLabel control={<Checkbox checked={selectedIndexs.indexOf(index) > -1} onChange={(e) => onCheckChange(e.target.checked, index)} />} className="mr-12">
                  <Text className="choice" textStyle="R_16R" color="black">{choice}</Text>
                </CheckboxLabel>
              }
              <Text textStyle="R_16M" color="deepgrey" className="percent">{mapVoting[index] ? `${mapVoting[index].percent  }%` : ' '}</Text>
            </Flex>
            <Flex ml={isVoteMore ? '0' : "36px"} mt="14px">
              <Range>
                <RangeValue width={mapVoting[index] ? mapVoting[index].percent : 0} isParticipated={isVoteMore} isMax={maxVotingIndex === index} />
              </Range>
            </Flex>
            <Flex minHeight="20px" className="wrap-votes">
              <Text className="votes">{mapVoting[index] ? `${mapVoting[index].vote} ${t('Votes')}` : ' '}</Text>
              <Text textStyle="R_12M" color="deepgrey" className="mobile-percent">{mapVoting[index] ? `${mapVoting[index].percent  }%` : ' '}</Text>
            </Flex>
          </WrapChoice>)}
          <Flex justifyContent="center" mt="22px">
            {renderVoteButton()}
          </Flex>
        </WrapVote>
      </StyledCardBody>
    </WrapCard>
  )
}

export default CardVotingContent
