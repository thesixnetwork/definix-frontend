/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, TabBox } from '@fingerlabs/definixswap-uikit-v2'
import { Voting } from 'state/types';
import InfoDetail from './InfoDetail';
import InfoVotes from './InfoVotes';

interface Props {
  id: string;
  proposalIndex: string;
  proposal: Voting;
}

const VotingInfo: React.FC<Props> = ({ id, proposal, proposalIndex }) => {
  const { t } = useTranslation();
  const tabs = useMemo(() => [
    {
      name: t('Detail'),
      component: <InfoDetail id={id} proposal={proposal} />,
    },
    {
      name: t('Votes'),
      component: <InfoVotes id={id} proposalIndex={proposalIndex} />,
    },
  ], [t, proposal, proposalIndex, id])

  return (
    <Card mt="20px">
      <TabBox tabs={tabs} />
    </Card>
  )
}

export default VotingInfo
