/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import Lottie from 'react-lottie'
import moment from 'moment'
import { Card, Text, useMatchBreakpoints, Button, useModal } from 'uikit-dev'
import isEmpty from 'lodash/isEmpty'
import { getAddress } from 'utils/addressHelpers'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import ModalResponses from 'uikit-dev/widgets/Modal/ModalResponses'
import { Context } from 'uikit-dev/widgets/Modal/ModalContext'
import success from 'uikit-dev/animation/complete.json'
import loadings from 'uikit-dev/animation/farmPool.json'
import _ from 'lodash'
import { Voting } from '../../../state/types'
// import PaginationCustom from './Pagination'
import { useClaimVote } from '../../../hooks/useVoting'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const LoadingOptions = {
  loop: true,
  autoplay: true,
  animationData: loadings,
}

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

const TR = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const TD = styled.td<{ align?: string }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  // height: 64px;
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
  width: 60%;
`

const BtnClaim = styled(Button)`
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  font-style: italic;
  font-weight: normal;
  color: #ffffff;

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 10px;
    padding: 8px;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 8px;
    padding: 10px 12px;
    width: 60%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 12px;
    padding: 10px 20px;
    width: 60%;
  }
`

const ColBtn = styled.div`
 text-align: -webkit-center;
`

const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Title', 'Vote', 'Voting Power', ''])
  const { callClaimVote } = useClaimVote()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const [isLoad, setIsLoading] = useState('')
  const { proposalIndex }: { id: string; proposalIndex: any } = useParams()

  const timeZone = new Date().getTimezoneOffset() / 60
  const offset = timeZone === -7 && 2
  const { onDismiss } = useContext(Context)

  const CardResponse = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss}>
        <div className="pb-6 pt-2">
          <Lottie options={SuccessOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  const CardLoading = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss}>
        <div className="pb-6 pt-2">
          <Lottie options={LoadingOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  const [onPresentConnectModal] = useModal(<CardLoading />)
  const [onPresentAccountModal] = useModal(<CardResponse />)

  const onHandleClaim = (r) => {
    onPresentConnectModal()
    const claim = callClaimVote(r)
    claim
      .then((b) => {
        onPresentAccountModal()
        setInterval(() => setIsLoading('success'), 3000)
      })
      .catch((e) => {
        setIsLoading('')
        onDismiss()
      })
  }

  useEffect(() => {
    if (isLoad === 'success') {
      onDismiss()
    }
  }, [isLoad, onDismiss])

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
          <>
            {rows !== null &&
              rows.map((r) => (
                <TR key={`tsc-${r.block_number}`}>
                  <TD>
                    <Text color="text" bold fontSize={isMobile ? '16px' : '20px'}>
                      {r.title.substring(0, 38)}...
                    </Text>
                    <div className={isMobile ? '' : 'flex align-center'}>
                      <Text color="text" paddingRight="8px">
                        End Date
                      </Text>
                      <Text color="text" bold>
                        {moment(r.endDate).format(`DD-MMM-YY HH:mm:ss`)}{' '}
                        {moment(r.endDate).format(`DD-MMM-YY HH:mm:ss`) !== '-' && 'GMT+9'}
                      </Text>
                    </div>
                  </TD>
                  <TD>
                    {r.choices.map((item) => (
                      <TR>
                        <Text color="text" bold>
                          {item.choiceName}
                        </Text>
                      </TR>
                    ))}
                  </TD>
                  <TD>
                    {r.choices.map((item) => (
                      <TR>
                        <div className="flex align-center">
                          <Text color="text" bold paddingRight="8px">
                            {item.votePower}
                          </Text>
                        </div>
                      </TR>
                    ))}
                  </TD>
                  <TD>
                    <ColBtn>
                      {Date.now() < +r.endDate || r.choices.length === 0 ? (
                        <BtnDetails as={Link} to={`/voting/detail/participate/${r.ipfsHash}/${r.proposalIndex}`}>
                          Details
                        </BtnDetails>
                      ) : (
                        <BtnClaim
                          variant="success"
                          size="sm"
                          disabled={!r.isClaimable}
                          onClick={() => {
                            onHandleClaim(r.proposalIndex)
                          }}
                        >
                          Claim Voting Power
                        </BtnClaim>
                      )}
                    </ColBtn>
                  </TD>
                </TR>
              ))}
          </>
        )}
      </Table>
    </CardList>
  )
}

const VotingPartProposal = ({ rbAddress, userProposals = [] }) => {
  const address = getAddress(rbAddress)
  const testVots: Voting[] = []
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [transactions, setTransactions] = useState(
    userProposals.map((item) => {
      return {
        proposalIndex: item.proposalIndex,
        ipfsHash: item.ipfsHash,
        title: item.title,
        address: item.proposer,
        endDate: item.endDate,
        choices: item.choices,
        isClaimable: item.IsClaimable,
        // voting_power: '999',
      }
    }),
  )

  const [total, setTotal] = useState(1)
  const pages = useMemo(() => Math.ceil(total / 10), [total])

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
      <CardTable className="my-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="26px" bold marginTop="10px">
            Participated Proposal
          </Text>
        </div>

        <TransactionTable
          rows={transactions}
          isLoading={isLoading}
          empText="Don`t have any transactions in this votes."
          total
        />
        {/* <PaginationCustom
          page={currentPage}
          count={pages}
          size="small"
          hidePrevButton
          hideNextButton
          className="px-4 py-2"
          onChange={onPageChange}
        /> */}
      </CardTable>
    </>
  )
}

export default VotingPartProposal
