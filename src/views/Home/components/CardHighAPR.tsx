import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Card, CardBody, ColorStyles, Text, Flex, HomeFarmFinixIcon } from 'definixswap-uikit'
import FarmHighAPR from './FarmHighAPR'
import ExploreHighAPR from './ExploreHighAPR'

const Title = styled(Text)`
  align-self: center;
  ${({ theme }) => theme.textStyle.R_26B}
  color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_20B}
  }
`

const InnerBox = styled(Flex)`
  padding: 24px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px;
  }
`

const WrapCardBody = styled(CardBody)`
  padding: 40px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px;
  }
`

const StyledRebalanceTitle = styled(Flex)`
  position: relative;
  padding-top: 40px;
  padding-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-top: 28px;
    padding-bottom: 20px;
  }
`

const Character = styled(Flex)``

const CardHighAPR = () => {
  const { t } = useTranslation()
  return (
    <Card bg={ColorStyles.ORANGE}>
      <WrapCardBody>
        <Flex alignItems="flex-end" justifyContent="space-between">
          <Title>{t('Stake Farms with high APR')}</Title>
          <Character>
            <HomeFarmFinixIcon />
          </Character>
        </Flex>
        <InnerBox>
          <FarmHighAPR />
        </InnerBox>
        <StyledRebalanceTitle>
          <Title>{t('Meet Rebalancing with Definix unique differentiation.')}</Title>
        </StyledRebalanceTitle>
        <InnerBox>
          <ExploreHighAPR />
        </InnerBox>
      </WrapCardBody>
    </Card>
  )
}

export default CardHighAPR
