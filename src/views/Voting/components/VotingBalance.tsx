/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react'
import _ from 'lodash'
import { useParams, Link } from 'react-router-dom'
import { Card, Text, useMatchBreakpoints, Button, Skeleton, Image } from 'uikit-dev'
import isEmpty from 'lodash/isEmpty'
import { Minus, Plus } from 'react-feather'
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
    <TD className="w-100">
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
  width: 180px;
  vertical-align: middle;
  align-self: center;
`

const Actions = styled(Button)`
  background-color: unset;
  cursor: pointer;
  border: 1px solid #1587C9;
  color: #1587C9;
  padding: 8px 24px;
  margin-right: 4px;
  border-radius: 30px;
`

const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Rank', 'Farms/Pools', 'Current Allocation Point', 'Total Liquidity', 'Current APR', '', 'New Allocation Point', 'Estimate APR'])
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
                            {r.rank}
                          </>
                          )}
                      </TD>
                      <TD>
                        {isLoading ? (
                          <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                        ) : (
                          <div className="flex">
                            <Image src="/images/coins/FINIX.png" width={16} height={16} />
                            <Image src="/images/coins/SIX.png" width={16} height={16} />
                            {r.farmOrPool}
                          </div>
                        )}
                      </TD>
                      <TD>
                        {isLoading ? (
                          <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                        ) : (
                            <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold>
                              {r.currentAlloCationPoint}
                            </Text>
                          )}
                      </TD>
                      <TD>
                        {isLoading ? (
                          <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                        ) : (
                            <div className="flex align-center">
                              <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold paddingRight="8px">
                                {r.totalLiquidity}
                              </Text>
                            </div>
                          )}
                      </TD>
                      <TD>
                        {isLoading ? (
                          <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                        ) : (
                            <div className="flex align-center">
                              <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold paddingRight="8px">
                                {r.currentAPR}
                              </Text>
                            </div>
                          )}
                      </TD> 
                      <TD>
                        {isLoading ? (
                          <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                        ) : (
                            <div className="flex align-center">
                              <Actions as={Link} to="">
                                <Minus width={18} height={18}/>
                              </Actions>
                              <Actions as={Link} to="">
                                <Plus width={18} height={18}/>
                              </Actions>
                            </div>
                          )}
                      </TD>
                      <TD>
                        {isLoading ? (
                          <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                        ) : (
                            <div className="flex align-center">
                              <Text fontSize={isMobile ? '12px' : '14px'} color="#2A9D8F" bold paddingRight="8px">
                                {r.newAlloPoint}
                              </Text>
                            </div>
                          )}
                      </TD>
                      <TD>
                        {isLoading ? (
                          <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                        ) : (
                            <div className="flex align-center">
                              <Text fontSize={isMobile ? '12px' : '14px'} color="#2A9D8F" bold paddingRight="8px">
                                {r.estimateAPR}
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

const VotingBalance = () => {
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const limits = 10
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()

  const { allVotesByIndex, totalVote } = useVotesByIndex(proposalIndex, currentPage, limits)
  const { allVotesByIpfs } = useVotesByIpfs(id)
  const pages = useMemo(() => Math.ceil(Number(totalVote) / 10), [Number(totalVote)])

  const mapAllVote = [{
    rank: 1,
    farmOrPool: "FINIX-SIX Farm",
    currentAlloCationPoint: "0.00%",
    totalLiquidity: "$2,538,077",
    currentAPR: "0.00%",
    newAlloPoint: "0.00%",
    estimateAPR: "0.00%" 
  }]

  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CardTable className="mb-4">
        <div className="pa-4 pt-3 bd-b flex justify-space-between">
          <div className="flex">
            <Text fontSize="20px" bold lineHeight="1" marginTop="10px" paddingRight="14px">
              Voting Balance
            </Text>
            <Text fontSize="20px" bold lineHeight="1" marginTop="10px" color="textSubtle">
              {Number(totalVote)}
            </Text>
          </div>
          <Button
            as={Link}
            to="/voting"
            variant="primary"
            radii="small"
            size="sm"
            className="flex align-center text-center"
          >
            <Text fontSize={isMobile ? '10px' : '12px'} color="white" lineHeight="1">
              Confirm
            </Text>
          </Button>
        </div>
        <TransactionTable
          rows={mapAllVote.length !== 0 && mapAllVote}
          isLoading={isLoading}
          empText="Don`t have any transactions in this voting balance."
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

export default VotingBalance
