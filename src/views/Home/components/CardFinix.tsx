import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import { useBurnedBalance, useTotalSupply, useTotalTransfer } from 'hooks/useTokenBalance'
import { usePriceFinixUsd } from 'state/hooks'
import styled, { css } from 'styled-components'
import { Card, CardBody, ColorStyles, Text, textStyle, Flex, Button, TokenFinixIcon } from 'definixswap-uikit'
import { getFinixAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'

const Title = styled(Text)`
  ${css(textStyle.R_18M)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
`

const StyledValues = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`


const CardFinix = () => {
  const { t } = useTranslation();
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
      <CardBody p="S_40">
        <Flex>
          <TokenFinixIcon />
          <Title ml="S_14">{t("FINIX")}</Title>
        </Flex>
        <Text mt="S_8" textStyle="R_32B" color="black">
          $ {finixPriceUsd.toFixed(2)}
        </Text>
        <Flex mt="S_28">
          <Button md variant="lightbrown" width="50%" mr="S_6">{t("Price Chart")}</Button>
          <Button md variant="line" width="50%" ml="S_6">{t("Transactions")}</Button>
        </Flex>
        <Flex mt="S_42" flexDirection="column">
          <StyledValues>
            <Text textStyle="R_14M" color="deepgrey">{t("Total FINIX Supply")}</Text>
            <Text textStyle="R_16B" color="black">{finixSupply}</Text>
          </StyledValues>
          <StyledValues mt="S_12">
            <Text textStyle="R_14M" color="mediumgrey">{t("FINIX Generated")}</Text>
            <Text textStyle="R_14B" color="mediumgrey">{finixSupply && finixTransfered ? finixSupply - finixTransfered : 0}</Text>
          </StyledValues>
          <StyledValues mt="S_4">
            <Text textStyle="R_14M" color="mediumgrey">{t("FINIX Transferred from {{BSC}}", {
              BSC: 'BSC'
            })}</Text>
            <Text textStyle="R_14B" color="mediumgrey">{finixTransfered ? finixTransfered - 600000 : 0}</Text>
          </StyledValues>
          <StyledValues mt="S_4">
            <Text textStyle="R_14M" color="mediumgrey">{t("FINIX Reserved for Bridge")}</Text>
            <Text textStyle="R_14B" color="mediumgrey">{finixTransfered ? 600000 : 0}</Text>
          </StyledValues>
          <StyledValues mt="S_16">
            <Text textStyle="R_14M" color="deepgrey">{t("Total FINIX Burned")}</Text>
            <Text textStyle="R_16B" color="black">{burnedBalance}</Text>
          </StyledValues>
          <StyledValues mt="S_12">
            <Text textStyle="R_14M" color="deepgrey">{t("New FINIX / sec")}</Text>
            <Text textStyle="R_16B" color="black">1</Text>
          </StyledValues>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default CardFinix
