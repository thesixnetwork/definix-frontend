import React from 'react'
import styled, { css } from 'styled-components'
import { Card, CardBody, Text, textStyle, ColorStyles, Flex, HomeProtectionFinixIcon, Grid } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'

const AuditList = [
  {
    src: '/images/audit/logo_protection_certik.png',
    srcSet: '/images/audit/logo_protection_certik@2x.png 2x, /images/audit/logo_protection_certik@3x.png 3x',
    description: 'Fundamental Protection and Assessment',
    result: 'Verified',
    color: ColorStyles.BLACK,
  },
  {
    src: '/images/audit/logo_protection_techrate.png',
    srcSet: '/images/audit/logo_protection_techrate@2x.png 2x, /images/audit/logo_protection_techrate@3x.png 3x',
    description: 'Smart Contract Security Audit',
    result: 'All Pass',
    color: ColorStyles.GREEN,
  },
]

const StyledCardBody = styled(CardBody)`
  padding: 40px 0;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px 0;
  }
`

const Title = styled(Text)`
  ${css(textStyle.R_26B)}
  padding: 0 40px;
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${css(textStyle.R_20B)}
    padding: 0 20px;
  }
`

const WrapAudit = styled(Flex)`
  margin-top: 40px;
  justify-content: space-between;
  padding-left: 40px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    margin-top: 28px;
    padding-left: 20px;
    padding-right: 20px;
  }
`

const WrapAuditItemImg = styled.div`
  grid-area: image;
  object-fit: contain;
  height: 20px;
`

const WrapAuditItemInfo = styled(Flex)`
  grid-area: info;
  flex-direction: column;
`

const AuditItem = styled(Grid)`
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    'image image'
    'info info'
    'info info';

  :nth-child(2) {
    padding-left: 30px;
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    grid-template-areas:
      'image char'
      'info char'
      'info char';
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: 'image info info';

    :nth-child(1) {
      margin-bottom: 16px;
    }

    :nth-child(2) {
      padding-top: 20px;
      padding-left: 0;
      border-top: 1px solid ${({ theme }) => theme.colors.border};
      border-left: none;
      grid-template-areas: 'image info char';
    }
  }
`

const AuditItemImg = styled.img``

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

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 8px;
    ${css(textStyle.R_23B)}
  }
`

const Character = styled(Flex)`
  grid-area: char;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: -30px;
    margin-right: -20px;
  }
`

const CardAudit = () => {
  const { t } = useTranslation()
  return (
    <Card>
      <StyledCardBody>
        <Title>{t('Reliability of Definix is proved through external audits.')}</Title>
        <WrapAudit>
          <AuditItem>
            <WrapAuditItemImg>
              <AuditItemImg src={AuditList[0].src} srcSet={AuditList[0].srcSet} alt={t(AuditList[0].description)} />
            </WrapAuditItemImg>
            <WrapAuditItemInfo>
              <AuditItemDesc>{t(AuditList[0].description)}</AuditItemDesc>
              <AuditItemResult color={AuditList[0].color}>{t(AuditList[0].result)}</AuditItemResult>
            </WrapAuditItemInfo>
          </AuditItem>
          <AuditItem>
            <WrapAuditItemImg>
              <AuditItemImg src={AuditList[1].src} srcSet={AuditList[1].srcSet} alt={t(AuditList[1].description)} />
            </WrapAuditItemImg>
            <WrapAuditItemInfo>
              <AuditItemDesc>{t(AuditList[1].description)}</AuditItemDesc>
              <AuditItemResult color={AuditList[1].color}>{t(AuditList[1].result)}</AuditItemResult>
            </WrapAuditItemInfo>
            <Character>
              <HomeProtectionFinixIcon />
            </Character>
          </AuditItem>
        </WrapAudit>
      </StyledCardBody>
    </Card>
  )
}

export default CardAudit
