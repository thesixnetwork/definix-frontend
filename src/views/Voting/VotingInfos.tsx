import React from 'react'
import _ from 'lodash'
import { Route, useRouteMatch, useParams } from 'react-router-dom'
import { MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'

import VotingDescription from './components/VotingDescription'
import VotingCast from './components/VotingCast'
import YourVoteList from './components/YourVoteList'
import VotingList from './components/VotingList'
import VotingDetails from './components/VotingDetails'
import VotingResults from './components/VotingResults'
import VotingPower from './components/VotingPower'
import { useGetProposal, useAllProposalOfType } from '../../hooks/useVoting'

const MaxWidthLeft = styled(MaxWidth)`
  max-width: unset;
  margin: 60px 100px;

  ${({ theme }) => theme.mediaQueries.xs} {
    margin: 40px 20px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 60px 100px;
  }
`

interface ValueProps {
  isParticipate?: boolean
}

const VotingInfos: React.FC<ValueProps> = ({ isParticipate }) => {
  const { path } = useRouteMatch()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const proposal = useGetProposal(id)
  const allProposal = useAllProposalOfType()
  const listAllProposal = _.get(allProposal, 'allProposal')
  const getByIndex = listAllProposal.filter((book) => Number(book.proposalIndex) === Number(proposalIndex))

  return (
    <>
      <Route exact path={path}>
        <MaxWidthLeft>
          <div className={`flex align-stretch mt-5 ${isMobile ? 'flex-wrap' : ''}`}>
            <div className={isMobile ? 'col-12' : 'col-8 mr-2'}>
              <VotingDescription id={id} index={proposal && proposal.proposal} />
              {isParticipate ? (
                <YourVoteList />
              ) : (
                <VotingCast id={id} indexs={proposal && proposal.proposal} proposalIndex={proposalIndex} />
              )}
              <VotingList rbAddress />
            </div>
            <div className={isMobile ? 'col-12 mt-5' : 'col-4 ml-3'}>
              <VotingDetails id={id} index={proposal && proposal.proposal} />
              <VotingResults getByIndex={getByIndex} />
              <VotingPower />
            </div>
          </div>
        </MaxWidthLeft>
      </Route>
    </>
  )
}

export default VotingInfos
