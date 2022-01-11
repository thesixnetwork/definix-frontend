import React from 'react'
import { Box } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { Voting } from 'state/types';
import VotingItem from './VotingItem';

interface Props {
  list: Voting[];
}

const List = styled(Box)`
  padding: 16px 32px;
`

const VotingList: React.FC<Props> = ({ list }) => {
  return list && list.length > 0 ? (
    <List>
      {
        list.map((item) => <VotingItem item={item} />)
      }
    </List>
  ) : <></>
}

export default VotingList
