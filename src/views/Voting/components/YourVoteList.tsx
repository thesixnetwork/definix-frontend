/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Lottie from 'react-lottie'
import _ from 'lodash'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import ModalResponses from 'uikit-dev/widgets/Modal/ModalResponses'
import { Context } from 'uikit-dev/widgets/Modal/ModalContext'
import success from 'uikit-dev/animation/complete.json'
import loadings from 'uikit-dev/animation/farmPool.json'
import { Button, Card, Text, useModal, useMatchBreakpoints } from '../../../uikit-dev'
import { useAvailableVotes, useAllProposalOfAddress, useClaimVote } from '../../../hooks/useVoting'
import CastVoteModal from '../Modals/CastVoteModal'

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

const TR = styled.tr``

const TD = styled.td<{ align?: string }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  height: 64px;
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
`

const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Vote', 'Voting Power', ''])

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
              _.get(rows, 'choices').map((r) => (
                <TR key="">
                  <TD>
                    <Text color="text" bold>
                      {r.choiceName}
                    </Text>
                  </TD>
                  <TD>
                    <div className="flex align-center">
                      <Text color="text" bold paddingRight="8px">
                        {r.votePower}
                      </Text>
                    </div>
                  </TD>
                  <TD />
                </TR>
              ))}
          </>
        )}
      </Table>
    </CardList>
  )
}

const YourVoteList = () => {
  const { proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { proposalOfAddress } = useAllProposalOfAddress()
  const [isLoading, setIsLoading] = useState(false)
  const { callClaimVote } = useClaimVote()
  const items = proposalOfAddress.find((item) => item.proposalIndex === Number(proposalIndex))
  const { onDismiss } = useContext(Context)
  const [isLoad, setIsLoad] = useState('')
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
        setInterval(() => setIsLoad('success'), 3000)
      })
      .catch((e) => {
        setIsLoad('')
        onDismiss()
      })
  }

  useEffect(() => {
    if (isLoad === 'success') {
      onDismiss()
    }
  }, [isLoad, onDismiss])

  return (
    <>
      <CardTable className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Your vote
          </Text>
        </div>
        <TransactionTable
          rows={items !== undefined && items}
          isLoading={isLoading}
          empText="Don`t have any transactions in this votes."
          total
        />
        <div className="flex align-center ma-3">
          <Button
            onClick={() => {
              onHandleClaim(proposalIndex)
            }}
            variant="success"
            radii="small"
            size="sm"
            mr="6px"
            disabled={
              Date.now() < +_.get(items, 'endDate') || (_.get(items, 'choices') && _.get(items, 'choices').length <= 0)
            }
          >
            Claim Voting Power
          </Button>
          <Button
            as={Link}
            to={`/voting/detail/${_.get(items, 'ipfsHash')}/${_.get(items, 'proposalIndex')}`}
            variant="primary"
            radii="small"
            size="sm"
            className="flex align-center"
            disabled={Date.now() > +_.get(items, 'endDate')}
          >
            Vote more
          </Button>
          <Text fontSize="14px" color="text" paddingLeft="14px">
            Claim will be available after the the voting time is ended.
          </Text>
        </div>
      </CardTable>
    </>
  )
}

export default YourVoteList
