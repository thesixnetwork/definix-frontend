import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { ChevronRightIcon, Link, Text } from 'uikit-dev'

export interface ExpandableSectionProps {
  klaytnAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  addLiquidityUrl?: string
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
  klaytnAddress,
  removed,
  totalValueFormated,
  isHorizontal = false,
  className = '',
  // lpLabel,
  // addLiquidityUrl,
}) => {
  const TranslateString = useI18n()

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={klaytnAddress}
      bold={false}
      className={`flex-shrink ${linkClassName}`}
      color="textSubtle"
      fontSize="12px"
    >
      {TranslateString(356, 'View on KlaytnScope')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      {!removed && (
        <div className="flex align-baseline flex-wrap justify-space-between">
          <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}</Text>

          <Text bold className="flex-shrink">
            {totalValueFormated}
          </Text>
        </div>
      )}

      <div className="flex justify-end mt-1" style={{ marginRight: '-6px' }}>
        <LinkView />
      </div>
    </Wrapper>
  )
}

export default DetailsSection
