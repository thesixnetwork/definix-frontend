import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, Box, Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import ReactMarkdown from 'components/ReactMarkdown'
import useVoteTranslate from 'hooks/useVoteTranslate'
import { Voting, ParticipatedVoting } from 'state/types'
import getDateFormat from 'utils/getDateFormat'
import Badge from './Badge'
import { BadgeType } from '../types'
import VotingChoice from './VotingChoice'

interface Props {
  id: string
  proposalIndex: string
  proposal: Voting
  participatedProposal: ParticipatedVoting
}

const WrapCard = styled(Card)`
  margin-top: 40px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 28px;
  }
`

const StyledCardBody = styled(CardBody)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 20px;
  }
`

const TextTitle = styled(Text)`
  ${({ theme }) => theme.textStyle.R_18M}
  color: ${({ theme }) => theme.colors.black};
  margin-top: 20px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 12px;
  }
`

const TextEndDate = styled(Text)`
  display: flex;
  ${({ theme }) => theme.textStyle.R_12R}
  color: ${({ theme }) => theme.colors.mediumgrey};
  margin-top: 6px;

  span:nth-child(2) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 10px;

    span:nth-child(2) {
      margin-left: 0;
      margin-top: 2px;
    }
  }
`

const BoxContent = styled(Box)`
  margin-top: 32px;

  > .text {
    ${({ theme }) => theme.textStyle.R_14R}
    color: ${({ theme }) => theme.colors.deepgrey};
    white-space: normal;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 20px;

    > .text {
      ${({ theme }) => theme.textStyle.R_12R}
    }
  }
`

const WrapContent = styled(Flex)`
  flex-direction: column;
  padding-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .badge {
    margin-left: 10px;

    &:nth-child(1) {
      margin-left: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-bottom: 20px;
  }
`

const CardVotingContent: React.FC<Props> = ({ proposalIndex, proposal, participatedProposal }) => {
  const { t, i18n } = useTranslation()

  return (
    <WrapCard>
      <StyledCardBody>
        <WrapContent>
          <Flex>
            {proposal.proposals_type === 'core' && <Badge type={BadgeType.CORE} />}
            {participatedProposal && <Badge type={BadgeType.PARTICIPATION} />}
          </Flex>
          <TextTitle>{useVoteTranslate(proposal.title, 'title')}</TextTitle>
          <TextEndDate>
            <span>{t('End Date')}</span>
            <span>{getDateFormat(i18n.languages[0], proposal.endEpoch)}</span>
          </TextEndDate>
          <BoxContent>
            <Text className="text">
              <ReactMarkdown>{useVoteTranslate(proposal.content, 'content')}</ReactMarkdown>
            </Text>
          </BoxContent>
        </WrapContent>
        <VotingChoice proposal={proposal} proposalIndex={proposalIndex} participatedProposal={participatedProposal} />
      </StyledCardBody>
    </WrapCard>
  )
}

export default CardVotingContent
