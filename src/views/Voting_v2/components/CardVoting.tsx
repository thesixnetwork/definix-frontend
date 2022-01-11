import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { Card, TabBox } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import VotingList from './VotingList';
import { useAllProposalOfType } from '../../../hooks/useVoting'
import { FilterId, ProposalType } from '../types';

interface Props {
  proposalType: ProposalType;
}

const CardVoting: React.FC<Props> = ({ proposalType }) => {
  const { t } = useTranslation();
  const allProposalMap = useAllProposalOfType()
  const listAllProposal = _.get(allProposalMap, 'allProposalMap')
  const [voteList, setVoteList] = useState([]);

  useEffect(() => {
    if (!listAllProposal) return;

    const filterListAllProposal = listAllProposal.filter((item) => {
      return proposalType === ProposalType.ALL ? true : _.get(item, 'proposals_type') === proposalType;
    })

    function getFilterList(filterId: FilterId) {
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


    setVoteList([getFilterList(FilterId.NOW), getFilterList(FilterId.SOON), getFilterList(FilterId.CLOSED)])
    
  }, [listAllProposal, proposalType]);

  const tabs = useMemo(() => [
    {
      name: t('Vote Now'),
      component: <VotingList list={voteList[0]} />,
    },
    {
      name: t('Soon'),
      component: <VotingList list={voteList[1]} />,
    },
    {
      name: t('Closed'),
      component: <VotingList list={voteList[2]} />,
    },
  ], [t, voteList])

  return (
    <Card mt="16px">
      <TabBox tabs={tabs} />
    </Card>
  )
}

export default CardVoting
