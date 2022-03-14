import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { Box, Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import ReactMarkdown from 'components/ReactMarkdown'
import useVoteTranslate from 'hooks/useVoteTranslate'
import { useGetProposal, useAllProposalOfAddress } from 'hooks/useVoting'
import getDateFormat from 'utils/getDateFormat'
import Badge from './Badge'
import { BadgeType } from '../types'

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
    flex-direction: column;

    span:nth-child(2) {
      margin-left: 0;
      margin-top: 2px;
    }
  }
`

const BoxContent = styled(Box)`
  margin-top: 32px;
  width: 100%;
  overflow-x: auto;

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

const VotingContent: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { id }: { id: string; proposalIndex: any } = useParams()
  const { proposal } = useGetProposal()
  const { proposalOfAddress } = useAllProposalOfAddress()
  const isStartDate = useMemo(() => dayjs().isBefore(dayjs(proposal.startEpoch)), [proposal.startEpoch])
  const participatedProposal = useMemo(() => {
    if (!proposalOfAddress) {
      return undefined
    }
    return proposalOfAddress.find(({ ipfsHash }) => ipfsHash === id) || false
  }, [id, proposalOfAddress])

  return (
    <WrapContent>
      <Flex>
        {proposal.proposals_type === 'core' && <Badge type={BadgeType.CORE} />}
        {
          // @ts-ignore
          participatedProposal === false ? (
            <></>
          ) : (
            <Badge type={BadgeType.PARTICIPATION} isLoading={participatedProposal === undefined} />
          )
        }
      </Flex>
      <TextTitle>{useVoteTranslate(proposal.title, 'title')}</TextTitle>
      <TextEndDate>
        <span>{isStartDate ? t('Start Date') : t('End Date')}</span>
        <span>{getDateFormat(i18n.languages[0], isStartDate ? proposal.startEpoch : proposal.endEpoch)}</span>
      </TextEndDate>
      <BoxContent>
        <Text className="text">
          <ReactMarkdown>{useVoteTranslate(proposal.content, 'content')}</ReactMarkdown>
        </Text>
      </BoxContent>
    </WrapContent>
  )
}

export default VotingContent
