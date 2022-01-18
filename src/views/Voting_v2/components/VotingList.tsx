import React, { useState, useMemo } from 'react'
import { Flex, Box } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Voting } from 'state/types';
import StakeListPagination from 'views/LongTermStake_v2/components/StakeListPagination'
import VotingItem from './VotingItem';

interface Props {
  list: Voting[];
}

const List = styled(Box)`
  padding: 16px 32px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 0 20px;
  }
`

const ItemPerPage = 10;

const VotingList: React.FC<Props> = ({ list }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1)
  const currentList = useMemo(() => {
    return list ? list.slice((currentPage - 1) * ItemPerPage, currentPage * ItemPerPage) : [];
  }, [currentPage, list])


  return list && list.length > 0 ? (
    <Box width="100%" pb="20px">
      <List>
        {
          currentList.map((item) => <VotingItem item={item} />)
        }
      </List>
      <Flex mt="12px" justifyContent="center">
        <StakeListPagination
          isMobile={false}
          itemPerPage={ItemPerPage}
          dataLength={list.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Flex>
    </Box>
  ) : <Box width="100%" py="20px">{t('There are no proposals.')}</Box>
}

export default VotingList
