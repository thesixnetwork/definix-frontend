import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import { useBurnedBalance, useTotalSupply, useTotalTransfer } from 'hooks/useTokenBalance'
import { usePriceFinixUsd } from 'state/hooks'
import styled, { css } from 'styled-components'
import { Card, CardBody, ColorStyles, Text, textStyle, Flex, Button, TokenFinixIcon, useMatchBreakpoints } from 'definixswap-uikit'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'

const Title = styled(Text)`
  ${css(textStyle.R_18M)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
  margin-left: 14px;
  
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${css(textStyle.R_16M)}
    margin-left: 8px;
  }
`

const FinixValue = styled(Text)`
  margin-top: 8px;
  ${css(textStyle.R_32B)}
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};
  
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 6px;
    ${css(textStyle.R_26B)}
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
  ${css(textStyle.R_14R)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
`

const InfoValue = styled(Text)`
  ${css(textStyle.R_14B)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
`

const InfoTitleBold = styled(Text)`
  ${css(textStyle.R_14M)}
  color: ${({ theme }) => theme.colors[ColorStyles.DEEPGREY]};
`

const InfoValueBold = styled(Text)`
  ${css(textStyle.R_16B)}
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};
`

const WrapButton = styled(Flex)`
  margin-top: 28px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 20px;
    padding-bottom: 20px;
  }
`

const WrapInfo = styled(Flex)`
  flex-direction: column;
  margin-top: 42px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: 22px;
  }
`

const CardFinix = () => {
  const { isXxl } = useMatchBreakpoints();
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
        <Flex>
          <TokenFinixIcon viewBox="0 0 24 24" width={isXxl ? "24" : "20"} />
          <Title>{t('FINIX')}</Title>
        </Flex>
        <FinixValue>
          $ {finixPriceUsd.toFixed(2)}
        </FinixValue>
        <WrapButton>
          <Button xs variant="lightbrown" width="50%" mr="S_6">
            {t('Price Chart')}
          </Button>
          <Button xs variant="line" width="50%" ml="S_6">
            {t('Transactions')}
          </Button>
        </WrapButton>
        <WrapInfo>
          <InfoValues>
            <InfoTitleBold>
              {t('Total FINIX Supply')}
            </InfoTitleBold>
            <InfoValueBold>
              {finixSupply}
            </InfoValueBold>
          </InfoValues>
          <InfoValues mt="S_12">
            <InfoTitle>
              {t('FINIX Generated')}
            </InfoTitle>
            <InfoValue>
              {finixSupply && finixTransfered ? finixSupply - finixTransfered : 0}
            </InfoValue>
          </InfoValues>
          <InfoValues mt="S_4">
            <InfoTitle>
              {t('FINIX Transferred from {{BSC}}', {
                BSC: 'BSC',
              })}
            </InfoTitle>
            <InfoValue>
              {finixTransfered ? finixTransfered - 600000 : 0}
            </InfoValue>
          </InfoValues>
          <InfoValues mt="S_4">
            <InfoTitle>
              {t('FINIX Reserved for Bridge')}
            </InfoTitle>
            <InfoValue>
              {finixTransfered ? 600000 : 0}
            </InfoValue>
          </InfoValues>
          <InfoValues mt="S_16">
            <InfoTitleBold>
              {t('Total FINIX Burned')}
            </InfoTitleBold>
            <InfoValueBold>
              {burnedBalance}
            </InfoValueBold>
          </InfoValues>
          <InfoValues mt="S_12">
            <InfoTitleBold>
              {t('New FINIX / sec')}
            </InfoTitleBold>
            <InfoValueBold>
              1
            </InfoValueBold>
          </InfoValues>
        </WrapInfo>
      </WrapCardBody>
    </Card>
  )
}

export default CardFinix
