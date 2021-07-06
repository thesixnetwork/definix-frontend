import { useTranslation } from 'contexts/Localization'
import React from 'react'
import styled from 'styled-components'
import { ChevronRightIcon, Link, Text } from 'uikit-dev'

export interface ExpandableSectionProps {
  bscScanAddress?: string
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
  bscScanAddress,
  removed,
  totalValueFormated,
  isHorizontal = false,
  className = '',
  // lpLabel,
  // addLiquidityUrl,
}) => {
  const { t } = useTranslation()

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={bscScanAddress}
      bold={false}
      className={`flex-shrink ${linkClassName}`}
      color="textSubtle"
      fontSize="12px"
    >
      {t('View on BscScan')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      {!removed && (
        <div className="flex align-baseline flex-wrap justify-space-between">
          <Text color="textSubtle">{t('Total Liquidity')}</Text>

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
