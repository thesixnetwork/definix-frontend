import useI18n from 'hooks/useI18n'
import { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import stats from '../../../assets/images/stats.png'
import CardValue from './CardValue'

const StyledFinixStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  background: url(${stats});
  background-size: contain;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.white};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 120px;
  }
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 16px;

  &:last-child {
    margin: 0;
  }
`

const FinixStats = () => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getFinixAddress()))
  const finixSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  return (
    <StyledFinixStats isRainbow>
      <CardBody className="pa-6">
        <Heading mb="20px">FINIX Stats</Heading>
        <Row>
          <Row className="mb-0">
            <Text small>{TranslateString(536, 'Total FINIX Supply')}</Text>
            <Helper text="Does not include burned" className="ml-2" />
          </Row>
          {finixSupply && <CardValue fontSize="18px" fontWeight="bold" value={finixSupply} />}
        </Row>
        <Row>
          <Text small>{TranslateString(538, 'Total FINIX Burned')}</Text>
          <CardValue fontSize="18px" fontWeight="bold" decimals={0} value={burnedBalance} />
        </Row>
        <Row>
          <Text small>{TranslateString(540, 'New FINIX/block')}</Text>
          <CardValue fontSize="18px" fontWeight="bold" decimals={0} value={3} />
        </Row>
      </CardBody>
    </StyledFinixStats>
  )
}

export default FinixStats
