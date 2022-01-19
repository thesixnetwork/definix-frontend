import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { Card, TabBox, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { VotingItem } from 'state/types';
import VotingList from './VotingList';
import { useAllProposalOfType, useAllProposalOfAddress } from '../../../hooks/useVoting'
import { FilterId, ProposalType } from '../types';

interface Props {
  proposalType: ProposalType;
  isParticipated: boolean;
}

function getFilterList(filterListAllProposal, filterId: FilterId) {
  const list = filterListAllProposal.filter((item) => {
    switch (filterId) {
      case FilterId.SOON:
        return (
          Number(_.get(item, 'start_unixtimestamp')) * 1000 > Date.now() &&
          Number(_.get(item, 'end_unixtimestamp')) * 1000 > Date.now()
        )

      case FilterId.CLOSED:
        return (
          Number(_.get(item, 'start_unixtimestamp')) * 1000 < Date.now() &&
          Number(_.get(item, 'end_unixtimestamp')) * 1000 < Date.now()
        )

      case FilterId.NOW:
      default:
        return (
          Number(_.get(item, 'start_unixtimestamp')) * 1000 < Date.now() &&
          Number(_.get(item, 'end_unixtimestamp')) * 1000 > Date.now()
        )
    }
  })
  return list.sort((a, b) => _.get(a, 'end_unixtimestamp') - _.get(b, 'end_unixtimestamp'))
}

const CardVoting: React.FC<Props> = ({ proposalType, isParticipated }) => {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();
  const allProposalMap = useAllProposalOfType()
  const { proposalOfAddress } = useAllProposalOfAddress()
  const listAllProposal: VotingItem[] = _.get(allProposalMap, 'allProposalMap')
  const [voteList, setVoteList] = useState([]);
  const participatedVotes = useMemo(() => {
    return proposalOfAddress.map(({ ipfsHash }) => ipfsHash)
  }, [proposalOfAddress]);
  const tabs = useMemo(() => [
    {
      id: 'votenow',
      name: t('Vote Now'),
      component: <VotingList key="votenow" list={voteList[0]} />,
    },
    {
      id: 'soon',
      name: t('Soon'),
      component: <VotingList key="soon" isStartDate list={voteList[1]} />,
    },
    {
      id: 'closed',
      name: t('Closed'),
      component: <VotingList key="closed" list={voteList[2]} />,
    },
  ], [t, voteList])

  useEffect(() => {
    if (listAllProposal) {
      const participatedAllProposal = listAllProposal.map((item: VotingItem) => {
        if (participatedVotes.includes(_.get(item, 'ipfsHash'))) {
          return {
            isParticipated: true,
            ...item,
          }
        }
        return item;
      })
  
      const filterListAllProposal = participatedAllProposal.filter((item) => {
        if (isParticipated && !item.isParticipated) {
          return false;
        }
        return proposalType === ProposalType.ALL ? true : _.get(item, 'proposals_type') === proposalType;
      })
  
      setVoteList([getFilterList(filterListAllProposal, FilterId.NOW), getFilterList(filterListAllProposal, FilterId.SOON), getFilterList(filterListAllProposal, FilterId.CLOSED)])
    }

    
  }, [isParticipated, listAllProposal, participatedVotes, proposalType]);

  return (
    <Card mt="16px">
      <TabBox tabs={tabs} equal={isMobile} />
    </Card>
  )
}

export default CardVoting
