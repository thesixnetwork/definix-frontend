/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import useTheme from 'hooks/useTheme'
import CircularProgress from '@material-ui/core/CircularProgress'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { fetchIdData } from 'state/longTermStake'
import { Card, Button, Text } from '../../../uikit-dev'
import { useLocks, useUnLock, useLockCount, useClaim, useAllowance } from '../../../hooks/useLongTermStake'
import PaginationCustom from './Pagination'
import FinixStakeCard from './FinixStakeCard'
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
  padding: 20px;
  width: 100%;
  vertical-align: middle;
  padding-left: 24px;
  //   text-align: ${({ align }) => align || 'center'};
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

const TransactionTable = ({ rows, setAlldata, isLoading, id, unlock, isDark, total }) => {
  const [cols] = useState(['Stake Period', 'Amount', 'Status', ''])
  const [currentPage, setCurrentPage] = useState(1)
  const pages = useMemo(() => Math.ceil(total / 10), [total])
  const statuu = false
  const dispatch = useDispatch()

  const { unnLock } = useUnLock()
  const { onClaim } = useClaim()

  const onUnStake = useCallback(
    (Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty) => {
      dispatch(fetchIdData(Id, Level, Amount, IsPenalty, CanBeUnlock, PenaltyRate, PeriodPenalty))
    },
    [dispatch],
  )

  const handleClaim = useCallback(
    (Id) => {
      try {
        const res = onClaim(Id)
        res
          .then((r) => {
            console.log(r)
            // unlock(!statuu)
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.error(e)
      }
    },
    [onClaim],
  )

  const onPageChange = (e, page) => {
    setCurrentPage(page)
    setAlldata(page - 1)
  }

  return (
    <CardTable className="mt-5" style={{ overflow: 'auto' }}>
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
                      {_.get(item, 'level') === '0' ? (
                        <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                          1x 90 days
                        </Text>
                      ) : _.get(item, 'level') === '1' ? (
                        <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                          2x 180 days
                        </Text>
                      ) : (
                        _.get(item, 'level') === '2' && (
                          <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                            4x 365 days
                          </Text>
                        )
                      )}
                    </Text>
                  </TD>
                  <TD>
                    <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                      {_.get(item, 'lockAmount').toLocaleString()}
                    </Text>
                  </TD>
                  <TD>
                    <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="initial">
                      {_.get(item, 'isPenalty') ? 'Penalty ended' : 'Period will end'}
                    </Text>
                    <Text color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                      {_.get(item, 'isPenalty') ? _.get(item, 'penaltyUnlockTimestamp') : _.get(item, 'lockTimestamp')}
                    </Text>
                  </TD>
                  <TD className="text-right pr-5">
                    {_.get(item, 'isPenalty') && !_.get(item, 'isUnlocked') ? (
                      <Button
                        fullWidth
                        as={Link}
                        disabled={!_.get(item, 'canBeClaim')}
                        radii="small"
                        style={{
                          backgroundColor: 'transparent',
                          border: `1px solid ${_.get(item, 'canBeClaim') ? '#2A9D8F' : '#8C90A5'}`,
                          display: 'unset',
                          padding: '6px',
                          color: _.get(item, 'canBeClaim') ? '#2A9D8F' : '#8C90A5',
                          fontStyle: 'italic',
                          fontWeight: 'normal',
                        }}
                        onClick={() => handleClaim(_.get(item, 'id'))}
                        className="text-right mr-1"
                      >
                        Claim
                      </Button>
                    ) : (
                      !_.get(item, 'isUnlocked') && (
                        <Button
                          // disabled={_.get(item, 'canBeUnlock')}
                          fullWidth
                          as={Link}
                          to="/long-term-stake/unstake"
                          radii="small"
                          style={{
                            backgroundColor: 'transparent',
                            // border: `1px solid ${_.get(item, 'canBeUnlock') ? '#8C90A5' : '#30ADFF'}`,
                            border: `1px solid #30ADFF`,
                            display: 'unset',
                            padding: '6px',
                            // color: _.get(item, 'canBeUnlock') ? '#8C90A5' : '#30ADFF',
                            color: '#30ADFF',
                            fontStyle: 'italic',
                            fontWeight: 'normal',
                          }}
                          onClick={() =>
                            onUnStake(
                              _.get(item, 'id'),
                              _.get(item, 'level'),
                              _.get(item, 'lockAmount'),
                              _.get(item, 'isPenalty'),
                              !_.get(item, 'canBeUnlock'),
                              _.get(item, 'penaltyRate'),
                              _.get(item, 'periodPenalty'),
                            )
                          }
                          // onClick={() => handleUnLock(_.get(item, 'id'))}
                          className="text-right mr-1"
                        >
                          Unstake
                        </Button>
                      )
                    )}
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

const StakeTable: React.FC = () => {
  // @ts-ignore
  const { isDark } = useTheme()
  const [allData, setAlldata] = useState(0)
  const { locks } = useLocks(10 * allData)
  const lockCount = useLockCount()
  const [total, setTotal] = useState(lockCount)
  const [isLoading, setIsLoading] = useState(false)
  const [unlock, setUnLick] = useState(false)
  const { account } = useWallet()
  const allowance = useAllowance()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  useEffect(() => {
    if (locks !== null) {
      setTotal(lockCount)
    }
  }, [locks, lockCount])

  return (
    <>
      {isApproved && Number(lockCount) !== 0 && <CardHarvest />}
      <FinixStakeCard />
      {isApproved && Number(lockCount) !== 0 && (
        <TransactionTable
          total={total}
          setAlldata={setAlldata}
          rows={locks}
          isLoading={isLoading}
          id
          unlock={setUnLick}
          isDark={isDark}
        />
      )}
    </>
  )
}

export default StakeTable
