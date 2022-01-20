/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, TabBox, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
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
        component: <InfoDetail key={id} id={id} proposal={proposal} />,
      },
      {
        id: 'votes',
        name: t('Votes'),
        component: <InfoVotes key={id} id={id} proposalIndex={proposalIndex} />,
      },
    ],
    [t, proposal, proposalIndex, id],
  )

  return (
    <Card mt="20px">
      <TabBox tabs={tabs} equal={isMobile} />
    </Card>
  )
}

export default VotingInfo
