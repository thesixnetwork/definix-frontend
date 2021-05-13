import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { ChevronRightIcon, Flex, Link, Text } from 'uikit-dev'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  padding: 16px;
  background: #fafcff;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-left-radius: ${({ theme }) => theme.radii.card};
  border-bottom-right-radius: ${({ theme }) => theme.radii.card};
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  removed,
  totalValueFormated,
  // lpLabel,
  // addLiquidityUrl,
}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      {/* <Flex justifyContent="space-between" flexWrap="wrap" className="flex mb-2">
        <Text>{TranslateString(316, 'Deposit')}:</Text>
        <StyledLinkExternal className="flex-shrink" href={addLiquidityUrl}>
          {lpLabel}
        </StyledLinkExternal>
      </Flex> */}
      {!removed && (
        <Flex justifyContent="space-between" flexWrap="wrap" className="flex mb-1">
          <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}:</Text>
          <Text bold className="flex-shrink">
            {totalValueFormated}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="flex-end" className="flex">
        <Link external href={bscScanAddress} bold={false} className="flex-shrink" color="textSubtle" fontSize="12px">
          {TranslateString(356, 'View on BscScan')}
          <ChevronRightIcon color="textSubtle" />
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
