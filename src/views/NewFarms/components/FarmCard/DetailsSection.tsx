import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { Text, Heading } from 'uikit-dev'

export interface ExpandableSectionProps {
  removed?: boolean
  totalValueFormated?: string
  isHorizontal?: boolean
  className?: string
}

const Wrapper = styled.div<{ isHorizontal?: boolean }>`
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  removed,
  totalValueFormated,
  isHorizontal = false,
  className = '',
}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      {!removed && (
        <>
          <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}</Text>
          <Heading
            fontSize="20px !important"
            textAlign="left"
            color="text"
            className="col-6 pr-3"
          >
            {totalValueFormated}
          </Heading>
        </>
      )}
    </Wrapper>
  )
}

export default DetailsSection
