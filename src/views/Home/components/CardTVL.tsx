import { useGetStats } from 'hooks/api'
import { useTranslation } from 'contexts/Localization'
import { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import React from 'react'
import { usePriceTVL } from 'state/hooks'
import styled from 'styled-components'
import { Card, Heading, Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import bscWhite from 'uikit-dev/images/bsc-white.png'
import klaytnWhite from 'uikit-dev/images/klaytn-white.png'
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
  const { t } = useTranslation()
  const data = useGetStats()
  const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getFinixAddress()))
  const finixSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  return (
    <Card className={className}>
      <Total>
        <Text color="inherit" className="mb-2" textAlign="center">
          {t('Total Value Locked (TVL)')}
        </Text>
        <Heading fontSize="32px !important">
          ${(totalTVL || 0) <= 0 ? 'N/A' : totalTVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </Heading>

        <div className="flex mt-3">
          <div className="col-6 flex flex-column align-center">
            <div className="flex align-center justify-center mb-2">
              <Text color="white" fontSize="12px">
                TVL in BSC
              </Text>
              <img src={bscWhite} alt="" style={{ height: '24px', width: 'auto', marginLeft: '8px' }} />
            </div>
            <CardValue fontSize="16px" color="white" fontWeight="bold" decimals={0} value={25000000} />
          </div>
          <div className="col-6 flex flex-column align-center">
            <div className="flex align-center justify-center mb-2">
              <Text color="white" fontSize="12px">
                TVL in Klaytn
              </Text>
              <img src={klaytnWhite} alt="" style={{ height: '24px', width: 'auto', marginLeft: '8px' }} />
            </div>
            <CardValue fontSize="16px" color="white" fontWeight="bold" decimals={0} value={25000000} />
          </div>
        </div>
      </Total>

      <Stat>
        <Row>
          <div className="flex align-center">
            <Text color="textSubtle">{t('Total FINIX Supply')}</Text>
            <Helper text="Does not include burned" className="ml-2" position="top" />
          </div>
          {finixSupply && <CardValue fontSize="16px" color="primary" fontWeight="bold" value={finixSupply} />}
        </Row>
        <Row>
          <Text color="textSubtle">{t('Total FINIX Burned')}</Text>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} value={burnedBalance} />
        </Row>
        <Row>
          <Text color="textSubtle">{t('New FINIX / sec')}</Text>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} value={3} />
        </Row>
      </Stat>
    </Card>
  )
}

export default CardTVL
