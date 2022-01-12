/* eslint-disable no-nested-ternary */
import CircularProgress from '@material-ui/core/CircularProgress'
import InfiniteScroll from 'react-infinite-scroll-component'
import { isEmpty } from 'lodash-es'
import moment from 'moment'
import numeral from 'numeral'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  Box,
  CopyToClipboard,
  Flex,
  Grid,
  LinkExternal,
  Text,
  Toggle,
  useMatchBreakpoints,
} from '@fingerlabs/definixswap-uikit-v2'
import { getAddress } from 'utils/addressHelpers'
import EllipsisText from 'components/EllipsisText'
import CurrencyText from 'components/CurrencyText'

import useGetRequest from 'hooks/useGetRequest'
import useWallet from 'hooks/useWallet'
import { TD, TH } from './Table'

interface TransactionType {
  className?: string
  rbAddress: any
}

const EmptyData = ({ text, height = 'auto' }) => (
  <div className="flex align-center justify-center" style={{ height }}>
    <Text textStyle="R_14R" textAlign="center" color="textSubtle">
      {text}
    </Text>
  </div>
)

const LoadingData = ({ height = 'auto' }) => (
  <div className="flex align-center justify-center py-s24" style={{ height }}>
    <CircularProgress size={16} color="inherit" className="mr-2" />
    <Text textStyle="R_14R">Loading...</Text>
  </div>
)

const Overflow = styled.div`
  overflow: auto;
`

const StyledTH = styled(TH)<{ border: boolean }>`
  ${({ theme, border }) => border && `border-top: 1px solid ${theme.colors.border}`};
`

const TransactionTable = ({ rows, mx, hasMore, fetchMoreData }) => {
  const { t } = useTranslation()
  const [cols] = useState([t('Investors'), t('Action'), t('Shares'), t('Total Amount'), t('Date'), t('Scope')])

  return (
    <Overflow>
      <Box mx={mx} minWidth="fit-content">
        <InfiniteScroll dataLength={rows.length} next={fetchMoreData} hasMore={hasMore} loader={<LoadingData />}>
          <Grid gridTemplateColumns={`repeat(${cols.length}, 1fr)`}>
            {cols.map((c, idx) => (
              <StyledTH align={idx > 0 ? 'center' : null} key={c} oneline as="div" border>
                <Text key={c} color="mediumgrey" textStyle="R_12M">
                  {c}
                </Text>
              </StyledTH>
            ))}
            {rows.map((r) => (
              <Fragment key={`tx-row-${r.block_number}`}>
                <TD as="div">
                  <Flex alignItems="center">
                    <Text textStyle="R_14R">
                      <EllipsisText start={6} end={5} text={r.user_address} />
                    </Text>
                    <CopyToClipboard toCopy={r.user_address} />
                  </Flex>
                </TD>
                <TD align="center" oneline as="div">
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
                <TD align="center" as="div">
                  <Text textStyle="R_14R">{numeral(r.lp_amount).format('0,0.000')}</Text>
                </TD>
                <TD align="center" as="div">
                  <CurrencyText value={r.total_value} textStyle="R_14R" />
                </TD>
                <TD align="center" oneline as="div">
                  <Text textStyle="R_14R">{moment(r.timestamp).format('DD/MM/YYYY, HH:mm')}</Text>
                </TD>
                <TD align="center" as="div">
                  <LinkExternal
                    textStyle="R_14R"
                    color="mediumgrey"
                    href={`https://scope.klaytn.com/tx/${r.transaction_hash}`}
                  >
                    KlaytnScope
                  </LinkExternal>
                </TD>
              </Fragment>
            ))}
          </Grid>
        </InfiniteScroll>
      </Box>
    </Overflow>
  )
}

const Transaction: React.FC<TransactionType> = ({ className = '', rbAddress }) => {
  const { t } = useTranslation()
  const address = getAddress(rbAddress)
  const { account } = useWallet()
  const { data, request, cancel, loading } = useGetRequest()
  const { isMaxXl } = useMatchBreakpoints()
  const size = isMaxXl
    ? {
        marginX: 'S_20',
        marginY: 'S_20',
        cardMarginBottom: 'S_20',
      }
    : {
        marginX: 'S_32',
        marginY: 'S_24',
        cardMarginBottom: 'S_32',
      }

  const [currentPage, setCurrentPage] = useState(1)
  const [myOnly, setMyOnly] = useState(false)

  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const pages = useMemo(() => Math.ceil(total / 20), [total])

  const setDefault = () => {
    setMyOnly(false)
    setCurrentPage(1)
    setTransactions([])
    setTotal(0)
  }

  useEffect(() => {
    setTransactions([])
    setTotal(0)
    setCurrentPage(1)
  }, [myOnly])

  useEffect(() => {
    if (data?.page) {
      setTotal(data?.total)
      setTransactions((prev) => (data?.page === 1 ? data?.result : prev.concat(data?.result)))
    }
  }, [data])

  useEffect(() => {
    const api = process.env.REACT_APP_API_REBALANCING_TRANSACTION
    const pool = (address || '').toLowerCase()

    if (api && pool && (!myOnly || account)) {
      request(api, {
        pool,
        limit: 20,
        address: myOnly ? account : '',
        page: currentPage,
      })
    }

    return cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, address, currentPage, myOnly])

  useEffect(() => {
    return () => {
      setDefault()
    }
  }, [])

  return (
    <div className={className}>
      <Flex justifyContent="flex-end" alignItems="center" mx={size.marginX} my={size.marginY}>
        <Text mr="S_8" color="deepgrey" textStyle="R_14R">
          {t('My Transaction only')}
        </Text>
        <Toggle checked={myOnly} onChange={() => setMyOnly(!myOnly)} />
      </Flex>

      <Box pb={size.cardMarginBottom}>
        {isEmpty(transactions) ? (
          loading ? (
            <LoadingData height="188px" />
          ) : (
            <EmptyData
              text={t(myOnly ? 'You haven`t made any transactions' : 'Don`t have any transactions')}
              height="188px"
            />
          )
        ) : (
          <TransactionTable
            mx={size.marginX}
            rows={transactions}
            hasMore={pages > currentPage}
            fetchMoreData={() => setCurrentPage(currentPage + 1)}
          />
        )}
      </Box>
    </div>
  )
}

export default Transaction
