import React from 'react'
import { Card, Flex } from 'definixswap-uikit-v2'
import { usePrivateData } from 'hooks/useLongTermStake'
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
  const { lockAmount, finixEarn, balancevfinix } = usePrivateData()

  return (
    <>
      <Card mt="S_16">
        <FlexCard>
          <FinixEarn isMobile={isMobile} finixEarn={finixEarn} />
          <MyBalance isMobile={isMobile} lockAmount={lockAmount} balancevfinix={balancevfinix} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardTotalEarn
