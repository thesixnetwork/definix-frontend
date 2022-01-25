import React from 'react'
import { Link } from 'react-router-dom'
import { get } from 'lodash-es'
import styled from 'styled-components'
import { Text, Flex } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { VotingItem as Voting } from 'state/types'
import useVoteTranslate from 'hooks/useVoteTranslate'
import getDateFormat from 'utils/getDateFormat'
import Badge from './Badge'
import { BadgeType } from '../types'

interface Props {
  item: Voting
  isStartDate: boolean
}

const Item = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-direction: column;
  padding: 18px 0;
  cursor: pointer;

  .badge {
    margin-left: 10px;

    &:nth-child(1) {
      margin-left: 0;
    }
  }
`

const TextEndDate = styled(Text)`
  margin-top: 6px;
  display: flex;

  span:nth-child(2) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 16px;
    flex-direction: column;

    span:nth-child(2) {
      margin-left: 0;
      margin-top: 2px;
    }
  }
`

const VotingItem: React.FC<Props> = ({ item, isStartDate }) => {
  const { t, i18n } = useTranslation()
  return (
    <Item as={Link} to={`/voting/detail/${get(item, 'ipfsHash')}/${get(item, 'proposalIndex')}`}>
      <Flex>
        {item.proposals_type === 'core' && <Badge type={BadgeType.CORE} />}
        {item.isParticipated && <Badge type={BadgeType.PARTICIPATION} />}
      </Flex>
      <Text textStyle="R_14R" color="black" mt="12px">
        {useVoteTranslate(item.title, 'title')}
      </Text>
      <TextEndDate textStyle="R_12R" color="mediumgrey" mt="6px">
        <span>{t(isStartDate ? 'Start Date' : 'End Date')}</span>
        <span>{getDateFormat(i18n.languages[0], isStartDate ? item.startTimestamp : item.endTimestamp)}</span>
      </TextEndDate>
    </Item>
  )
}

export default VotingItem
