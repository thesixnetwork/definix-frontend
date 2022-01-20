import React, { useMemo, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { Box, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import TitleVoting from './components/TitleVoting'
import ProposalFilterVoting from './components/ProposalFilterVoting'
import CardVoting from './components/CardVoting'
import { ProposalType } from './types'
import DetailVoting from './components/DetailVoting'

const Voting: React.FC = () => {
  const { path } = useRouteMatch()
  const { isMobile } = useMatchBreakpoints()
  const [proposalType, setProposalType] = useState<ProposalType>(ProposalType.ALL)
  const [isParticipated, setIsParticipated] = useState<boolean>(false)

  return (
    <>
      <Route exact path={path}>
        <Box maxWidth="100%" mx="auto" mt={`${isMobile ? 'S_32' : 'S_28'}`} mb={`${isMobile ? 'S_40' : 'S_80'}`}>
          <TitleVoting />
          {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            useMemo(() => <ProposalFilterVoting
            setProposalType={setProposalType}
            isParticipated={isParticipated}
            setIsParticipated={setIsParticipated}
          />, [isParticipated])
          }
          {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            useMemo(() => <CardVoting proposalType={proposalType} isParticipated={isParticipated} />, [isParticipated])
          }
        </Box>
      </Route>
      <Route exact path={`${path}/detail/:id/:proposalIndex`}>
        <DetailVoting />
      </Route>
    </>
  )
}

export default Voting
