import { useGetStats } from 'hooks/api'
import useI18n from 'hooks/useI18n'
import { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import React from 'react'
import { usePriceTVL } from 'state/hooks'
import styled from 'styled-components'
import { Card, Heading, Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import space from 'uikit-dev/images/for-ui-v2/space.png'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import CardValue from './CardValue'

const Total = styled.div`
  background: ${({ theme }) => theme.colors.backgroundBlueGradient};
  color: ${({ theme }) => theme.colors.white};
  padding: 32px 24px;

  h2,
  p {
    color: inherit;
    text-align: center;
  }
`

const Stat = styled.div`
  padding: 32px 24px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  &:last-child {
    margin: 0;
  }
`

const CardTVL = ({ className = '' }) => {
  const totalTVL = usePriceTVL().toNumber()
  const TranslateString = useI18n()
  const data = useGetStats()
  const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getFinixAddress()))
  const finixSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  return (
    <Card className={className}>
      <Total>
        <Text color="inherit" className="mb-2" textAlign="center">
          {TranslateString(762, 'Total Value Locked (TVL)')}
        </Text>
        <Heading fontSize="32px !important">
          ${(totalTVL || 0) <= 0 ? 'N/A' : totalTVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </Heading>
      </Total>

      <Stat>
        <Row>
          <div className="flex align-center">
            <Text color="textSubtle">{TranslateString(536, 'Total FINIX Supply')}</Text>
            <Helper text="Does not include burned" className="ml-2" position="top" />
          </div>
          {finixSupply && <CardValue fontSize="16px" color="primary" fontWeight="bold" value={finixSupply} />}
        </Row>
        <Row>
          <Text color="textSubtle">{TranslateString(538, 'Total FINIX Burned')}</Text>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} value={burnedBalance} />
        </Row>
        <Row>
          <Text color="textSubtle">{TranslateString(540, 'New FINIX / sec')}</Text>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} value={3} />
        </Row>
      </Stat>
    </Card>
  )
}

export default CardTVL
