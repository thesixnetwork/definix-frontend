/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Tabs, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useGetProposal } from 'hooks/useVoting'
import InfoDetail from './InfoDetail'
import InfoVotes from './InfoVotes'

const VotingInfo: React.FC = () => {
  const { t } = useTranslation()
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { proposal } = useGetProposal()
  const { isMobile } = useMatchBreakpoints()
  const tabs = useMemo(
    () => [
      {
        id: 'detail',
        name: t('Detail'),
      },
      {
        id: 'votes',
        name: t('Votes'),
      },
    ],
    [t],
  )
  const [curTab, setCurTab] = useState(tabs[0].id)

  return (
    <Card mt="20px">
      <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} equal={isMobile} />
      {curTab === 'detail' && <InfoDetail key={id} id={id} proposal={proposal} />}
      {curTab === 'votes' && <InfoVotes key={id} id={id} proposalIndex={proposalIndex} />}
    </Card>
  )
}

export default VotingInfo
