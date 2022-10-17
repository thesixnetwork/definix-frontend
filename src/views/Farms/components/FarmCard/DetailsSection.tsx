import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { Link, ChevronRightIcon, Text } from 'uikit-dev'
import Flex from 'uikitV2/components/Box/Flex'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  addLiquidityUrl?: string
  customText?: string
  isHorizontal?: boolean
  className?: string
  stakedBalanceValueFormated?: string
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
  stakedBalanceValueFormated,
  customText,
}) => {
  const TranslateString = useI18n()

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={bscScanAddress}
      bold={false}
      className={`flex-shrink ${linkClassName} ml-2`}
      color="textSubtle"
      fontSize="12px"
    >
      {TranslateString(356, 'BscScan')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      {(!removed || customText) && (
        <>
          <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
            <Text fontSize="0.75rem" color="textSubtle">
              {customText ? customText : 'Total Liquidity'}
            </Text>
            <div className="flex" style={{ alignItems: 'baseline', paddingTop: 6 }}>
              <Text bold className="flex-shrink" fontSize="1rem">
                {totalValueFormated}
              </Text>
            </div>
          </Flex>
        </>
      )}
    </Wrapper>
  )
}

export default DetailsSection
