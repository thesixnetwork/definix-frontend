/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Tabs, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { Voting } from 'state/types'
import InfoDetail from './InfoDetail'
import InfoVotes from './InfoVotes'

interface Props {
  id: string
  proposalIndex: string
  proposal: Voting
}

const VotingInfo: React.FC<Props> = ({ id, proposal, proposalIndex }) => {
  const { t } = useTranslation()
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
