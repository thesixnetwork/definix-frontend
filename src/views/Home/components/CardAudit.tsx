import React from 'react'
import styled from 'styled-components'
import {
  CardBody,
  Text,
  Flex,
  Grid,
  ImgHomeProtectionFinix1x,
  ImgHomeProtectionFinix2x,
  ImgHomeProtectionFinix3x,
  ImageSet,
} from '@fingerlabs/definixswap-uikit-v2'
import Card from 'uikitV2/components/Card'

const AuditList = [
  {
    src: '/images/audit/logo_protection_certik.png',
    srcSet: '/images/audit/logo_protection_certik@2x.png 2x, /images/audit/logo_protection_certik@3x.png 3x',
    description: 'Fundamental Protection and Assessment',
    result: 'Verified',
    color: '#222',
  },
  {
    src: '/images/audit/logo_protection_techrate.png',
    srcSet: '/images/audit/logo_protection_techrate@2x.png 2x, /images/audit/logo_protection_techrate@3x.png 3x',
    description: 'Smart Contract Security Audit',
    result: 'All Pass',
    color: '#02a1a1',
  },
]

const StyledCardBody = styled(CardBody)`
  padding: 40px 0;
  @media screen and (max-width: 1280px) {
    padding: 20px 0;
  }
`

const Title = styled(Text)`
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.38;
  letter-spacing: normal;
  padding: 0 40px;
  color: #222;

  @media screen and (max-width: 1280px) {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    padding: 0 20px;
  }
`

const WrapAudit = styled(Flex)`
  margin-top: 40px;
  justify-content: space-between;
  padding-left: 40px;

  @media screen and (max-width: 1280px) {
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
  flex: 1.5;

  :nth-child(2) {
    flex: 2;
    padding-left: 30px;
    border-left: 1px solid #e0e0e0;
    grid-template-areas:
      'image char'
      'info char'
      'info char';
  }

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: 'image info info';

    :nth-child(1) {
      flex: auto;
      margin-bottom: 16px;
    }

    :nth-child(2) {
      flex: auto;
      padding-top: 20px;
      padding-left: 0;
      border-top: 1px solid #e0e0e0;
      border-left: none;
      grid-template-areas: 'image info char';
    }
  }
`

const AuditItemImg = styled.img``

const AuditItemDesc = styled(Text)`
  font-size: 14px;
  font-weight: nnontmal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  min-height: 40px;
  margin-top: 16px;
  color: #666;

  @media screen and (max-width: 1280px) {
    margin-top: 0;
  }
`

const AuditItemResult = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  min-height: 40px;
  margin-top: 6px;

  @media screen and (max-width: 1280px) {
    margin-top: 8px;
    font-size: 23px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
  }
`

const Character = styled(ImageSet)`
  grid-area: char;
  display: flex;
  justify-self: flex-end;

  > img {
    height: auto;
  }

  @media screen and (max-width: 1280px) {
    margin-top: -30px;
    margin-right: -20px;
  }
`

const CardAudit = () => {
  return (
    <Card>
      <StyledCardBody>
        <Title>Reliability of Definix is proved through external audits.</Title>
        <WrapAudit>
          <AuditItem>
            <WrapAuditItemImg>
              <AuditItemImg src={AuditList[0].src} srcSet={AuditList[0].srcSet} alt={AuditList[0].description} />
            </WrapAuditItemImg>
            <WrapAuditItemInfo>
              <AuditItemDesc>{AuditList[0].description}</AuditItemDesc>
              <AuditItemResult color={AuditList[0].color}>{AuditList[0].result}</AuditItemResult>
            </WrapAuditItemInfo>
          </AuditItem>
          <AuditItem>
            <WrapAuditItemImg>
              <AuditItemImg src={AuditList[1].src} srcSet={AuditList[1].srcSet} alt={AuditList[1].description} />
            </WrapAuditItemImg>
            <WrapAuditItemInfo>
              <AuditItemDesc>{AuditList[1].description}</AuditItemDesc>
              <AuditItemResult color={AuditList[1].color}>{AuditList[1].result}</AuditItemResult>
            </WrapAuditItemInfo>
            <Character
              srcSet={[ImgHomeProtectionFinix1x, ImgHomeProtectionFinix2x, ImgHomeProtectionFinix3x]}
              alt=""
              width={112}
              height={154}
            />
          </AuditItem>
        </WrapAudit>
      </StyledCardBody>
    </Card>
  )
}

export default CardAudit
