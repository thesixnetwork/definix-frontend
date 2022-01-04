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
  ${({ theme }) => theme.textStyle.R_20B}
  color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16B}
  }
`

const WrapTitle = styled(Flex)`
  justify-content: flex-start;
  align-items: center;

  > a {
    margin-left: 20px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    > a {
      display: none;
    }
  }

`

const Content = styled(Text)`
  margin-top: 8px;
  ${({ theme }) => theme.textStyle.R_14R}
  min-height: 40px;
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R}
  }
`

const Link = styled.a`
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.yellow};
  padding: 4px 14px;
`

const LinkLabel = styled(Text)`
  ${({ theme }) => theme.textStyle.R_12M}
  color: ${({ theme }) => theme.colors.white};
`

const WrapMobileFooter = styled(Flex)`
  display: none;
  ${({ theme }) => theme.mediaQueries.mobile} {
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
