import React from 'react'
import styled from 'styled-components'
import { CheckmarkCircleIcon, ChevronRightIcon, ErrorIcon, Link, Text } from 'uikit-dev'
import CurrencyLogo from './CurrencyLogo'

const Currency = styled.div`
  display: flex;
  align-items: center;
  margin: 0 8px;
`

const Box = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border: none;
  }
`

const TransactionHistoryBox = ({
  href = '/',
  title,
  firstCoin,
  secondCoin,
  firstCoinAmount,
  secondCoinAmount,
  withText,
  date,
  isFailed = false
}) => {
  return (
    <Box>
      <div className="flex justify-space-between">
        <Text fontSize="12px" color="textSubtle">
          {date}
        </Text>
        <Text fontSize="12px" color={isFailed ? 'failure' : 'success'} className="flex align-center" bold>
          {isFailed ? (
            <>
              <ErrorIcon className="mr-2" /> Failed
            </>
          ) : (
            <>
              <CheckmarkCircleIcon className="mr-2" /> Complete
            </>
          )}
        </Text>
      </div>

      <div className="flex align-center flex-wrap my-2">
        <Text>{title}</Text>
        <Currency>
          <CurrencyLogo currency={firstCoin} size="24px" style={{ marginRight: '8px' }} />
          <Text bold>
            {firstCoinAmount} {(firstCoin || {}).name}
          </Text>
        </Currency>
        <Text color="textSubtle">{withText}</Text>
        <Currency>
          <CurrencyLogo currency={secondCoin} size="24px" style={{ marginRight: '8px' }} />
          <Text bold>
            {secondCoinAmount} {(secondCoin || {}).name}
          </Text>
        </Currency>
      </div>

      <Link external href={href} bold={false} color="textSubtle" fontSize="12px" style={{ display: 'inline-flex' }}>
        View on Klaytn Scope
        <ChevronRightIcon color="textSubtle" />
      </Link>
    </Box>
  )
}
export default TransactionHistoryBox
