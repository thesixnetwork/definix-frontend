/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import _ from 'lodash'
import { fetchStartIndex } from '../../../state/longTermStake'
import { Card, Button, Text } from '../../../uikit-dev'
import PaginationCustom from './Pagination'

const CardTable = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  a {
    display: block;
  }
`

export const Table = styled.table`
  width: 100%;
`

export const TR = styled.tr`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 14px;

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

const ButtonDetails = styled(Button)`
  background: unset;
  padding: unset;
  display: flex;
  align-items: center;
  color: #30ADFF;
  font-weight: normal;
  font-size: 12px;
  text-decoration-line: underline;
`

const ButtonAction = styled(Button)`
  font-size: 14px;
  padding: 10px 18px;
  height: 28px;
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

const TableList = ({ rows, isLoading, isDark, total }) => {
  const [cols] = useState(['List', ''])
  const [currentPage, setCurrentPage] = useState(1)
  const pages = useMemo(() => Math.ceil(total / 10), [total])
  const dispatch = useDispatch()

  const onPageChange = (e, page) => {
    setCurrentPage(page)
    dispatch(fetchStartIndex((page - 1) * 10))
  }

  return (
    <div>
      <CardTable className="mt-4" style={{ overflow: 'auto' }}>
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
                          <div className="flex">
                            <Text fontSize="14px !important" color={isDark ? 'white' : 'textSubtle'} fontWeight="600">
                              Token ID #02
                            </Text>
                          </div>
                        </TD>
                        <TD className="text-right">
                          <div className="flex align-center">
                            <ButtonDetails fullWidth radii="small" className="mr-2" size="sm">
                              Details
                            </ButtonDetails>
                            <ButtonAction fullWidth radii="small" size="sm">
                              List
                            </ButtonAction>
                            {/* <ButtonAction  fullWidth radii="small" size="sm">
                              Delist
                            </ButtonAction> */}
                          </div>
                        </TD>
                      </TR>
                    ))}
                </TBody>
              )}
        </Table>
      </CardTable>
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
    </div>
  )
}

export default TableList
