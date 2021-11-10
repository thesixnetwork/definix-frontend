import React from 'react'
import styled, { css } from 'styled-components'
import { Card, CardBody, Text, textStyle, ColorStyles, Flex, HomeProtectionFinixIcon } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'

const AuditList = [
  {
    img: '/images/audit/logo_protection_certik.png',
    description: 'Fundamental Protection and Assessment',
    result: 'Verified',
    color: ColorStyles.BLACK,
  },
  {
    img: '/images/audit/logo_protection_techrate.png',
    description: 'Smart Contract Security Audit',
    result: 'All Pass',
    color: ColorStyles.GREEN,
  },
]

const StyledCardBody = styled(CardBody)`
  padding: 40px 0;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px;
  }
`

const Title = styled(Text)`
  ${css(textStyle.R_26B)}
  padding: 0 40px;
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${css(textStyle.R_20B)}
    padding: 0;
  }
`

const WrapAudit = styled(Flex)`
  margin-top: 40px;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    margin-top: 28px;
  }
`

const AuditItem = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;

  :first-child {
    width: 45%;
    padding-left: 40px;
  }

  :nth-child(2) {
    padding-left: 30px;
    border-left: 1px solid ${({ theme }) => theme.colors[ColorStyles.LIGHTGREY]};
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: row;
    align-items: flex-start;

    :first-child {
      width: 100%;
      padding-left: 0;
    }

    :nth-child(2) {
      padding-left: 0;
      border-left: none;
    }
  }
`

const WrapAuditItemInfo = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex: 2;
  }
`

const AuditItemImg = styled.img`
  object-fit: contain;
  height: 20px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex: 1;
  }
`

const AuditItemDesc = styled(Text)`
  ${css(textStyle.R_14R)}
  min-height: 40px;
  margin-top: 16px;
  color: ${({ theme }) => theme.colors[ColorStyles.DEEPGREY]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 0;
  }
`

const AuditItemResult = styled(Text)`
  ${css(textStyle.R_28B)}
  min-height: 40px;
  margin-top: 6px;
`

const Character = styled(Flex)``

const CardAudit = () => {
  const { t } = useTranslation()
  return (
    <Card>
      <StyledCardBody>
        <Title>{t('Reliability of Definix is proved through external audits.')}</Title>
        <WrapAudit>
          <AuditItem>
            <AuditItemImg src={AuditList[0].img} alt={t(AuditList[0].description)} />
            <WrapAuditItemInfo>
              <AuditItemDesc>{t(AuditList[0].description)}</AuditItemDesc>
              <AuditItemResult color={AuditList[0].color}>{t(AuditList[0].result)}</AuditItemResult>
            </WrapAuditItemInfo>
          </AuditItem>
          <AuditItem>
            <AuditItemImg src={AuditList[1].img} alt={t(AuditList[1].description)} />
            <WrapAuditItemInfo>
              <AuditItemDesc>{t(AuditList[1].description)}</AuditItemDesc>
              <AuditItemResult color={AuditList[1].color}>{t(AuditList[1].result)}</AuditItemResult>
            </WrapAuditItemInfo>
          </AuditItem>
          <Character>
            <HomeProtectionFinixIcon />
          </Character>
        </WrapAudit>
      </StyledCardBody>
    </Card>
  )
}

export default CardAudit
