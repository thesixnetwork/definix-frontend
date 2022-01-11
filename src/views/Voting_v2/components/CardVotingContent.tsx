import React from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Route, useRouteMatch, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Box, Flex, Text, CheckboxLabel, Checkbox } from '@fingerlabs/definixswap-uikit-v2'
import ReactMarkdown from 'components/ReactMarkdown'
import { useAllProposalOfType, useGetProposal } from 'hooks/useVoting'
import Badge from './Badge'
import { BadgeType } from '../types'

const WrapContent = styled(Flex)`
  flex-direction: column;
  padding-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const WrapVote = styled(Flex)`
  flex-direction: column;
  padding-top: 32px;
`

const CardVotingContent: React.FC = () => {
  const { t } = useTranslation();
  const { path } = useRouteMatch()
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const proposal = useGetProposal(id)
  const allProposal = useAllProposalOfType()
  const listAllProposal = _.get(allProposal, 'allProposal')
  const data = proposal.proposal;
  // const getByIndex = listAllProposal.filter((book) => Number(book.proposalIndex) === Number(proposalIndex))

  return (
    <Card mt="40px" p="32px">
      <WrapContent>
        <Flex>
          {
            data.proposals_type === 'core' && <Badge type={BadgeType.CORE} />
          }
        </Flex>
        <Text textStyle="R_18M" color="black" mt="20px">{data.title}</Text>
        <Text textStyle="R_12R" color="mediumgrey" mt="6px">
          <span>{t('End Date')}</span>
          <span>{data.endTimestamp}</span>
        </Text>
        <Box mt="32px">
          <Text textStyle="R_14R" color="deepgrey" style={{
            whiteSpace: 'normal'
          }}>
            <ReactMarkdown>{data.content}</ReactMarkdown>
          </Text>
        </Box>
      </WrapContent>
      <WrapVote>
        <Flex justifyContent="space-between">
          {data.choice_type === 'multi' && <Text color="orange" textStyle="R_14M">*{t('Plural vote')}</Text>}
          <Flex>
            <Text color="mediumgrey" textStyle="R_14R" mr="8px">{t('Balance')}</Text>
            <Text color="black" textStyle="R_14B" mr="4px">123123</Text>
            <Text color="black" textStyle="R_14M">{t('vFINIX')}</Text>
          </Flex>
        </Flex>
        {data.choices.map((choice) => <Flex flexDirection="column">
            <Flex justifyContent="space-between" alignItems="center">
            <CheckboxLabel control={<Checkbox />} className="mr-12">
              <Text textStyle="R_16R" color="black">{choice}</Text>
            </CheckboxLabel>
            <Text textStyle="R_16M" color="deepgrey">80%</Text>
          </Flex>
          <Flex mt="14px">
          test
          </Flex>
        </Flex>)}
      </WrapVote>
    </Card>
  )
}

export default CardVotingContent
