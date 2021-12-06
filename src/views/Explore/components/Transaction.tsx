/* eslint-disable no-nested-ternary */
import CircularProgress from '@material-ui/core/CircularProgress'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import numeral from 'numeral'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Box, CopyToClipboard, Flex, LinkExternal, Text, Toggle, useMatchBreakpoints } from 'definixswap-uikit'
import { getAddress } from 'utils/addressHelpers'
import EllipsisText from 'components/EllipsisText'
import PaginationCustom from './Pagination'
import { Table, TD, TH, TR } from './Table'

interface TransactionType {
  className?: string
  rbAddress: any
}

const EmptyData = ({ text }) => (
  <div className="flex align-center justify-center" style={{ height: '188px' }}>
    <Text textStyle="R_14R" textAlign="center" color="textSubtle">
      {text}
    </Text>
  </div>
)

const LoadingData = () => (
  <div className="flex align-center justify-center" style={{ height: '188px' }}>
    <CircularProgress size={16} color="inherit" className="mr-2" />
    <Text textStyle="R_14R">Loading...</Text>
  </div>
)

const Overflow = styled.div`
  overflow: auto;
`

const TransactionTable = ({ rows, empText, isLoading }) => {
  const { t } = useTranslation()
  const [cols] = useState([t('Investors'), t('Action'), t('Shares'), t('Total Amount'), t('Date'), t('Scope')])

  return isLoading ? (
    <LoadingData />
  ) : isEmpty(rows) ? (
    <EmptyData text={empText} />
  ) : (
    <Overflow>
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

        {rows.map((r) => (
          <TR key={`tsc-${r.block_number}`}>
            <TD>
              <Flex alignItems="center">
                <Text textStyle="R_14R">
                  <EllipsisText start={6} end={5} text={r.user_address} />
                </Text>
                <CopyToClipboard toCopy={r.user_address} />
              </Flex>
            </TD>
            <TD align="center" oneline>
              {r.event_name === 'AddFundAmount' ? (
                <Text textStyle="R_14R" color="success">
                  + {t('Action Invest')}
                </Text>
              ) : (
                <Text textStyle="R_14R" color="failure">
                  - {t('Action Withdraw')}
                </Text>
              )}
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
              <LinkExternal
                textStyle="R_14R"
                color="mediumgrey"
                href={`https://scope.klaytn.com/tx/${r.transaction_hash}`}
              >
                KlaytnScope
              </LinkExternal>
            </TD>
          </TR>
        ))}
      </Table>
    </Overflow>
  )
}

const Transaction: React.FC<TransactionType> = ({ className = '', rbAddress }) => {
  const { t } = useTranslation()
  const address = getAddress(rbAddress)
  const { account } = useWallet()
  const { isMaxXl } = useMatchBreakpoints()
  const size = isMaxXl
    ? {
        marginX: 'S_20',
        marginY: 'S_20',
      }
    : {
        marginX: 'S_32',
        marginY: 'S_24',
      }

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
    <div className={className}>
      <Flex justifyContent="flex-end" alignItems="center" mx={size.marginX} my={size.marginY}>
        <Text className="mr-s8" color="deepgrey" textStyle="R_14R">
          {t('My Transaction only')}
        </Text>
        <Toggle checked={myOnly} onChange={() => setMyOnly(!myOnly)} />
      </Flex>

      <PaginationCustom
        page={currentPage}
        count={pages}
        size="small"
        hidePrevButton
        hideNextButton
        onChange={onPageChange}
      />

      <Box mx={size.marginX} mb={size.marginY}>
        <TransactionTable
          rows={transactions}
          isLoading={isLoading}
          empText={t(myOnly ? 'You haven`t made any transactions' : 'Don`t have any transactions')}
        />
      </Box>
    </div>
  )
}

export default Transaction
