import React from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import badge1 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-10.png'
import badge2 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-11.png'
import badge3 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-12.png'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import CardValue from 'views/Home/components/CardValue'

const StyleCard = styled(Card)<{ rank: number }>`
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 80px;
    border-top-left-radius: ${({ theme }) => theme.radii.default};
    border-top-right-radius: ${({ theme }) => theme.radii.default};
    background: ${({ rank, theme }) => {
      if (rank === 1) {
        return theme.colors.success
      }
      if (rank === 2) {
        return theme.colors.primary
      }

      return theme.colors.warning
    }};
  }
`

const Rank = styled.img`
  width: 80px;
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translate(-50%, 0);
`

const Avatar = styled.img`
  width: 80px;
  border-radius: ${({ theme }) => theme.radii.circle};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const Summary = styled.div`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.backgroundBox};
`

const Row = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 14px;

  &:last-child {
    margin: 0;
  }
`

const LeaderCard = ({ rank, name, avatar, address, value, pl, className = '' }) => {
  const addressEllipsis = address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : null

  return (
    <div className={className} style={{ padding: '8px' }}>
      <StyleCard rank={rank}>
        {rank === 1 && <Rank src={badge1} alt="" />}
        {rank === 2 && <Rank src={badge2} alt="" />}
        {rank === 3 && <Rank src={badge3} alt="" />}

        <div className="flex flex-column align-center pa-4">
          <Avatar src={avatar} alt="" className="mb-2" />

          <Text bold fontSize="16px" className="mb-1">
            {name}
          </Text>
          <div className="flex align-center">
            <Text className="mr-2">{addressEllipsis}</Text>
            <CopyToClipboard noPadding toCopy={address} />
          </div>
        </div>

        <Summary>
          <Row>
            <Row className="mb-0">
              <Text small>Value</Text>
              <Helper
                text="The current trading volume in each consecutive trading period in the amount for a port."
                className="ml-2"
                position="bottom"
              />
            </Row>
            <CardValue fontSize="14px" fontWeight="bold" decimals={2} value={value} prefix="$" />
          </Row>
          <Row>
            <Row className="mb-0">
              <Text small>P/L (%)</Text>
              <Helper
                text="The average profit/loss ratio for an active portfolios primarily motive is to maximize trading gains (in percentage division)."
                className="ml-2"
                position="bottom"
              />
            </Row>
            <CardValue fontSize="14px" fontWeight="bold" color="success" decimals={2} value={pl} suffix="%" />
          </Row>
        </Summary>
      </StyleCard>
    </div>
  )
}

export default LeaderCard
