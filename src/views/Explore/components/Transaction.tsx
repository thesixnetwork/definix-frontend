/* eslint-disable no-nested-ternary */
import CircularProgress from '@mui/material/CircularProgress'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import numeral from 'numeral'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AddIcon, Card, LinkExternal, MinusIcon, Text } from 'uikit-dev'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { getAddress } from 'utils/addressHelpers'
import CardTab from './CardTab'
import PaginationCustom from './Pagination'
import { Table, TD, TH, TR } from './Table'

interface TransactionType {
  className?: string
  rbAddress: any
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

const Overflow = styled.div`
  overflow: auto;
`

const TransactionTable = ({ rows, empText, isLoading }) => {
  const [cols] = useState(['INVESTORS', 'ACTION', 'SHARES', 'TOTAL AMOUNT', 'DATE'])

  return (
    <Overflow className="pa-4 pt-0">
      <Table>
        <TR>
          {cols.map((c) => (
            <TH key={c}>
              <Text color="textSubtle" fontSize="12px" bold>
                {c}
              </Text>
            </TH>
          ))}
          <TH />
        </TR>

        {isLoading ? (
          <LoadingData />
        ) : isEmpty(rows) ? (
          <EmptyData text={empText} />
        ) : (
          rows.map((r) => (
            <TR key={`tsc-${r.block_number}`}>
              <TD>
                <div className="flex">
                  <Text className="mr-2">
                    {r.user_address.substring(0, 6)}...{r.user_address.substring(r.user_address.length - 4)}
                  </Text>
                  <CopyToClipboard toCopy={r.user_address} iconWidth="16px" noText />
                </div>
              </TD>
              <TD>
                <div className="flex align-center">
                  {r.event_name === 'AddFundAmount' ? (
                    <>
                      <AddIcon color="success" className="mr-1" />
                      <Text>Invest</Text>
                    </>
                  ) : (
                    <>
                      <MinusIcon color="failure" className="mr-1" />
                      <Text>Withdraw</Text>
                    </>
                  )}
                </div>
              </TD>
              <TD>
                <Text>{numeral(r.lp_amount).format('0,0.000')}</Text>
              </TD>
              <TD>
                <Text>{`$${numeral(r.total_value).format('0,0.00')}`}</Text>
              </TD>
              <TD>
                <Text>{moment(r.timestamp).format('DD/MM/YYYY, HH:mm')}</Text>
              </TD>
              <TD>
                <LinkExternal noIcon href={`https://bscscan.com/tx/${r.transaction_hash}`} fontSize="12px">
                  Bscscan
                </LinkExternal>
              </TD>
            </TR>
          ))
        )}
      </Table>
    </Overflow>
  )
}

const Transaction: React.FC<TransactionType> = ({ className = '', rbAddress }) => {
  const address = getAddress(rbAddress)
  const { account } = useWallet()

  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const pages = useMemo(() => Math.ceil(total / 10), [total])

  const setDefault = (tab) => {
    setCurrentTab(tab)
    setCurrentPage(1)
    setTransactions([])
    setTotal(0)
  }

  const fetchTransaction = useCallback(async () => {
    if (currentTab === 1 && !account) {
      return
    }

    setIsLoading(true)
    const api = process.env.REACT_APP_API_REBALANCING_TRANSACTION
    const response = await axios.get(api, {
      params: {
        pool: (address || '').toLowerCase(),
        limit: 10,
        address: currentTab === 0 ? '' : account,
        page: currentPage,
      },
    })
    setIsLoading(false)
    setTotal(response.data.total)
    setTransactions(response.data.result)
  }, [account, address, currentPage, currentTab])

  const onTabChange = (tab) => {
    setDefault(tab)
  }
  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchTransaction()
  }, [fetchTransaction])

  useEffect(() => {
    return () => {
      setDefault(0)
    }
  }, [])

  return (
    <Card className={className}>
      <CardTab menus={['ALL TRANSACTIONS', 'MY TRANSACTIONS']} current={currentTab} setCurrent={onTabChange} />

      <PaginationCustom
        page={currentPage}
        count={pages}
        size="small"
        hidePrevButton
        hideNextButton
        className="px-4 py-2"
        onChange={onPageChange}
      />

      <TransactionTable
        rows={transactions}
        isLoading={isLoading}
        empText={
          currentTab === 0
            ? 'Don`t have any transactions in this farm.'
            : 'You haven`t made any transactions in this farm.'
        }
      />
    </Card>
  )
}

export default Transaction
