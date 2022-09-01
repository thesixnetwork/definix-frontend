import React, { useEffect } from 'react'
import numeral from 'numeral'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import {
  CardBody,
  ColorStyles,
  Text,
  Flex,
  TokenFinixIcon,
  useMatchBreakpoints,
  Divider,
} from '@fingerlabs/definixswap-uikit-v2'
import Card from 'uikitV2/components/Card'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { Button } from '@mui/material'

const Title = styled(Text)`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  color: #999;
  margin-left: 14px;

  @media screen and (max-width: 1280px) {
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    margin-left: 8px;
  }
`

const FinixValue = styled(Text)`
  margin-top: 8px;
  font-size: 32px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.38;
  letter-spacing: normal;
  color: #222;

  @media screen and (max-width: 1280px) {
    margin-top: 6px;
    font-size: 26px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: normal;
  }
`

const WrapCardBody = styled(CardBody)`
  padding: 40px;

  @media screen and (max-width: 1280px) {
    padding: 20px;
  }
`

const InfoValues = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`

const InfoTitle = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #999;
`

const InfoValue = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #999;
`

const InfoTitleBold = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666;
`

const InfoValueBold = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.38;
  letter-spacing: normal;
  color: #222;
`

const WrapButton = styled(Flex)`
  width: 112px;
  flex-direction: column;

  button:first-child {
    margin-bottom: 8px;
  }

  @media screen and (max-width: 1280px) {
    width: 100%;
    flex-direction: row;
    margin-top: 20px;

    button:first-child {
      margin-bottom: 0;
      margin-right: 8px;
    }

    button:last-child {
      margin-left: 8px;
    }
  }
`

const WrapInfo = styled(Flex)`
  flex-direction: column;
  margin-top: 42px;
  @media screen and (max-width: 1280px) {
    margin-top: 0;
    padding-top: 22px;
  }
`

const WrapFinix = styled(Flex)`
  flex-direction: column;
`

const WrapTop = styled(Flex)`
  flex: 1;
  justify-content: space-between;
  padding-bottom: 28px;
  @media screen and (max-width: 1280px) {
    flex-direction: column;
  }
`

const formatText = (num: number) => {
  if (!num) return ''
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const CardFinix = () => {
  const { isXxl } = useMatchBreakpoints()
  const finixPriceUsd = usePriceFinixUsd()
  const { fastRefresh } = useRefresh()
  const totalSupply = useTotalSupply()
  const totalTransferFromBsc = null // useTotalTransfer()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getFinixAddress()))
  const finixSupply = totalSupply && getBalanceNumber(totalSupply)
  const finixTransfered = totalTransferFromBsc ? getBalanceNumber(totalTransferFromBsc) : 0

  useEffect(() => {
    fetchTVL()
  }, [fastRefresh])

  return (
    <Card>
      <WrapCardBody>
        <WrapTop>
          <WrapFinix>
            <Flex>
              <TokenFinixIcon viewBox="0 0 24 24" width={isXxl ? '24' : '20'} />
              <Title>FINIX</Title>
            </Flex>
            <FinixValue>$ {numeral(finixPriceUsd).format('0,0.[0000]')}</FinixValue>
          </WrapFinix>
          <WrapButton>
            <Button
              //   xs
              //   variant="lightbrown"
              //   width="100%"
              variant="contained"
              style={{
                padding: '7px 12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 1.5,
                letterSpacing: 'normal',
                backgroundColor: '#b4a9a8',
                width: '100%',
              }}
              onClick={() => window.open('https://klaytn.loremboard.finance/chart/FINIX', '_blank')}
            >
              Price Chart
            </Button>
            <Button
              variant="outlined"
              style={{
                padding: '7px 12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 1.5,
                letterSpacing: 'normal',
                borderColor: '#666',
                color: '#666',
                width: '100%',
              }}
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_KLAYTN_URL}/account/0xd51c337147c8033a43f3b5ce0023382320c113aa?tabId=txList`,
                  '_blank',
                )
              }
            >
              Contract
            </Button>
          </WrapButton>
        </WrapTop>
        <Divider />
        <WrapInfo>
          <InfoValues>
            <InfoTitleBold>Total FINIX Supply</InfoTitleBold>
            <InfoValueBold>{formatText(finixSupply)}</InfoValueBold>
          </InfoValues>
          <InfoValues marginTop="12px">
            <InfoTitle>FINIX Generated</InfoTitle>
            <InfoValue>{formatText(finixSupply && finixTransfered ? finixSupply - finixTransfered : 0)}</InfoValue>
          </InfoValues>
          <InfoValues marginTop="4px">
            <InfoTitle>FINIX Transferred from BSC</InfoTitle>
            <InfoValue>{formatText(finixTransfered ? finixTransfered - 600000 : 0)}</InfoValue>
          </InfoValues>
          <InfoValues marginTop="4px">
            <InfoTitle>FINIX Reserved for Bridge</InfoTitle>
            <InfoValue>{formatText(finixTransfered ? 600000 : 0)}</InfoValue>
          </InfoValues>
          <InfoValues marginTop="16px">
            <InfoTitleBold>Total FINIX Burne</InfoTitleBold>
            <InfoValueBold>{formatText(burnedBalance)}</InfoValueBold>
          </InfoValues>
          <InfoValues marginTop="12px">
            <InfoTitleBold>New FINIX / sec</InfoTitleBold>
            <InfoValueBold>1</InfoValueBold>
          </InfoValues>
        </WrapInfo>
      </WrapCardBody>
    </Card>
  )
}

export default CardFinix
