import { useGetStats } from 'hooks/api'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import useI18n from 'hooks/useI18n'
import { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import React, { useEffect } from 'react'
import { usePriceTVL, usePriceCaverTVL } from 'state/hooks'
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
  const { fastRefresh } = useRefresh()
  const totalTVL = usePriceTVL().toNumber()
  const totalCaverTVL = usePriceCaverTVL().toNumber()
  const TranslateString = useI18n()
  const data = useGetStats()
  const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getFinixAddress()))
  const finixSupply = getBalanceNumber(totalSupply)

  useEffect(() => {
    fetchTVL()
  }, [fastRefresh])

  return (
    <Card className={className}>
      <Total>
        <Text color="inherit" className="mb-2" textAlign="center">
          {TranslateString(762, 'Total Value Locked (TVL)')}
        </Text>
        <Heading fontSize="32px !important">
          $
          {(totalTVL || 0) + (totalCaverTVL || 0) <= 0
            ? 'N/A'
            : ((totalTVL || 0) + (totalCaverTVL || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </Heading>

        <div className="flex mt-3">
          <div className="col-6 flex flex-column align-center">
            <div className="flex align-center justify-center mb-2">
              <Text color="white" fontSize="12px">
                TVL in BSC
              </Text>
              <img src={bscWhite} alt="" style={{ height: '24px', width: 'auto', marginLeft: '8px' }} />
            </div>
            <CardValue fontSize="16px" color="white" fontWeight="bold" decimals={0} value={totalTVL} />
          </div>
          <div className="col-6 flex flex-column align-center">
            <div className="flex align-center justify-center mb-2">
              <Text color="white" fontSize="12px">
                TVL in Klaytn
              </Text>
              <img src={klaytnWhite} alt="" style={{ height: '24px', width: 'auto', marginLeft: '8px' }} />
            </div>
            <CardValue fontSize="16px" color="white" fontWeight="bold" decimals={0} value={totalCaverTVL} />
          </div>
        </div>
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
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} valueString="1" />
        </Row>
      </Stat>
    </Card>
  )
}

export default CardTVL
