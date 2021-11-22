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

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    margin-top: 28px;
  }
`

const WrapAuditItemImg = styled.div`
  object-fit: contain;
  height: 20px;
`

const WrapAuditItemInfo = styled(Flex)`
  flex-direction: column;
`

const AuditItem = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  :first-child {
    flex: 1;
    padding-left: 40px;
  }

  :nth-child(2) {
    flex-direction: row;
    padding-left: 30px;
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: row;
    align-items: flex-start;

    :first-child {
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 16px;

      ${WrapAuditItemImg} {
        flex: 1.2;
      }
      ${WrapAuditItemInfo} {
        flex: 2;
      }
    }

    :nth-child(2) {
      border-top: 1px solid ${({ theme }) => theme.colors.border};
      flex: 1;
      margin: 0 20px;
      padding-left: 0;
      padding-top: 20px;
      border-left: none;
      justify-content: space-between;

      ${WrapAuditItemImg} {
        flex: 2;
      }
      ${WrapAuditItemInfo} {
        flex: 2;
      }
    }
  }
`

const WrapAuditItem = styled(Flex)`
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    position: relative;
    flex-direction: row;
    width: 100%;
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
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-right: -20px;
    margin-top: -40px;
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
              <AuditItemImg src={AuditList[0].img} alt={t(AuditList[0].description)} />
            </WrapAuditItemImg>
            <WrapAuditItemInfo>
              <AuditItemDesc>{t(AuditList[0].description)}</AuditItemDesc>
              <AuditItemResult color={AuditList[0].color}>{t(AuditList[0].result)}</AuditItemResult>
            </WrapAuditItemInfo>
          </AuditItem>
          <AuditItem>
            <WrapAuditItem>
              <WrapAuditItemImg>
                <AuditItemImg src={AuditList[1].img} alt={t(AuditList[1].description)} />
              </WrapAuditItemImg>
              <WrapAuditItemInfo>
                <AuditItemDesc>{t(AuditList[1].description)}</AuditItemDesc>
                <AuditItemResult color={AuditList[1].color}>{t(AuditList[1].result)}</AuditItemResult>
              </WrapAuditItemInfo>
            </WrapAuditItem>
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
