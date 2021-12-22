/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useParams } from 'react-router-dom'
import { Card, Text, useMatchBreakpoints, Button, Skeleton } from 'uikit-dev'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import isEmpty from 'lodash/isEmpty'
import { getAddress } from 'utils/addressHelpers'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import { useProposalIndex } from 'hooks/useVoting'
import useTheme from 'hooks/useTheme'
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
  border-bottom: 1px solid #57575b;

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
  width: 100%;
  vertical-align: middle;
  align-self: ${'center'};
`

const LinkView = styled(Button)`
  background-color: unset;
  cursor: pointer;
  padding-left: 6px;
`

const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Transaction Hash', 'Address', 'Choice', 'Voting Power'])
  // const [currentPage, setCurrentPage] = useState(1)
  // const pages = useMemo(() => Math.ceil(total / 10), [total])
  // const onPageChange = (e, page) => {
  //   setCurrentPage(page)
  // }

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
                            <Text fontSize="16px" bold lineHeight="1" color="#30ADFF">
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
                            <Text fontSize="16px" bold lineHeight="1" color="#30ADFF">
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
                      <Text color="text" bold>
                        {r.voting_opt}
                      </Text>
                    )}
                  </TD>
                  <TD>
                    {isLoading ? (
                      <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                    ) : (
                      <div className="flex align-center">
                        <Text color="text" bold paddingRight="8px">
                          {r.voting_power}
                        </Text>
                      </div>
                    )}
                  </TD>
                </TR>
              ))}
            {/* <TR>
                  <TD className="text-right">
                    <PaginationCustom
                      page={currentPage}
                      count={pages}
                      onChange={onPageChange}
                      size="small"
                      hidePrevButton
                      hideNextButton
                    />
                  </TD>
                </TR> */}
          </TBody>
        )}
      </Table>
    </CardList>
  )
}

const VotingList = ({ rbAddress }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [total, setTotal] = useState(1)
  const pages = useMemo(() => Math.ceil(total / 10), [total])
  const limits = 15
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const [mapVoting, setMapVoting] = useState([])
  const [add, setAdd] = useState({})

  const { indexProposal } = useProposalIndex(proposalIndex)
  const voting = indexProposal && _.get(indexProposal, 'optionVotingPower')

  useEffect(() => {
    const dataArray = []
    const fetchVotes = async () => {
      const voteAPI = process.env.REACT_APP_LIST_VOTE_API
      await axios
        .get(`${voteAPI}?proposalIndex=${proposalIndex}&page=${pages}&limit=${limits}`)
        .then((resp) => {
          if (resp.data.success) {
            const data = _.get(resp, 'data.result')
            const totalVote = _.get(resp, 'data.total')
            setTotalVotes(totalVote)

            data.map((v) =>
              dataArray.push({
                voter_addr: v.voter_addr,
                voting_opt: v.voting_opt,
                voting_power: v.voting_power,
                transaction_hash: v.transaction_hash,
              }),
            )
          }
        })
        .catch((e) => {
          console.log('error', e)
        })

      setTransactions(dataArray)
    }
    fetchVotes()
  }, [id])

  useEffect(() => {
    const dataArray = []
    const array = []
    const fetch = async () => {
      const voteAPI = process.env.REACT_APP_IPFS
      await axios
        .get(`${voteAPI}/${id}`)
        .then((resp) => {
          dataArray.push({
            choice_type: resp.data.choice_type,
            choices: resp.data.choices,
            content: resp.data.content,
            creator: resp.data.creator,
            proposals_type: resp.data.proposals_type,
            start_unixtimestamp: resp.data.start_unixtimestamp,
            end_unixtimestamp: resp.data.end_unixtimestamp,
            title: resp.data.title,
          })
        })
        .catch((e) => {
          console.log('error', e)
        })

      if (voting && dataArray) {
        voting.filter((v, index) => {
          dataArray.map((i, c) => {
            if (Number(i.voting_opt) === index) {
              array.push({
                vote: new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber(),
                value: i,
              })
            }
            return array
          })
          return array
        })
      }
      setMapVoting(array)
      await setAdd(dataArray)
    }

    fetch()
  }, [id, add, voting])

  // useEffect(() => {

  // }, [])

  const setDefault = (tab) => {
    setCurrentTab(tab)
    setCurrentPage(1)
    setTotal(0)
  }

  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }
  useEffect(() => {
    return () => {
      setDefault(0)
    }
  }, [])

  return (
    <>
      <CardTable className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Votes ({totalVotes})
          </Text>
        </div>
        <TransactionTable
          rows={transactions}
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
