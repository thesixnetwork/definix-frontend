import React from 'react'
import { Card, Flex } from 'definixswap-uikit'
import styled from 'styled-components'

import FinixEarn from './FinixEarn'
import MyBalance from './MyBalance'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.deepbrown};
  border-radius: 16px;
`

const CardTotalEarn: React.FC<IsMobileType> = ({ isMobile }) => {
  return (
    <>
      <Card mt="S_16">
        <FlexCard>
          <FinixEarn isMobile={isMobile} />
          <MyBalance isMobile={isMobile} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardTotalEarn
