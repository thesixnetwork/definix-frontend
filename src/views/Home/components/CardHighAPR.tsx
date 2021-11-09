import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Card, CardBody, ColorStyles, Text, textStyle, Flex, HomeFarmFinixIcon } from 'definixswap-uikit'

const Title = styled(Text)`
  ${css(textStyle.R_26B)}
  color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};
`

const InnerFlex = styled(Flex)`
  padding: 24px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};
`

const Character = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`


const CardHighAPR = () => {
  const { t } = useTranslation();
  return (
    <Card bg={ColorStyles.ORANGE}>
      <CardBody p="S_40">
        <Flex position="relative" pb="S_24">
          <Title>{t("Stake Farms with high APR")}</Title>
          <Character>
            <HomeFarmFinixIcon />
          </Character>
        </Flex>
        <InnerFlex>
          P
        </InnerFlex>
        <Flex position="relative" pt="S_40" pb="S_24">
          <Title>{t("Meet Rebalancing with Definix unique differentiation.")}</Title>
        </Flex>
        <InnerFlex>
          P
        </InnerFlex>
      </CardBody>
    </Card>
  )
}

export default CardHighAPR
