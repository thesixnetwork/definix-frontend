import React from 'react'
import styled from 'styled-components';
import { Flex, Text, ColorStyles, Card } from 'definixswap-uikit';

const EmptyArea = styled(Flex)`
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
  height: 340px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    height: 260px;
  }
`

const NoResultArea: React.FC<{
  useCardLayout?: boolean
  message: string
}> = ({ useCardLayout = true, message }) => {

  const Content = () => (
    <EmptyArea>
      <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
        {message}
      </Text>
    </EmptyArea>
  )

  return useCardLayout ? (
    <Card mt="S_16">
      <Content/>
    </Card>
  ) : (
    <Content/>
  )
}

export default NoResultArea