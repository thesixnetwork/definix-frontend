import React, { useEffect, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { Box, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import TitleVoting from './components/TitleVoting'
import ProposalFilterVoting from './components/ProposalFilterVoting'
import CardVoting from './components/CardVoting'
import { ProposalType } from './types'
import DetailVoting from './components/DetailVoting'
import useRefresh from 'hooks/useRefresh'
import { useDispatch } from 'react-redux'
import { fetchAllProposalOfAddress, fetchAllProposalOfType } from 'state/voting'
import { useAllProposalOfType } from 'hooks/useVoting'
import useWallet from 'hooks/useWallet'

const Voting: React.FC = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useWallet()
  const { path } = useRouteMatch()
  const { isMobile } = useMatchBreakpoints()
  const [proposalType, setProposalType] = useState<ProposalType>(ProposalType.ALL)
  const [isParticipated, setIsParticipated] = useState<boolean>(false)
  const { allProposal } = useAllProposalOfType()

  useEffect(() => {
    dispatch(fetchAllProposalOfType())
  }, [fastRefresh, dispatch])

  useEffect(() => {
    if (allProposal.length > 0 && account) {
      dispatch(fetchAllProposalOfAddress(account, allProposal))
    }
  }, [allProposal])

  return (
    <>
      <Route exact path={path}>
        <Box maxWidth="100%" mx="auto" mt={`${isMobile ? 'S_32' : 'S_28'}`} mb={`${isMobile ? 'S_40' : 'S_80'}`}>
          <TitleVoting />
          <ProposalFilterVoting
            setProposalType={setProposalType}
            isParticipated={isParticipated}
            setIsParticipated={setIsParticipated}
          />
          <CardVoting proposalType={proposalType} isParticipated={isParticipated} />
        </Box>
      </Route>
      <Route exact path={`${path}/detail/:id/:proposalIndex`}>
        <DetailVoting />
      </Route>
    </>
  )
}

export default Voting
