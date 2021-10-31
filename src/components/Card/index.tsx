import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'

const Card = styled.div<any>`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius} || ${({ theme }) => theme.radii.default};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
  background-color: ${({ theme }) => theme.colors.invertedContrast};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.backgroundBox};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.colors.binance};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`

export const BorderCard = styled(Card)<{ className?: string }>`
  border: 1px solid ${({ theme }) => theme.colors.border};
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const BlueCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.default};
  width: fit-content;
`

export const BlueCard = ({ children, ...rest }: any) => {
  return (
    <BlueCardStyled {...rest}>
      <Text color="#24c7d6">{children}</Text>
    </BlueCardStyled>
  )
}
