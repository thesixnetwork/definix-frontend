import React from 'react'
import styled, { css } from 'styled-components'
import { Card, CardBody, Text, textStyle, ColorStyles, Flex, HomeProtectionFinixIcon } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'

const AuditList = [{
  img: '/images/audit/logo_protection_certik.png',
  description: 'Fundamental Protection and Assessment',
  result: 'Verified',
  color: ColorStyles.BLACK,
}, {
  img: '/images/audit/logo_protection_techrate.png',
  description: 'Smart Contract Security Audit',
  result: 'All Pass',
  color: ColorStyles.GREEN,
}]

const Title = styled(Text)`
  ${css(textStyle.R_26B)}
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};
`

const StyledFlex = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;

  :first-child {
    width: 45%;
  }

  :nth-child(2) {
    padding-left: 30px;
    border-left: 1px solid ${({ theme }) => theme.colors[ColorStyles.LIGHTGREY]};
  }
`

const StyledImg = styled.img`
  object-fit: contain;
  height: 20px;
`

const Character = styled(Flex)`
`

const CardAudit = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardBody p="S_40">
        <Title>{t("Reliability of Definix is proved through external audits.")}</Title>
        <Flex mt="S_40">
          {AuditList.map(({ img, description, result, color }) => <StyledFlex>
            <StyledImg src={img} alt={t(description)} />
            <Text mt="S_16" textStyle="R_14R" minHeight="40px" color={ColorStyles.DEEPGREY}>{t(description)}</Text>
            <Text mt="S_6" textStyle="R_28B" minHeight="40px" color={color}>{t(result)}</Text>
          </StyledFlex>)}
          <Character mr="-40px">
            <HomeProtectionFinixIcon />
          </Character>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default CardAudit
