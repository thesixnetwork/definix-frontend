import React, { useMemo, useState } from 'react'
import { get } from 'lodash-es'
import dayjs from 'dayjs'
import { Card, Tabs, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { VotingItem } from 'state/types'
import VotingList from './VotingList'
import { useAllProposalOfType, useAllProposalOfAddress } from '../../../hooks/useVoting'
import { FilterId, ProposalType } from '../types'
import useWallet from 'hooks/useWallet'

interface Props {
  proposalType: ProposalType
  isParticipated: boolean
}

function getFilterList(filterListAllProposal, filterId: FilterId) {
  const list = filterListAllProposal.filter((item) => {
    switch (filterId) {
      case FilterId.SOON:
        return (
          Number(get(item, 'start_unixtimestamp')) * 1000 > Date.now() &&
          Number(get(item, 'end_unixtimestamp')) * 1000 > Date.now()
        )

      case FilterId.CLOSED:
        return (
          Number(get(item, 'start_unixtimestamp')) * 1000 < Date.now() &&
          Number(get(item, 'end_unixtimestamp')) * 1000 < Date.now()
        )

      case FilterId.NOW:
      default:
        return (
          Number(get(item, 'start_unixtimestamp')) * 1000 < Date.now() &&
          Number(get(item, 'end_unixtimestamp')) * 1000 > Date.now()
        )
    }
  })

  switch (filterId) {
    case FilterId.SOON:
      return list.sort((a, b) => dayjs(a.endTimestamp).valueOf() - dayjs(b.endTimestamp).valueOf())

    case FilterId.CLOSED:
      return list.sort((a, b) => dayjs(b.startTimestamp).valueOf() - dayjs(a.startTimestamp).valueOf())

    case FilterId.NOW:
    default:
      return list.sort((a, b) => dayjs(a.endTimestamp).valueOf() - dayjs(b.endTimestamp).valueOf())
  }
}

const CardVoting: React.FC<Props> = ({ proposalType, isParticipated }) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const { isMobile } = useMatchBreakpoints()
  const allProposalMap = useAllProposalOfType()
  const { proposalOfAddress } = useAllProposalOfAddress()
  const listAllProposal: VotingItem[] = get(allProposalMap, 'allProposalMap')
  const participatedVotes = useMemo(() => {
    return proposalOfAddress ? proposalOfAddress.map(({ ipfsHash }) => ipfsHash) : null
  }, [proposalOfAddress])
  const voteList = useMemo(() => {
    if (listAllProposal && listAllProposal.length > 0) {
      const participatedAllProposal = listAllProposal.map((item: VotingItem) => {
        if (!account) {
          return {
            isParticipated: false,
            ...item,
          }
        }
        if (!participatedVotes) {
          return item
        }
        if (participatedVotes.includes(get(item, 'ipfsHash'))) {
          return {
            isParticipated: true,
            ...item,
          }
        } else {
          return {
            isParticipated: false,
            ...item,
          }
        }
      })

      const filterListAllProposal = participatedAllProposal.filter((item) => {
        if (isParticipated && !item.isParticipated) {
          return false
        }
        return proposalType === ProposalType.ALL ? true : get(item, 'proposals_type') === proposalType
      })

      return [
        getFilterList(filterListAllProposal, FilterId.NOW),
        getFilterList(filterListAllProposal, FilterId.SOON),
        getFilterList(filterListAllProposal, FilterId.CLOSED),
      ]
    }
    return []
  }, [isParticipated, listAllProposal, participatedVotes, proposalType, account])

  const tabs = useMemo(
    () => [
      {
        id: 'votenow',
        name: t('Vote Now'),
      },
      {
        id: 'soon',
        name: t('Soon'),
      },
      {
        id: 'closed',
        name: t('Closed'),
      },
    ],
    [t],
  )
  const [curTab, setCurTab] = useState(tabs[0].id)

  return (
    <Card mt="16px">
      <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} equal={isMobile} />
      {curTab === 'votenow' && <VotingList key="votenow" list={voteList[0]} />}
      {curTab === 'soon' && <VotingList key="soon" isStartDate list={voteList[1]} />}
      {curTab === 'closed' && <VotingList key="closed" list={voteList[2]} />}
    </Card>
  )
}

export default CardVoting
