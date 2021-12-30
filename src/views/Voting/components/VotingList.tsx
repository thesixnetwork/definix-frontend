/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import { Card, Text, useMatchBreakpoints, Button, Skeleton } from 'uikit-dev'
import isEmpty from 'lodash/isEmpty'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import { useVotesByIndex, useVotesByIpfs } from 'hooks/useVoting'
import CircularProgress from '@material-ui/core/CircularProgress'
import PaginationCustom from './Pagination'

const EmptyData = ({ text }) => (
  <div className="flex align-center justify-center" style={{ height: '400px' }}>
    <Text textAlign="center" color="textSubtle">
      {text}
    </Text>
  </div>
)

const LoadingData = () => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <CircularProgress size={16} color="inherit" className="mr-2" />
        <Text>Loading...</Text>
      </div>
    </TD>
  </TR>
)

const CardTable = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  overflow: auto;

  a {
    display: block;
  }
`

const CardList = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  overflow: auto;
  box-shadow: unset;
  border-radius: unset;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  a {
    display: block;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

const TBody = styled.div`
  overflow: auto;
  position: relative;
`

const TR = styled.tr`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;

  th {
    border-top: 1px solid${({ theme }) => theme.colors.border};
  }

  &:last-child {
    border: none;
  }

  &.isMe {
    position: sticky;
    bottom: 1px;
    left: 0;
    background: #f7f7f8;
    border-top: 1px solid: ${({ theme }) => theme.colors.border};
  }
  
`
const TD = styled.td<{ align?: string }>`
  width: 120px;
  vertical-align: middle;
  align-self: center;
`

const LinkView = styled(Button)`
  background-color: unset;
  cursor: pointer;
  padding-left: 2px;
`


const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Transaction Hash', 'Address', 'Choice', 'Voting Power'])
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  
  return (
    <CardList>
      <Table>
        <TR>
          {cols.map((c) => (
            <TD key={c}>
              <Text color="textSubtle" fontSize="12px" bold>
                {c}
              </Text>
            </TD>
          ))}
        </TR>

        {isLoading ? (
          <LoadingData />
        ) : isEmpty(rows) ? (
          <>
            <EmptyData text={empText} />
          </>
        ) : (
          <TBody>
            {rows !== null &&
              rows.map((r) => (
                <TR key={`tsc-${r.block_number}`}>
                  <TD>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                    ) : (
                      <>
                        {r.transaction_hash && (
                          <div className="flex align-center">
                            <Text fontSize={isMobile ? '12px' : '14px'} bold lineHeight="1" color="#30ADFF">
                              {`${r.transaction_hash.substring(0, 6)}...${r.transaction_hash.substring(
                                r.transaction_hash.length - 4,
                              )}`}
                            </Text>
                            <LinkView
                              as="a"
                              href={`${process.env.REACT_APP_KLAYTN_URL}/tx/${r.transaction_hash}`}
                              target="_blank"
                            >
                              <ExternalLink size={16} color="#30ADFF" />
                            </LinkView>
                          </div>
                        )}
                      </>
                    )}
                  </TD>
                  <TD>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                    ) : (
                      <>
                        {r.voter_addr && (
                          <div className="flex align-center">
                            <Text fontSize={isMobile ? '12px' : '14px'} bold lineHeight="1" color="#30ADFF">
                              {`${r.voter_addr.substring(0, 6)}...${r.voter_addr.substring(r.voter_addr.length - 4)}`}
                            </Text>
                            <LinkView
                              as="a"
                              href={`${process.env.REACT_APP_KLAYTN_URL}/account/${r.voter_addr}`}
                              target="_blank"
                            >
                              <ExternalLink size={16} color="#30ADFF" />
                            </LinkView>
                          </div>
                        )}
                      </>
                    )}
                  </TD>
                  <TD>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                    ) : (
                      <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold>
                        {r.voting_opt}
                      </Text>
                    )}
                  </TD>
                  <TD>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                    ) : (
                      <div className="flex align-center">
                        <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold paddingRight="8px">
                          {r.voting_power}
                        </Text>
                      </div>
                    )}
                  </TD>
                </TR>
              ))}
          </TBody>
        )}
      </Table>
    </CardList>
  )
}

const VotingList = ({ rbAddress }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const limits = 10
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  // const [add, setAdd] = useState([])

  // const { indexProposal } = useProposalIndex(proposalIndex)
  // const voting = indexProposal && _.get(indexProposal, 'optionVotingPower')
  const { allVotesByIndex, totalVote } = useVotesByIndex(proposalIndex, currentPage, limits)
  const { allVotesByIpfs } = useVotesByIpfs(id)
  const pages = useMemo(() => Math.ceil(Number(totalVote) / 10), [Number(totalVote)])

  const mapAllVote = useMemo(() => {
    const array = []
    if (allVotesByIndex.length !== 0 && allVotesByIpfs.length !== 0) {
      allVotesByIndex.map((v, i) => {
        _.get(allVotesByIpfs, '0.choices').map((items, index) => {
          if (index === Number(_.get(v, 'voting_opt'))) {
            array.push({
              transaction_hash: _.get(v, 'transaction_hash'),
              voter_addr: _.get(v, 'voter_addr'),
              voting_opt: items,
              voting_power: _.get(v, 'voting_power'),
            })
          }
          return array
        })
        return array
      })
    }
    return array
  }, [allVotesByIndex, allVotesByIpfs])

  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CardTable className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Votes ({Number(totalVote)})
          </Text>
        </div>
        <TransactionTable
          rows={mapAllVote.length !== 0 && mapAllVote}
          isLoading={isLoading}
          empText="Don`t have any transactions in this votes."
          total
        />
        <PaginationCustom
          page={currentPage}
          count={pages}
          size="small"
          hidePrevButton
          hideNextButton
          className="px-4 py-2"
          onChange={onPageChange}
        />
      </CardTable>
    </>
  )
}

export default VotingList
