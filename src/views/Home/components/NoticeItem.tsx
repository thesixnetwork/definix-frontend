import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import { NoticeProps } from './Notice'

const Wrap = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  min-height: 100px;
`
const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: #222;

  @media screen and (max-width: 1280px) {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
  }
`

const WrapTitle = styled(Flex)`
  justify-content: flex-start;
  align-items: center;

  > a {
    margin-left: 20px;
  }

  @media screen and (max-width: 960px) {
    > a {
      display: none;
    }
  }
`

const Content = styled(Text)`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 'normal';
  font-stretch: 'normal';
  font-style: 'normal';
  line-height: 1.43;
  letter-spacing: 'normal';
  min-height: 40px;
  color: #666;
  @media screen and (max-width: 1280px) {
    font-size: 12px;
    font-weight: 'normal';
    font-stretch: 'normal';
    font-style: 'normal';
    line-height: 1.5;
    letter-spacing: 'normal';
  }
`

const Link = styled.a`
  border-radius: 14px;
  background-color: #fea948;
  padding: 4px 14px;
`

const LinkLabel = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  font-stretch: 'normal';
  font-style: 'normal';
  line-height: 1.5;
  letter-spacing: 'normal';
  color: #fff;
`

const WrapMobileFooter = styled(Flex)`
  display: none;
  @media screen and (max-width: 960px) {
    margin-top: 16px;
    display: flex;
  }
`

const NoticeItem: React.FC<NoticeProps> = ({ title, content, link, linkLabel }) => {
  return (
    <Wrap>
      <WrapTitle>
        <Title>{title}</Title>
        {link && (
          <Link href={link} target="_blank">
            <LinkLabel>{linkLabel}</LinkLabel>
          </Link>
        )}
      </WrapTitle>
      <Content>{content}</Content>
      <WrapMobileFooter>
        {link && (
          <Link href={link} target="_blank">
            <LinkLabel>{linkLabel}</LinkLabel>
          </Link>
        )}
      </WrapMobileFooter>
    </Wrap>
  )
}

export default NoticeItem
