import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import { get } from 'lodash-es'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useWallet from 'hooks/useWallet'
import dayjs from 'dayjs'
import { Flex, Text, Button, useModal } from '@fingerlabs/definixswap-uikit-v2'
import UnlockButton from 'components/UnlockButton'
import * as klipProvider from 'hooks/klipProvider'
import {
  useProposalIndex,
  useServiceAllowance,
  useApproveToService,
  useVote,
  useGetProposal,
  useAllProposalOfAddress,
  useAvailableVotes,
} from 'hooks/useVoting'
import useRefresh from 'hooks/useRefresh'
import { useToast } from 'state/hooks'
import { Voting } from 'state/types'
import VotingConfirmModal from './VotingConfirmModal'
import { TransactionState } from '../types'
import VotingChoiceItem from './VotingChoiceItem'

const WrapVote = styled(Flex)`
  flex-direction: column;
  padding-top: 32px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-top: 20px;
  }
`

const WrapBalance = styled(Flex)<{ isMulti: boolean }>`
  justify-content: ${({ isMulti }) => (isMulti ? 'space-between' : 'flex-end')};
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

const VotingChoice: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const { availableVotes } = useAvailableVotes()
  const [transactionHash, setTransactionHash] = useState('')
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { proposal: getProposal } = useGetProposal()
  const [proposal, setProposal] = useState<Voting>(getProposal)
  const { proposalOfAddress } = useAllProposalOfAddress()
  const [mapVoting, setMapVoting] = useState([])
  const { onCastVote } = useVote()
  const { fastRefresh } = useRefresh()
  const { indexProposal } = useProposalIndex()
  const allowance = useServiceAllowance()
  const { onApprove } = useApproveToService(klipProvider.MAX_UINT_256_KLIP)
  const isMulti = useMemo(() => proposal.choice_type === 'multiple', [proposal])
  const [selectedIndexs, setSelectedIndexs] = useState<number[]>([])
  const selectedVotes = useRef<string[]>([])
  const { toastSuccess, toastError } = useToast()
  const [trState, setTrState] = useState<TransactionState>(TransactionState.NONE)
  const participatedProposal = useMemo(() => {
    return proposalOfAddress.find(({ ipfsHash }) => ipfsHash === id)
  }, [id, proposalOfAddress])
  const [isVoteMore, setIsVoteMore] = useState<boolean>(!!participatedProposal)
  const maxVotingValue = useMemo(() => {
    const votes = mapVoting.map(({ vote }) => vote).slice(0)
    const maxNum = votes.sort()[votes.length - 1]
    return maxNum
  }, [mapVoting])
  const votedChoices = useMemo(() => {
    return participatedProposal ? participatedProposal.choices.map(({ choiceName }) => choiceName) : []
  }, [participatedProposal])
  const isStartDate = useMemo(() => dayjs().isBefore(dayjs(proposal.startEpoch)), [proposal.startEpoch])
  const isEndDate = useMemo(() => dayjs().isAfter(dayjs(proposal.endEpoch)), [proposal.endEpoch])
  const isParticipated = useMemo(() => !!participatedProposal, [participatedProposal])

  useEffect(() => {
    if (getProposal) {
      setProposal(getProposal)
    }

    return () => {
      setProposal({} as Voting)
    }
  }, [getProposal])

  const onVote = useCallback(
    (balances: string[]) => {
      setTrState(TransactionState.START)
      const result = proposal.choices.map((choice, index) => {
        const selectedIndex = selectedIndexs.indexOf(index)
        return selectedIndex > -1
          ? new BigNumber(Number(balances[selectedIndex].replace(',', ''))).times(new BigNumber(10).pow(18)).toFixed()
          : '0'
      })
      const res = onCastVote(proposalIndex, result)
      res
        .then(() => {
          setTrState(TransactionState.SUCCESS)
          !!participatedProposal && setIsVoteMore(true)
          toastSuccess(
            t('{{Action}} Complete', {
              Action: t('actionVote'),
            }),
          )
        })
        .catch(() => {
          setTrState(TransactionState.ERROR)
          !!participatedProposal && setIsVoteMore(true)
          toastError(
            t('{{Action}} Failed', {
              Action: t('actionVote'),
            }),
          )
        })
    },
    [onCastVote, proposal.choices, proposalIndex, selectedIndexs, t, toastError, toastSuccess, participatedProposal],
  )

  const [onPresentVotingConfirmModal, onDismiss] = useModal(
    <VotingConfirmModal proposal={proposal} trState={trState} selectedVotes={selectedVotes.current} onVote={onVote} />,
  )

  useEffect(() => {
    if ([TransactionState.SUCCESS, TransactionState.ERROR].includes(trState)) {
      onDismiss()
    }
  }, [trState])

  useEffect(() => {
    if (isParticipated) {
      setIsVoteMore(isParticipated)
    }
  }, [isParticipated])

  useEffect(() => {
    const voting = indexProposal && get(indexProposal, 'optionVotingPower')
    const array = []
    let proposalMap = []
    const fetch = async () => {
      proposalMap = [proposal]
      if (voting && proposalMap) {
        const sum = voting
          .map((datum) => new BigNumber(datum._hex).dividedBy(new BigNumber(10).pow(18)).toNumber())
          .reduce((a, b) => a + b)

        voting.filter((v, index) => {
          get(proposalMap, '0.choices').map((i, c) => {
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
  }, [fastRefresh, proposal.ipfsHash])

  const onCheckChange = useCallback(
    (isChecked: boolean, index) => {
      function setVoteIndexs(voteIndexs) {
        if (voteIndexs.lnegth === 0) {
          selectedVotes.current = []
          return
        }
        selectedVotes.current = voteIndexs.map((voteIndex) => proposal.choices[voteIndex])
      }

      function addSelectedIndexs(addIndex) {
        const temp = selectedIndexs.slice(0)
        temp.push(addIndex)
        setSelectedIndexs(temp)
        setVoteIndexs(temp)
      }

      function removeSelectedIndexs(removeIndex) {
        const tempIndex = selectedIndexs.indexOf(removeIndex)
        if (tempIndex > -1) {
          const temp = [...selectedIndexs.slice(0, tempIndex), ...selectedIndexs.slice(tempIndex + 1)]
          setSelectedIndexs(temp)
          setVoteIndexs(temp)
        }
      }
      if (isMulti) {
        if (isChecked) {
          addSelectedIndexs(index)
        } else {
          removeSelectedIndexs(index)
        }
        return
      }
      if (isChecked) {
        setSelectedIndexs([index])
        setVoteIndexs([index])
      } else {
        setSelectedIndexs([])
        setVoteIndexs([])
      }
    },
    [isMulti, setSelectedIndexs, selectedIndexs, proposal],
  )

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await onApprove()
      if (txHash) {
        setTransactionHash(get(txHash, 'transactionHash'))
        toastSuccess(
          t('{{Action}} Complete', {
            Action: t('actionApprove'),
          }),
        )
      }
    } catch (e) {
      setTransactionHash('')
      toastError(
        t('{{Action}} Failed', {
          Action: t('actionApprove'),
        }),
      )
    }
  }, [onApprove, t, toastError, toastSuccess])

  const handleVoteMore = useCallback(() => {
    setIsVoteMore(!isVoteMore)
  }, [isVoteMore])

  const renderVoteButton = useCallback(() => {
    if (isStartDate || isEndDate) {
      return <></>
    }
    if (!account) {
      return <UnlockButton width="280px" lg />
    }
    if (isVoteMore) {
      return (
        <Button lg width="280px" onClick={handleVoteMore} variant="line">
          {t('Vote More')}
        </Button>
      )
    }
    if (allowance > 0 || transactionHash !== '') {
      if (participatedProposal && !isVoteMore) {
        return (
          <WrapVoteMore>
            <Button
              mr="8px"
              lg
              variant="line"
              onClick={() => {
                setIsVoteMore(true)
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              ml="8px"
              lg
              onClick={() => {
                setTrState(TransactionState.NONE)
                onPresentVotingConfirmModal()
              }}
              disabled={selectedIndexs.length === 0}
            >
              {t('Cast Vote')}
            </Button>
          </WrapVoteMore>
        )
      }
      return (
        <Button
          lg
          width="280px"
          onClick={() => {
            setTrState(TransactionState.NONE)
            onPresentVotingConfirmModal()
          }}
          disabled={selectedIndexs.length === 0}
        >
          {t('Cast Vote')}
        </Button>
      )
    }
    return (
      <Button lg width="280px" onClick={handleApprove}>
        {t('Approve Contract')}
      </Button>
    )
  }, [
    account,
    isVoteMore,
    isEndDate,
    isStartDate,
    allowance,
    transactionHash,
    handleApprove,
    t,
    handleVoteMore,
    participatedProposal,
    selectedIndexs.length,
    onPresentVotingConfirmModal,
  ])

  return (
    <WrapVote>
      <WrapBalance isMulti={isMulti}>
        {isMulti && (
          <Text color="orange" textStyle="R_14M">
            *{t('Plural vote')}
          </Text>
        )}
        <Flex>
          <Text color="mediumgrey" textStyle="R_14R" mr="8px">
            {t('My Voting Power')}
          </Text>
          <Text color="black" textStyle="R_14B" mr="4px">
            {numeral(availableVotes).format('0,0.00')}
          </Text>
          <Text color="black" textStyle="R_14M">
            {t('vFINIX')}
          </Text>
        </Flex>
      </WrapBalance>
      <WrapMobileBalance>
        <Text color="mediumgrey" textStyle="R_14R" mr="8px">
          {t('My Voting Power')}
        </Text>
        <Flex>
          <Text color="black" textStyle="R_14B" mr="4px">
            {numeral(availableVotes).format('0,0.00')}
          </Text>
          <Text color="black" textStyle="R_14M">
            {t('vFINIX')}
          </Text>
        </Flex>
      </WrapMobileBalance>
      <WrapMobilePlural>
        {isMulti && (
          <Text color="orange" textStyle="R_12M" mb="8px">
            *{t('Plural vote')}
          </Text>
        )}
      </WrapMobilePlural>
      {proposal?.choices &&
        proposal.choices.map((choice, index) => (
          <VotingChoiceItem
            key={index}
            choice={choice}
            index={index}
            maxVotingValue={maxVotingValue}
            votingResult={mapVoting[index]}
            isVoteMore={isVoteMore}
            isChecked={selectedIndexs.indexOf(index) > -1}
            isVoted={votedChoices.includes(choice)}
            isMulti={isMulti}
            isStartDate={isStartDate}
            isEndDate={isEndDate}
            isParticipated={isParticipated}
            onCheckChange={onCheckChange}
          />
        ))}
      <Flex justifyContent="center" mt="22px">
        {mapVoting[0] ? renderVoteButton() : <></>}
      </Flex>
    </WrapVote>
  )
}

export default VotingChoice
