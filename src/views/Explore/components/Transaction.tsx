import isEmpty from 'lodash/isEmpty'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, LinkExternal, Text } from 'uikit-dev'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import CardTab from './CardTab'
import PaginationCustom from './Pagination'
import { Table, TD, TH, TR } from './Table'

interface TransactionType {
  className?: string
}

const EmptyData = ({ text }) => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '416px' }}>
        <Text textAlign="center">{text}</Text>
      </div>
    </TD>
  </TR>
)

const TransactionTable = ({ rows, empText }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [cols] = useState(['DATE', 'INVESTORS', 'ACTION', 'SHARES', 'TOTAL AMOUNT'])
  const pages = useMemo(() => Math.ceil(rows.length / 7), [rows])

  useEffect(
    () => () => {
      setCurrentPage(1)
    },
    [],
  )

  return (
    <>
      {pages > 1 && (
        <PaginationCustom
          count={pages}
          size="small"
          hidePrevButton
          hideNextButton
          className="mb-2"
          onChange={(e, page) => {
            setCurrentPage(page)
          }}
        />
      )}

      <Table>
        <TR>
          {cols.map((c) => (
            <TH>
              <Text color="textSubtle" fontSize="12px" bold>
                {c}
              </Text>
            </TH>
          ))}
          <TH />
        </TR>

        {isEmpty(rows) ? (
          <EmptyData text={empText} />
        ) : (
          rows.map((r) => (
            <TR>
              <TD>
                <Text>{r.date}</Text>
              </TD>
              <TD>
                <div className="flex">
                  <Text className="mr-2">
                    {r.investors.substring(0, 6)}...{r.investors.substring(r.investors.length - 4)}
                  </Text>
                  <CopyToClipboard toCopy={r.investors} iconWidth="16px" noText />
                </div>
              </TD>
              <TD>
                <Text>{r.action}</Text>
              </TD>
              <TD>
                <Text>{r.shares}</Text>
              </TD>
              <TD>
                <Text>{r.total}</Text>
              </TD>
              <TD>
                <LinkExternal noIcon href="https://scope.klaytn.com/account/}" fontSize="12px">
                  KlaytnScope
                </LinkExternal>
              </TD>
            </TR>
          ))
        )}
      </Table>
    </>
  )
}

const Transaction: React.FC<TransactionType> = ({ className = '' }) => {
  const [currentTab, setCurrentTab] = useState(0)

  useEffect(
    () => () => {
      setCurrentTab(0)
    },
    [],
  )

  const rowsAllTs = [
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Withdraw',
      shares: '19.993',
      total: '$67,055.30',
    },
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Withdraw',
      shares: '19.993',
      total: '$67,055.30',
    },
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Invest',
      shares: '19.993',
      total: '$67,055.30',
    },
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Invest',
      shares: '19.993',
      total: '$67,055.30',
    },
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Invest',
      shares: '19.993',
      total: '$67,055.30',
    },
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Withdraw',
      shares: '19.993',
      total: '$67,055.30',
    },
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Invest',
      shares: '19.993',
      total: '$67,055.30',
    },
    {
      date: '15/06/2021, 21:08',
      investors: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2',
      action: 'Invest',
      shares: '19.993',
      total: '$67,055.30',
    },
  ]
  const rowsMyTs = []

  return (
    <Card className={className}>
      <CardTab menus={['ALL TRANSACTION', 'MY TRANSACTION']} current={currentTab} setCurrent={setCurrentTab} />

      <div className="pa-4">
        {currentTab === 0 ? (
          <TransactionTable rows={rowsAllTs} empText="Don't have any transactions in this fund." />
        ) : (
          <TransactionTable rows={rowsMyTs} empText="You haven't made any transactions in this fund." />
        )}
      </div>
    </Card>
  )
}

export default Transaction
