import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import useI18n from 'hooks/useI18n'
import { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import React, { useEffect, useMemo } from 'react'
import { usePriceTVL, usePriceCaverTVL } from 'state/hooks'
import styled from 'styled-components'
import { CardBody, Text, Flex, Coin } from '@fingerlabs/definixswap-uikit-v2'
import { Heading, useMatchBreakpoints } from 'uikit-dev'
import Card from 'uikitV2/components/Card'
import Helper from 'uikit-dev/components/Helper'
import bscWhite from 'uikit-dev/images/bsc-white.png'
import klaytnWhite from 'uikit-dev/images/klaytn-white.png'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import CurrencyText from 'components/Text/CurrencyText'
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

const Title = styled(Text)`
  margin-top: 0;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  color: #999;
  @media screen and (max-width: 1280px) {
    margin-top: 0;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
  }
`

const TotalTvlValue = styled(Text)`
  color: #222;
  margin-top: 0;
  font-size: 32px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  margin-top: 8px;
  @media screen and (max-width: 1280px) {
    margin-top: 0;
    font-size: 26px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: normal;
    margin-top: 6px;
  }
`

const WrapTvl = styled(Flex)`
  margin-top: 40px;
  @media screen and (max-width: 1280px) {
    margin-top: 30px;
    flex-direction: column;
  }
`

const TvlItem = styled(Flex)`
  flex-direction: column;
  width: 50%;
  :last-child {
    border-left: 1px solid #e0e0e0;
    padding-left: 40px;
  }
  @media screen and (max-width: 1280px) {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    :last-child {
      margin-bottom: 0;
      padding-left: 0;
      border-left: none;
    }
  }
`

const TvlValue = styled(Text)`
  margin-top: 8px;
  font-size: 23px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  @media screen and (max-width: 1280px) {
    margin-top: 0;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
  }
`

const WrapCardBody = styled(CardBody)`
  padding: 40px;
  @media screen and (max-width: 1280px) {
    margin-top: 0;
    padding: 24px;
  }
`

const CardTVL = ({ className = '' }) => {
  const TranslateString = useI18n()
  // const data = useGetStats()
  // const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getFinixAddress()))
  const finixSupply = getBalanceNumber(totalSupply)

  const { isXxl } = useMatchBreakpoints()
  const { fastRefresh } = useRefresh()
  const totalTVL = usePriceTVL().toNumber()
  // const totalWeb3TVL = usePriceWeb3TVL().toNumber()
  const totalCaverTVL = usePriceCaverTVL().toNumber()
  const total = useMemo(() => (totalTVL || 0) + (totalCaverTVL || 0), [totalTVL, totalCaverTVL])

  useEffect(() => {
    fetchTVL()
  }, [fastRefresh])

  return (
    <Card>
      <WrapCardBody>
        <Title>Total Value Locked (TVL)</Title>
        <TotalTvlValue>{total <= 0 ? 'N/A' : <CurrencyText value={total} toFixed={0} />}</TotalTvlValue>
        <WrapTvl>
          <TvlItem>
            <Flex alignItems="center">
              <Coin symbol="oBNB" size={isXxl ? '24px' : '22px'} />
              <Text
                marginLeft="8px"
                style={{
                  fontSize: '14px',
                  fontWeight: 'normal',
                  fontStretch: 'normal',
                  fontStyle: 'normal',
                  lineHeight: 1.43,
                  letterSpacing: 'normal',
                  color: '#999',
                }}
              >
                TVL in <strong>BSC</strong>
              </Text>
            </Flex>
            <TvlValue>
              <CurrencyText value={totalTVL} toFixed={0} />
            </TvlValue>
          </TvlItem>
          <TvlItem>
            <Flex alignItems="center">
              <Coin symbol="KLAY" size={isXxl ? '24px' : '22px'} />
              <Text
                marginLeft="8px"
                style={{
                  fontSize: '14px',
                  fontWeight: 'normal',
                  fontStretch: 'normal',
                  fontStyle: 'normal',
                  lineHeight: 1.43,
                  letterSpacing: 'normal',
                  color: '#999',
                }}
              >
                TVL in <strong>Klaytn</strong>
              </Text>
            </Flex>
            <TvlValue>
              <CurrencyText value={totalCaverTVL} toFixed={0} />
            </TvlValue>
          </TvlItem>
        </WrapTvl>
      </WrapCardBody>
    </Card>
  )

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
          <Text color="textSubtle">{TranslateString(538, 'Total FINIX Burned on BSC')}</Text>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} value={burnedBalance} />
        </Row>
        {/* <Row>
          <div className="flex align-center">
            <Dot />
            <Text color="textSubtle" fontSize="12px">
              Actual Burn
            </Text>
          </div>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} value={actualBurn} />
        </Row>
        <Row>
          <div className="flex align-center">
            <Dot />
            <Text color="textSubtle" fontSize="12px">
              FINIX transferred to Klaytn
            </Text>
          </div>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} value={transfer} />
        </Row> */}
        <Row>
          <Text color="textSubtle">{TranslateString(540, 'New FINIX / sec')}</Text>
          <CardValue fontSize="16px" color="primary" fontWeight="bold" decimals={0} valueString="1" />
        </Row>
      </Stat>
    </Card>
  )
}

export default CardTVL
