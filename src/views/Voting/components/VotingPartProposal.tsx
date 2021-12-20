/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Text, useMatchBreakpoints, Button } from 'uikit-dev'
// import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import isEmpty from 'lodash/isEmpty'
// import moment from 'moment'
// import numeral from 'numeral'
import { getAddress } from 'utils/addressHelpers'
import styled from 'styled-components'
// import useTheme from 'hooks/useTheme'
import CircularProgress from '@material-ui/core/CircularProgress'
import PaginationCustom from './Pagination'

const EmptyData = ({ text }) => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <Text textAlign="center" color="textSubtle">
          {text}
        </Text>
      </div>
    </TD>
  </TR>
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

  a {
    display: block;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

const TR = styled.tr``

const TD = styled.td<{ align?: string }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  height: 64px;
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
`

const BtnDetails = styled(Button)`
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  font-style: italic;
  font-weight: normal;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
`

// const BtnClaim = styled(Button)`
//   padding: 10px 20px;
//   border-radius: 8px;
//   text-align: center;
//   font-size: 12px;
//   font-style: italic;
//   font-weight: normal;
//   background-color: ${({ theme }) => theme.colors.success};
// `

const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Title', 'Vote', 'Voting Power', ''])
  // const [currentPage, setCurrentPage] = useState(1)
  // const pages = useMemo(() => Math.ceil(total / 10), [total])
  // const onPageChange = (e, page) => {
  //   setCurrentPage(page)
  // }

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
            {/* {console.log('rows', rows)} */}
            <EmptyData text={empText} />
          </>
        ) : (
          <>
            {rows !== null &&
              rows.map((r) => (
                <TR key={`tsc-${r.block_number}`}>
                  <TD>
                    <Text color="text" bold fontSize={isMobile ? '16px' : '20px'}>
                      {'Proposal Topic Proposal Topic Proposal Topic Proposal'.substring(0, 38)}...
                    </Text>
                    <div className={isMobile ? '' : 'flex align-center'}>
                      <Text color="text" paddingRight="8px">
                        End Date
                      </Text>
                      <Text color="text" bold>
                        12-Nov-21 15:00:00 GMT+9
                      </Text>
                    </div>
                  </TD>
                  <TD>
                    <Text color="text" bold>
                      Yes, agree with you.
                    </Text>
                  </TD>
                  <TD>
                    <div className="flex align-center">
                      <Text color="text" bold paddingRight="8px">
                        23,143
                      </Text>
                    </div>
                  </TD>
                  <TD>
                    <BtnDetails as={Link} to="/voting/detail/participate">
                      Deatils
                    </BtnDetails>
                    {/* <BtnClaim as={Link} to={`/voting/detail/${item.ipfsHash`}>
                      Claim Voting Power
                    </BtnClaim> */}
                  </TD>
                </TR>
              ))}
          </>
        )}
      </Table>
    </CardList>
  )
}

const VotingPartProposal = ({ rbAddress }) => {
  const address = getAddress(rbAddress)
  // const { account } = useWallet()

  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [transactions, setTransactions] = useState([
    {
      id: 1234,
      address: '0x00000',
      choise: 'Yes, agree with you.',
      voting_power: '99,999',
    },
  ])
  const [total, setTotal] = useState(1)
  const pages = useMemo(() => Math.ceil(total / 10), [total])
  // const { isDark } = useTheme()
  // const { isXl, isLg } = useMatchBreakpoints()
  // const isMobile = !isXl && !isLg

  const setDefault = (tab) => {
    setCurrentTab(tab)
    setCurrentPage(1)
    setTransactions([
      {
        id: 1234,
        address: '0x00000',
        choise: 'Yes, agree with you.',
        voting_power: '99,999',
      },
    ])
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
      <CardTable className="my-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="26px" bold marginTop="10px">
            Participated Proposal
          </Text>
        </div>

        <TransactionTable
          rows={transactions}
          isLoading={isLoading}
          empText={
            'Don`t have any transactions in this votes.'
            // currentTab === 0
            //   ? 'Don`t have any transactions in this votes.'
            //   : 'You haven`t made any transactions in this votes.'
          }
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

export default VotingPartProposal
