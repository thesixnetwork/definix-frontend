import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash';
import styled from 'styled-components';
import { Text, Flex } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next';
import { Voting } from 'state/types';
import Badge from './Badge';
import { BadgeType } from '../types';

interface Props {
  item: Voting;
}

const Item = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-direction: column;
  padding: 18px 0;
  cursor: pointer;
`

const VotingItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <Item as={Link} to={`/voting/detail/${_.get(item, 'ipfsHash')}/${_.get(item, 'proposalIndex')}`}>
      <Flex mt="18px">
        {
          item.proposals_type === 'core' && <Badge type={BadgeType.CORE} />
        }
      </Flex>
      <Text textStyle="R_14R" color="black" mt="12px">{item.title}</Text>
      <Text textStyle="R_14R" color="mediumgrey" mt="6px">
        <span>{t('End Date')}</span>
        <span>{item.endTimestamp}</span>
      </Text>
    </Item>
  )
}

export default VotingItem
