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
  ${css(textStyle.R_16M)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    ${css(textStyle.R_18M)}
    margin-left: 14px;
  }
`

const FinixValue = styled(Text)`
  margin-top: 6px;
  ${css(textStyle.R_26B)}

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 8px;
    ${css(textStyle.R_32B)}
    color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 20px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 40px;
  }
`

const StyledValues = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`

const ButtonWrap = styled(Flex)`
  margin-top: 20px;
  padding-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 28px;
    padding-bottom: 0;
  }
`

const InfoWrap = styled(Flex)`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-direction: column;
  padding-top: 22px;
  ${({ theme }) => theme.mediaQueries.xl} {
    border-top: none;
    margin-top: 42px;
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
      <StyledCardBody>
        <Flex>
          <TokenFinixIcon viewBox="0 0 24 24" width={isXxl ? "24" : "20"} />
          <Title>{t('FINIX')}</Title>
        </Flex>
        <FinixValue>
          $ {finixPriceUsd.toFixed(2)}
        </FinixValue>
        <ButtonWrap>
          <Button xs variant="lightbrown" width="50%" mr="S_6">
            {t('Price Chart')}
          </Button>
          <Button xs variant="line" width="50%" ml="S_6">
            {t('Transactions')}
          </Button>
        </ButtonWrap>
        <InfoWrap>
          <StyledValues>
            <Text textStyle="R_14M" color="deepgrey">
              {t('Total FINIX Supply')}
            </Text>
            <Text textStyle="R_16B" color="black">
              {finixSupply}
            </Text>
          </StyledValues>
          <StyledValues mt="S_12">
            <Text textStyle="R_14R" color="mediumgrey">
              {t('FINIX Generated')}
            </Text>
            <Text textStyle="R_14B" color="mediumgrey">
              {finixSupply && finixTransfered ? finixSupply - finixTransfered : 0}
            </Text>
          </StyledValues>
          <StyledValues mt="S_4">
            <Text textStyle="R_14R" color="mediumgrey">
              {t('FINIX Transferred from {{BSC}}', {
                BSC: 'BSC',
              })}
            </Text>
            <Text textStyle="R_14B" color="mediumgrey">
              {finixTransfered ? finixTransfered - 600000 : 0}
            </Text>
          </StyledValues>
          <StyledValues mt="S_4">
            <Text textStyle="R_14R" color="mediumgrey">
              {t('FINIX Reserved for Bridge')}
            </Text>
            <Text textStyle="R_14B" color="mediumgrey">
              {finixTransfered ? 600000 : 0}
            </Text>
          </StyledValues>
          <StyledValues mt="S_16">
            <Text textStyle="R_14M" color="deepgrey">
              {t('Total FINIX Burned')}
            </Text>
            <Text textStyle="R_16B" color="black">
              {burnedBalance}
            </Text>
          </StyledValues>
          <StyledValues mt="S_12">
            <Text textStyle="R_14M" color="deepgrey">
              {t('New FINIX / sec')}
            </Text>
            <Text textStyle="R_16B" color="black">
              1
            </Text>
          </StyledValues>
        </InfoWrap>
      </StyledCardBody>
    </Card>
  )
}

export default CardFinix
