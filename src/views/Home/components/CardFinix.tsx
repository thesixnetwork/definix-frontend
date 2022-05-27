import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import { useBurnedBalance, useTotalSupply, useTotalTransfer } from 'hooks/useTokenBalance'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  ColorStyles,
  Text,
  Flex,
  Button,
  TokenFinixIcon,
  useMatchBreakpoints,
  Divider,
} from '@fingerlabs/definixswap-uikit-v2'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'

const Title = styled(Text)`
  ${({ theme }) => theme.textStyle.R_18M}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
  margin-left: 14px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M}
    margin-left: 8px;
  }
`

const FinixValue = styled(Text)`
  margin-top: 8px;
  ${({ theme }) => theme.textStyle.R_32B}
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 6px;
    ${({ theme }) => theme.textStyle.R_26B}
  }
`

const WrapCardBody = styled(CardBody)`
  padding: 40px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px;
  }
`

const InfoValues = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`

const InfoTitle = styled(Text)`
  ${({ theme }) => theme.textStyle.R_14R}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
`

const InfoValue = styled(Text)`
  ${({ theme }) => theme.textStyle.R_14B}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
`

const InfoTitleBold = styled(Text)`
  ${({ theme }) => theme.textStyle.R_14M}
  color: ${({ theme }) => theme.colors[ColorStyles.DEEPGREY]};
`

const InfoValueBold = styled(Text)`
  ${({ theme }) => theme.textStyle.R_16B}
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};
`

const WrapButton = styled(Flex)`
  width: 112px;
  flex-direction: column;

  button:first-child {
    margin-bottom: 8px;
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
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
  ${({ theme }) => theme.mediaQueries.mobileXl} {
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
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
  }
`

const formatText = (num: number) => {
  if (!num) return ''
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const CardFinix = () => {
  const { isXxl } = useMatchBreakpoints()
  const { t } = useTranslation()
  const finixPriceUsd = usePriceFinixUsd()
  const { fastRefresh } = useRefresh()
  const totalSupply = useTotalSupply()
  const totalTransferFromBsc = useTotalTransfer()
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
              <Title>{t('FINIX')}</Title>
            </Flex>
            <FinixValue>$ {numeral(finixPriceUsd).format('0,0.[0000]')}</FinixValue>
          </WrapFinix>
          <WrapButton>
            <Button
              xs
              variant="lightbrown"
              width="100%"
              onClick={() => window.open('https://klaytn.loremboard.finance/chart/FINIX', '_blank')}
            >
              {t('Price Chart')}
            </Button>
            <Button
              xs
              variant="line"
              width="100%"
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_KLAYTN_URL}/account/0xd51c337147c8033a43f3b5ce0023382320c113aa?tabId=txList`,
                  '_blank',
                )
              }
            >
              {t('Contract')}
            </Button>
          </WrapButton>
        </WrapTop>
        <Divider />
        <WrapInfo>
          <InfoValues>
            <InfoTitleBold>{t('Total FINIX Supply')}</InfoTitleBold>
            <InfoValueBold>{formatText(finixSupply)}</InfoValueBold>
          </InfoValues>
          <InfoValues mt="S_12">
            <InfoTitle>{t('FINIX Generated')}</InfoTitle>
            <InfoValue>{formatText(finixSupply && finixTransfered ? finixSupply - finixTransfered : 0)}</InfoValue>
          </InfoValues>
          <InfoValues mt="S_4">
            <InfoTitle>
              {t('FINIX Transferred from {{BSC}}', {
                BSC: 'BSC',
              })}
            </InfoTitle>
            <InfoValue>{formatText(finixTransfered ? finixTransfered - 600000 : 0)}</InfoValue>
          </InfoValues>
          <InfoValues mt="S_4">
            <InfoTitle>{t('FINIX Reserved for Bridge')}</InfoTitle>
            <InfoValue>{formatText(finixTransfered ? 600000 : 0)}</InfoValue>
          </InfoValues>
          <InfoValues mt="S_16">
            <InfoTitleBold>{t('Total FINIX Burned')}</InfoTitleBold>
            <InfoValueBold>{formatText(burnedBalance)}</InfoValueBold>
          </InfoValues>
          <InfoValues mt="S_12">
            <InfoTitleBold>{t('New FINIX / sec')}</InfoTitleBold>
            <InfoValueBold>1</InfoValueBold>
          </InfoValues>
        </WrapInfo>
      </WrapCardBody>
    </Card>
  )
}

export default CardFinix
