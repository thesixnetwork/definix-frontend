import React, { useEffect } from 'react'
import styled from 'styled-components'
import { BackIcon, Box, Flex, Text, Button } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { fetchProposal, fetchProposalIndex, setProposalIndex } from 'state/voting'
import CardVotingContent from './CardVotingContent'
import YourVoteList from './YourVoteList'
import VotingInfo from './VotingInfo'
import useRefresh from 'hooks/useRefresh'

const Wrap = styled(Box)`
  margin: 28px 0 80px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin: 4px 0 40px;
  }
`

const TextBack = styled(Text)`
  ${({ theme }) => theme.textStyle.R_16M}
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.mediaQueries.mobile} {
    ${({ theme }) => theme.textStyle.R_14M}
  }
`

const DetailVoting: React.FC = () => {
  const { fastRefresh, slowRefresh } = useRefresh()
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProposal(id))
  }, [fastRefresh, dispatch])

  useEffect(() => {
    if (proposalIndex) {
      dispatch(fetchProposalIndex(proposalIndex))
    }
  }, [slowRefresh, dispatch])

  useEffect(() => {
    return () => {
      dispatch(setProposalIndex({}))
    }
  }, [])

  return (
    <Wrap>
      <Box style={{ cursor: 'pointer' }} display="inline-flex">
        <Flex>
          <Button variant="text" as={Link} to="/voting" height="24px" p="0" startIcon={<BackIcon color="textSubtle" />}>
            <TextBack color="textSubtle">{t('Back')}</TextBack>
          </Button>
        </Flex>
      </Box>
      <CardVotingContent />
      <YourVoteList />
      <VotingInfo />
    </Wrap>
  )
}

export default DetailVoting
