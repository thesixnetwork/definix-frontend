/* eslint-disable no-nested-ternary */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { Box, FormControlLabel, Link, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import numeral from 'numeral'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import CustomSwitch from 'uikitV2/components/CustomSwitch'
import NoData from 'uikitV2/components/NoData'
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
      <NoData text={text} />
    </TD>
  </TR>
)

const LoadingData = () => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <CircularProgress size={16} color="inherit" className="mr-2" />
        <Typography variant="body2" color="text.disabled">
          Loading...
        </Typography>
      </div>
    </TD>
  </TR>
)

const TransactionTable = ({ rows, empText, isLoading }) => {
  const [cols] = useState(['Investors', 'Action', 'Shares', 'Total Amount', 'Date', 'BscScan'])

  return (
    <Box px={{ xs: 2.5, lg: 4 }} overflow="auto">
      <Table>
        <TR>
          {cols.map((c) => (
            <TH key={c}>{c}</TH>
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
                  <Typography variant="body2" className="mr-2">
                    {r.user_address.substring(0, 6)}...{r.user_address.substring(r.user_address.length - 4)}
                  </Typography>
                  <CopyToClipboard toCopy={r.user_address} iconWidth="14px" noText />
                </div>
              </TD>
              <TD>
                {r.event_name === 'AddFundAmount' ? (
                  <Typography variant="body2" color="success.main">
                    + Invest
                  </Typography>
                ) : (
                  <Typography variant="body2" color="error.main">
                    - Withdraw
                  </Typography>
                )}
              </TD>
              <TD>
                <Typography variant="body2">{numeral(r.lp_amount).format('0,0.000')}</Typography>
              </TD>
              <TD>
                <Typography variant="body2">{`$${numeral(r.total_value).format('0,0.00')}`}</Typography>
              </TD>
              <TD>
                <Typography variant="body2">{moment(r.timestamp).format('DD/MM/YYYY, HH:mm')}</Typography>
              </TD>
              <TD>
                <Link
                  variant="body2"
                  color="text.disabled"
                  href={`https://bscscan.com/tx/${r.transaction_hash}`}
                  className="flex align-center"
                  target="_blank"
                >
                  BscScan
                  <OpenInNewRoundedIcon className="ml-2" sx={{ fontSize: '16px' }} />
                </Link>
              </TD>
            </TR>
          ))
        )}
      </Table>
    </Box>
  )
}

const Transaction: React.FC<TransactionType> = ({ rbAddress }) => {
  const address = getAddress(rbAddress)
  const { account } = useWallet()

  const [isLoading, setIsLoading] = useState(false)
  const [myTransaction, setMyTransaction] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const pages = useMemo(() => Math.ceil(total / 10), [total])

  const setDefault = () => {
    setCurrentPage(1)
    setTransactions([])
    setTotal(0)
  }

  const fetchTransaction = useCallback(async () => {
    if (myTransaction && !account) {
      setDefault()
      return
    }

    setIsLoading(true)
    const api = process.env.REACT_APP_API_REBALANCING_TRANSACTION
    const response = await axios.get(api, {
      params: {
        pool: (address || '').toLowerCase(),
        limit: 10,
        address: myTransaction ? account : '',
        page: currentPage,
      },
    })
    setIsLoading(false)
    setTotal(response.data.total)
    setTransactions(response.data.result)
  }, [account, address, currentPage, myTransaction])

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
    <>
      <Box display="flex" justifyContent="flex-end" py={{ xs: 2.5, lg: '24px' }} px={{ xs: 2.5, lg: 4 }}>
        <FormControlLabel
          labelPlacement="start"
          className="ml-auto"
          label={
            <Typography variant="body2" color="textSecondary">
              My Transaction only
            </Typography>
          }
          control={
            <CustomSwitch
              checked={myTransaction}
              onChange={() => {
                setMyTransaction(!myTransaction)
              }}
            />
          }
        />
      </Box>

      <TransactionTable
        rows={transactions}
        isLoading={isLoading}
        empText={
          myTransaction
            ? 'You haven`t made any transactions in this farm.'
            : 'Don`t have any transactions in this farm.'
        }
      />

      <PaginationCustom
        page={currentPage}
        count={pages}
        size="small"
        hidePrevButton
        hideNextButton
        onChange={onPageChange}
      />
    </>
  )
}

export default Transaction
