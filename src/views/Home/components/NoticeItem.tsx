import React from 'react'
import styled from 'styled-components';
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2';
import { NoticeProps } from './Notice';

const Wrap = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  min-height: 122px;
`
const Title = styled(Text)`
  ${({ theme }) => theme.textStyle.R_20B}
  color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16B}
  }
`

const Content = styled(Text)`
  margin-top: 8px;
  ${({ theme }) => theme.textStyle.R_14R}
  height: 40px;
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R}
  }
`

const Link = styled.a`
  margin-top: 20px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.yellow};
  padding: 4px 14px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 16px;
  }
`

const LinkLabel = styled(Text)`
  ${({ theme }) => theme.textStyle.R_12M}
  color: ${({ theme }) => theme.colors.white};
`


const NoticeItem: React.FC<NoticeProps> = ({ title, content, link, linkLabel }) => {
  return <Wrap>
    <Title>{title}</Title>
    <Content>{content}</Content>
    {link && <Link href={link}>
      <LinkLabel>{linkLabel}</LinkLabel>
    </Link>}
  </Wrap>
}

export default NoticeItem;