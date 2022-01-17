import React from 'react'
import { BackIcon, Box, Flex, Text, Button } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom';
import { useGetProposal } from 'hooks/useVoting';
import CardVotingContent from './CardVotingContent';
import YourVoteList from './YourVoteList';
import VotingInfo from './VotingInfo';

const DetailVoting: React.FC = () => {
  const { t } = useTranslation();
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { proposal } = useGetProposal(id)

  return (
    <Box mt="28px" mb="80px">
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
            <Text textStyle="R_16M" color="textSubtle">
              {t('Back')}
            </Text>
          </Button>
        </Flex>
      </Box>
      <CardVotingContent id={id} proposalIndex={proposalIndex} proposal={proposal} />
      <YourVoteList />
      <VotingInfo id={id} proposalIndex={proposalIndex} proposal={proposal} />
    </Box>
  )
}

export default DetailVoting
