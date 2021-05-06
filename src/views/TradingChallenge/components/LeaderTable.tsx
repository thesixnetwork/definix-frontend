import React from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import badge1 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-10.png'
import badge2 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-11.png'
import badge3 from 'uikit-dev/images/for-trading-challenge/Definix-Trading-Challenge-12.png'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import CardValue from 'views/Home/components/CardValue'

const StyleCard = styled(Card)``

const Avatar = styled.img`
  width: 56px;
`

const Table = styled.div``

const THead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const TBody = styled.div``

const TR = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TD = styled.div`
  display: flex;
  align-items: center;
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

const LeaderTable = ({ className = '', items }) => {
  return (
    <StyleCard className={className} isRainbow>
      <Table>
        <THead>
          <TD>
            <Text>No.</Text>
          </TD>
          <TD>
            <Text>Name</Text>
          </TD>
          <TD>
            <Text>Address</Text>
          </TD>
          <TD>
            <Text>Value</Text>
            <Helper text="" className="ml-2" position="top" />
          </TD>
          <TD>
            <Text>P/L (%)</Text>
            <Helper text="" className="ml-2" position="top" />
          </TD>
        </THead>

        <TBody>
          {items.map((item) => (
            <TR key={item.id}>
              <TD>
                <Text bold>{item.rank}</Text>
              </TD>

              <TD>
                <Avatar src={item.avatar} alt="" className="mb-2" />
                <Text bold>{item.name}</Text>
              </TD>

              <TD>
                <Text className="mr-2">
                  {item.address
                    ? `${item.address.substring(0, 8)}...${item.address.substring(item.address.length - 8)}`
                    : null}
                </Text>
                <CopyToClipboard noPadding toCopy={item.address} />
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
    </StyleCard>
  )
}

export default LeaderTable
