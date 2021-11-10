import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Card, CardBody, ColorStyles, Text, textStyle, Flex, HomeFarmFinixIcon } from 'definixswap-uikit'
import FarmHighAPR from './FarmHighAPR'
import ExploreHighAPR from './ExploreHighAPR'

const Title = styled(Text)`
  ${css(textStyle.R_20B)}
  color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};

  ${({ theme }) => theme.mediaQueries.xl} {
    ${css(textStyle.R_26B)}
  }
`

const InnerFlex = styled(Flex)`
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors[ColorStyles.WHITE]};

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 24px;
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 20px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 40px;
  }
`

const StyledRebalanceTitle = styled(Flex)`
  padding-top: 28px;
  padding-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.xl} {
    position: relative;
    padding-top: 40px;
    padding-bottom: 24px;
  }
`

const Character = styled(Flex)``

const CardHighAPR = () => {
  const { t } = useTranslation()
  return (
    <Card bg={ColorStyles.ORANGE}>
      <StyledCardBody>
        <Flex alignItems="flex-end">
          <Title pb="S_24">{t('Stake Farms with high APR')}</Title>
          <Character>
            <HomeFarmFinixIcon />
          </Character>
        </Flex>
        <InnerFlex>
          <FarmHighAPR />
        </InnerFlex>
        <StyledRebalanceTitle>
          <Title>{t('Meet Rebalancing with Definix unique differentiation.')}</Title>
        </StyledRebalanceTitle>
        <InnerFlex>
          <ExploreHighAPR />
        </InnerFlex>
      </StyledCardBody>
    </Card>
  )
}

export default CardHighAPR
