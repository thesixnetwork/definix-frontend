import React from 'react'
import styled from 'styled-components';
import { BackIcon, Box, Flex, Text, Button } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom';
import { useGetProposal } from 'hooks/useVoting';
import CardVotingContent from './CardVotingContent';
import YourVoteList from './YourVoteList';
import VotingInfo from './VotingInfo';

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
  const { t } = useTranslation();
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { proposal } = useGetProposal(id)

  return (
    <Wrap>
      <Box style={{ cursor: 'pointer' }} display="inline-flex" onClick={() => {
        console.log('click')
      }}>
        <Flex>
          <Button
            variant="text"
            as={Link}
            to="/voting"
            height="24px"
            p="0"
            startIcon={<BackIcon color="textSubtle" />}
          >
            <TextBack color="textSubtle">
              {t('Back')}
            </TextBack>
          </Button>
        </Flex>
      </Box>
      <CardVotingContent id={id} proposalIndex={proposalIndex} proposal={proposal} />
      <YourVoteList />
      <VotingInfo id={id} proposalIndex={proposalIndex} proposal={proposal} />
    </Wrap>
  )
}

export default DetailVoting
