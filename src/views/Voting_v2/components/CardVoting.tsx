import React, { useEffect, useMemo, useRef, useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components';
import { Card, Flex, Tabs } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { VotingItem } from 'state/types';
import VotingList from './VotingList';
import { useAllProposalOfType, useAllProposalOfAddress } from '../../../hooks/useVoting'
import { FilterId, ProposalType } from '../types';

interface Props {
  proposalType: ProposalType;
  isParticipated: boolean;
}

const ContentArea = styled(Flex)`
  width: 100%;
`

const StyledTabs = styled(Tabs)`
  ${({ theme }) => theme.textStyle.R_16B}

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 33%;
    padding: 18px 0;
    ${({ theme }) => theme.textStyle.R_14B}
  }
`

const CardVoting: React.FC<Props> = ({ proposalType, isParticipated }) => {
  const { t } = useTranslation();
  const allProposalMap = useAllProposalOfType()
  const { proposalOfAddress } = useAllProposalOfAddress()
  const listAllProposal: VotingItem[] = _.get(allProposalMap, 'allProposalMap')
  const [voteList, setVoteList] = useState([]);
  const participatedVotes = useMemo(() => {
    return proposalOfAddress.map(({ ipfsHash }) => ipfsHash)
  }, [proposalOfAddress]);
  const tabs = useMemo(() => [
    {
      name: t('Vote Now'),
      component: <VotingList list={voteList[0]} />,
    },
    {
      name: t('Soon'),
      component: <VotingList isStartDate list={voteList[1]} />,
    },
    {
      name: t('Closed'),
      component: <VotingList list={voteList[2]} />,
    },
  ], [t, voteList])
  const [curTab, setCurTab] = useState<string>(tabs[0]?.name);

  const tabNames = useRef(tabs.map(({ name }) => name));

  useEffect(() => {
    if (!listAllProposal) return;

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
    
  }, [isParticipated, listAllProposal, participatedVotes, proposalType]);

  const onClickTab = (name: string) => {
    setCurTab(name);
  };

  return (
    <Card mt="16px">
      <StyledTabs tabs={tabNames.current} curTab={curTab} setCurTab={onClickTab} />
      <ContentArea>
        {tabs.map(({ name, component }) => (curTab === name ? component : null))}
      </ContentArea>
    </Card>
  )
}

export default CardVoting
