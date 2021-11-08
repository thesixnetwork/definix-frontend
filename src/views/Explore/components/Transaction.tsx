/* eslint-disable no-nested-ternary */
import CircularProgress from '@material-ui/core/CircularProgress'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import numeral from 'numeral'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import useTranslation from 'contexts/Localisation/useTranslation'
import { AddIcon, LinkExternal, MinusIcon } from 'uikit-dev'
import { Card, Text, Toggle } from 'definixswap-uikit'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { getAddress } from 'utils/addressHelpers'
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
  const { t } = useTranslation()
  const [cols] = useState([t('Investors'), t('Action'), t('Shares'), t('Total Amount'), t('Date'), t('Scope')])

  return (
    <Overflow className="pa-s24 pt-0">
      <Table>
        <TR>
          {cols.map((c, idx) => (
            <TH align={idx > 0 ? 'center' : null} key={c}>
              <Text color="mediumgrey" textStyle="R_12M">
                {c}
              </Text>
            </TH>
          ))}
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
                  <Text textStyle="R_14R" className="mr-2">
                    {r.user_address.substring(0, 6)}...{r.user_address.substring(r.user_address.length - 4)}
                  </Text>
                  <CopyToClipboard toCopy={r.user_address} iconWidth="16px" noText />
                </div>
              </TD>
              <TD align="center">
                <div className="flex align-center">
                  {r.event_name === 'AddFundAmount' ? (
                    <>
                      <AddIcon color="success" className="mr-1" />
                      <Text textStyle="R_14R">Invest</Text>
                    </>
                  ) : (
                    <>
                      <MinusIcon color="failure" className="mr-1" />
                      <Text textStyle="R_14R">Withdraw</Text>
                    </>
                  )}
                </div>
              </TD>
              <TD align="center">
                <Text textStyle="R_14R">{numeral(r.lp_amount).format('0,0.000')}</Text>
              </TD>
              <TD align="center">
                <Text textStyle="R_14R">{`$${numeral(r.total_value).format('0,0.00')}`}</Text>
              </TD>
              <TD align="center">
                <Text textStyle="R_14R">{moment(r.timestamp).format('DD/MM/YYYY, HH:mm')}</Text>
              </TD>
              <TD align="center">
                <LinkExternal noIcon href={`https://scope.klaytn.com/tx/${r.transaction_hash}`} fontSize="12px">
                  KlaytnScope
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
  const { t } = useTranslation()
  const address = getAddress(rbAddress)
  const { account } = useWallet()

  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [myOnly, setMyOnly] = useState(false)

  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const pages = useMemo(() => Math.ceil(total / 10), [total])

  const setDefault = () => {
    setMyOnly(false)
    setCurrentPage(1)
    setTransactions([])
    setTotal(0)
  }

  const fetchTransaction = useCallback(async () => {
    if (myOnly && !account) {
      return
    }

    setIsLoading(true)
    const api = process.env.REACT_APP_API_REBALANCING_TRANSACTION
    const response = await axios.get(api, {
      params: {
        pool: (address || '').toLowerCase(),
        limit: 10,
        address: myOnly ? account : '',
        page: currentPage,
      },
    })
    setIsLoading(false)
    setTotal(response.data.total)
    setTransactions(response.data.result)
  }, [account, address, currentPage, myOnly])

  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchTransaction()
  }, [fetchTransaction])

  useEffect(() => {
    return () => {
      setDefault()
    }
  }, [])

  return (
    <Card className={className}>
      <div className="flex justify-end align-center px-s32 py-s24">
        <Text className="mr-s8" color="deepgrey" textStyle="R_14R">{t('My Transaction only')}</Text>
        <Toggle checked={myOnly} onChange={() => setMyOnly(!myOnly)} />
      </div>

      <PaginationCustom
        page={currentPage}
        count={pages}
        size="small"
        hidePrevButton
        hideNextButton
        className="px-s32 pb-s24"
        onChange={onPageChange}
      />

      <TransactionTable
        rows={transactions}
        isLoading={isLoading}
        empText={
          myOnly ? 'You haven`t made any transactions in this farm.' : 'Don`t have any transactions in this farm.'
        }
      />
    </Card>
  )
}

export default Transaction
