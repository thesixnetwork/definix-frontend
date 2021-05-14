import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import axios from 'axios'
import _ from 'lodash'
import { Skeleton, Card, Text, useMatchBreakpoints } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import badge1 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-10.png'
import badge2 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-11.png'
import badge3 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-12.png'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'

const Rank = styled.img`
  width: 24px;
`

const Avatar = styled.img`
  width: 40px;
  border-radius: ${({ theme }) => theme.radii.circle};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const Row = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;

  &:last-child {
    margin: 0;
  }
`

const Table = styled(Card)`
  overflow: visible;
`

const TBody = styled.div`
  overflow: auto;
  position: relative;

  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 700px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    // max-height: 511px;
    max-height: 1000px;
  }
`

const TR = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border: none;
  }

  &.isMe {
    position: sticky;
    bottom: 1px;
    left: 0;
    background: #f7f7f8;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`

const TRLoading = styled(TR)`
  padding: 14px;
`

const TD = styled.div<{ rank?: number }>`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 8px;

    &:nth-child(01) {
      width: 15%;
      justify-content: center;
      background: ${({ rank, theme }) =>
        // eslint-disable-next-line no-nested-ternary
        rank === 1 ? theme.colors.success : rank === 2 ? theme.colors.primary : rank === 3 ? theme.colors.warning : ''};
    }
    &:nth-child(02) {
      width: 20%;
      justify-content: center;
    }
    &:nth-child(03) {
      width: 65%;
      flex-direction: column;
      align-items: stretch;
      padding: 16px 16px 16px 8px;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 16px;

    &:nth-child(01) {
      width: 10%;
      justify-content: center;
    }
    &:nth-child(02) {
      width: 25%;
      justify-content: flex-start;
    }
    &:nth-child(03) {
      width: 25%;
      flex-direction: row;
      align-items: center;
      padding: 16px;
    }
    &:nth-child(04) {
      width: 20%;
      justify-content: flex-end;
    }
    &:nth-child(05) {
      width: 20%;
      justify-content: flex-end;
    }
  }
`

const LeaderTable = ({ className = '', items }) => {
  const { isSm } = useMatchBreakpoints()
  const { account } = useWallet()

  if (isSm) {
    return (
      <Table className={className} isRainbow>
        <TBody>
          {items.length === 0
            ? Array.from(Array(100).keys()).map((item) => (
                <TRLoading key={item}>
                  <Skeleton height={23} width="100%" />
                </TRLoading>
              ))
            : items.map((item) => (
                <TR key={item.id} className={item.address === account || item.id === 'isMe' ? 'isMe' : ''}>
                  <TD rank={item.rank}>
                    {item.rank === 1 && <Rank src={badge1} alt="" />}
                    {item.rank === 2 && <Rank src={badge2} alt="" />}
                    {item.rank === 3 && <Rank src={badge3} alt="" />}
                    {(!item.rank || item.rank > 3) && <Text bold>{item.rank || '-'}</Text>}
                  </TD>

                  <TD>
                    <Avatar src={item.avatar} alt="" />
                  </TD>

                  <TD>
                    <Row>
                      <Text bold ellipsis>
                        {item.name}
                      </Text>
                    </Row>

                    <Row>
                      <Text fontSize="12px">Address</Text>
                      <Row className="mb-0">
                        <Text className="mr-2" bold fontSize="12px">
                          {item.address
                            ? `${item.address.substring(0, 4)}...${item.address.substring(item.address.length - 4)}`
                            : null}
                        </Text>
                      </Row>
                    </Row>

                    <Row>
                      <Row className="mb-0">
                        <Text fontSize="12px">Value</Text>
                        <Helper
                          text="The current trading volume in each consecutive trading period in the total amount for each port."
                          className="ml-2"
                          position="bottom"
                        />
                      </Row>
                      <Text bold fontSize="16px">{`$${item.value}`}</Text>
                    </Row>
                    <Row>
                      <Row className="mb-0">
                        <Text fontSize="12px">P/L (%)</Text>
                        <Helper
                          text="The average profit/loss ratio for an active portfolios primarily motive is to maximize trading gains (in percentage division)."
                          className="ml-2"
                          position="bottom"
                        />
                      </Row>
                      <Text bold fontSize="16px" color="success">{`${item.pl}%`}</Text>
                    </Row>
                  </TD>
                </TR>
              ))}
        </TBody>
      </Table>
    )
  }

  return (
    <Table className={className} isRainbow>
      <TR>
        <TD>
          <Text>Rank</Text>
        </TD>
        <TD>
          <Text>Name</Text>
        </TD>
        <TD>
          <Text>Address</Text>
        </TD>
        <TD>
          <Text>Value</Text>
          <Helper
            text="The current trading volume in each consecutive trading period in the total amount for each port."
            className="ml-2"
            position="bottom"
          />
        </TD>
        <TD>
          <Text>P/L (%)</Text>
          <Helper
            text="The average profit/loss ratio for an active portfolios primarily motive is to maximize trading gains (in percentage division)."
            className="ml-2"
            position="left"
          />
        </TD>
      </TR>
      <TBody>
        {items.length === 0
          ? Array.from(Array(100).keys()).map((item) => (
              <TRLoading key={item}>
                <Skeleton height={23} width="100%" />
              </TRLoading>
            ))
          : items.map((item, idx) => (
              <TR key={item.id} className={item.address === account || item.id === 'isMe' ? 'isMe' : ''}>
                <TD>
                  <Text bold>{item.rank || '-'}</Text>
                </TD>

                <TD>
                  <Avatar src={item.avatar} alt="" className="mr-3" />
                  <Text bold ellipsis>
                    {item.name}
                  </Text>
                </TD>

                <TD>
                  <Text className="mr-2">
                    {item.address
                      ? `${item.address.substring(0, 4)}...${item.address.substring(item.address.length - 4)}`
                      : null}
                  </Text>
                </TD>

                <TD>
                  <Text bold>{`$${item.value}`}</Text>
                </TD>
                <TD>
                  <Text bold color="success">{`${item.pl}%`}</Text>
                </TD>
              </TR>
            ))}
      </TBody>
    </Table>
  )
}

export default LeaderTable
