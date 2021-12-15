/* eslint-disable no-nested-ternary */
import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import Helper from 'uikit-dev/components/Helper'
import { fetchIdData, fetchStartIndex } from '../../../state/longTermStake'
import { Card, Button, Text } from '../../../uikit-dev'
import { useClaim, useLockTopup } from '../../../hooks/useLongTermStake'
import PaginationCustom from './Pagination'
import CardHarvest from './CardHarvest'

const CardTable = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

export const TR = styled.tr`
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

export const TD = styled.td<{ align?: string }>`
  width: 100%;
  vertical-align: middle;
  align-self: ${'center'};
`

const TBody = styled.div`
  overflow: auto;
  position: relative;
`

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

const LockVfinixList = ({ rows, isLoading, isDark, total }) => {
  const [cols] = useState(['Stake Period', 'Amount', 'Status', ''])
  const [currentPage, setCurrentPage] = useState(1)
  const pages = useMemo(() => Math.ceil(total / 10), [total])
  const [statusClaim, setStatusClaim] = useState(false)

  const dispatch = useDispatch()
  const { onClaim } = useClaim()

  // penaltyFinixAmount
  const onUnStake = useCallback(
    (Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty, Multiplier, Days) => {
      dispatch(fetchIdData(Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty, Multiplier, Days))
    },
    [dispatch],
  )

  const handleClaim = useCallback(
    (Id) => {
      try {
        const res = onClaim(Id)
        res
          .then((r) => {
            setStatusClaim(true)
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.error(e)
      }
    },
    [onClaim, setStatusClaim],
  )

  const onPageChange = (e, page) => {
    setCurrentPage(page)
    dispatch(fetchStartIndex((page - 1) * 10))
  }

  const handleUnstake = (item) => {
    onUnStake(
      _.get(item, 'id'),
      _.get(item, 'level'),
      _.get(item, 'lockAmount'),
      _.get(item, 'isPenalty'),
      !_.get(item, 'canBeUnlock'),
      _.get(item, 'penaltyRate'),
      _.get(item, 'periodPenalty'),
      _.get(item, 'multiplier'),
      _.get(item, 'days'),
    )
  }

  const handleIsunlocked = (item) => {
    return _.get(item, 'isPenalty') ? (
      <Button
        fullWidth
        as={Link}
        to="/long-term-stake/unstake"
        radii="small"
        disabled
        style={{
          backgroundColor: 'transparent',
          border: `1px solid #8C90A5`,
          display: 'unset',
          padding: '6px',
          color: '#8C90A5',
          fontStyle: 'italic',
          fontWeight: 'normal',
        }}
        className="text-right mr-1"
      >
        Claimed
      </Button>
    ) : (
      <Button
        fullWidth
        as={Link}
        to="/long-term-stake/unstake"
        radii="small"
        disabled
        style={{
          backgroundColor: 'transparent',
          border: `1px solid #8C90A5`,
          display: 'unset',
          padding: '6px',
          color: '#8C90A5',
          fontStyle: 'italic',
          fontWeight: 'normal',
        }}
        className="text-right mr-1"
      >
        Unstaked
      </Button>
    )
  }

  const handleClaimed = (item) => {
    return _.get(item, 'canBeClaim') ? (
      <Button
        fullWidth
        as={Link}
        radii="small"
        style={{
          backgroundColor: '#2A9D8F',
          border: `1px solid #2A9D8F`,
          display: 'unset',
          padding: '6px',
          color: '#fff',
          fontStyle: 'italic',
          fontWeight: 'normal',
        }}
        onClick={() => handleClaim(_.get(item, 'id'))}
        className="text-right mr-1"
      >
        Claim
      </Button>
    ) : (
      <Button
        fullWidth
        as={Link}
        radii="small"
        disabled
        style={{
          backgroundColor: 'transparent',
          border: `1px solid #8C90A5`,
          display: 'unset',
          padding: '6px',
          color: '#8C90A5',
          fontStyle: 'italic',
          fontWeight: 'normal',
        }}
        className="text-right mr-1"
      >
        Claim
      </Button>
    )
  }

  const handleCanUnlock = (item) => {
    return _.get(item, 'canBeUnlock') ? (
      <Button
        fullWidth
        as={Link}
        to="/long-term-stake/unstake"
        radii="small"
        style={{
          backgroundColor: '#0973B9',
          border: `1px solid #0973B9`,
          display: 'unset',
          padding: '6px',
          color: '#fff',
          fontStyle: 'italic',
          fontWeight: 'normal',
        }}
        onClick={() => handleUnstake(item)}
        className="text-right mr-1"
      >
        Unstake
      </Button>
    ) : (
      <Button
        fullWidth
        as={Link}
        to="/long-term-stake/unstake"
        radii="small"
        style={{
          backgroundColor: '#EA9D00',
          border: `1px solid #EA9D00`,
          display: 'unset',
          padding: '6px',
          color: '#fff',
          fontStyle: 'italic',
          fontWeight: 'normal',
        }}
        onClick={() => handleUnstake(item)}
        className="text-right mr-1"
      >
        Early Unstake
      </Button>
    )
  }

  const handleNotIsunlocked = (item) => {
    return _.get(item, 'isPenalty') ? handleClaimed(item) : handleCanUnlock(item)
  }

  const handleStatusNormal = (item) => {
    return _.get(item, 'isUnlocked') ? 'Period ended' : 'Period will end'
  }

  const handleStatusPenalty = (item) => {
    let status
    if (_.get(item, 'isPenalty') && _.get(item, 'canBeClaim')) {
      status = 'Penalty ended'
    } else {
      status = 'Penalty will end'
    }
    return status
  }

  return (
    <CardTable className="mt-5" style={{ overflow: 'auto' }}>
      <CardHarvest />
      <Table>
        <TR>
          {cols.map((c) => (
            <TD key={c}>
              <Text color="textSubtle" fontSize="14px">
                {c}
              </Text>
            </TD>
          ))}
        </TR>

        {isLoading ? (
          <LoadingData />
        ) : isEmpty(rows) ? (
          <EmptyData text="No data" />
        ) : (
          <TBody>
            {rows !== null &&
              rows.map((item, idx) => (
                <TR key={_.get(item, 'id')}>
                  <TD>
                    <Text color="textSubtle">
                      <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                        {_.get(item, 'multiplier')}x {_.get(item, 'days')} days
                      </Text>
                      {_.get(item, 'topup').some((topup) => Number(topup) === item.id) && (
                        <>
                          <div className="flex align-center">
                            <Text color="#F5C858" fontSize="12px" bold>
                              28 days Super Staked
                            </Text>
                            <Helper
                              text="Super Stake is a feature that can harvest all of your FINIX reward to stake in Long-term stake with no minimum amount. You can stake as much as FINIX you prefer under the same lock period within 28 days, your lock period will not be extended."
                              className="ml-1 pt-1"
                              position="bottom"
                            />
                          </div>
                          <Text fontSize="8.5px">
                            {item.lockTopupTimes} - {item.topupTimeStamp}
                          </Text>
                        </>
                      )}
                    </Text>
                  </TD>
                  <TD className="col-3">
                    <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                      {_.get(item, 'isPenalty')
                        ? _.get(item, 'lockAmount') - (_.get(item, 'penaltyRate') / 100) * _.get(item, 'lockAmount')
                        : _.get(item, 'lockAmount').toLocaleString()}
                    </Text>
                  </TD>
                  <TD>
                    <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="initial">
                      {_.get(item, 'isPenalty') ? handleStatusPenalty(item) : handleStatusNormal(item)}
                    </Text>
                    <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600" fontSize="13px">
                      {_.get(item, 'isPenalty') ? _.get(item, 'penaltyUnlockTimestamp') : _.get(item, 'lockTimestamp')}{' '}
                      GMT+9
                    </Text>
                  </TD>
                  <TD className="text-right">
                    {_.get(item, 'isUnlocked') ? handleIsunlocked(item) : handleNotIsunlocked(item)}
                  </TD>
                </TR>
              ))}
            <TR>
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
            </TR>
          </TBody>
        )}
      </Table>
    </CardTable>
  )
}

export default LockVfinixList
