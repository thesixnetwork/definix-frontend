import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { Flex, Link, LinkExternal, OpenNewIcon, Text } from 'uikit-dev'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 60%;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  addLiquidityUrl,
}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Flex justifyContent="space-between" flexWrap="wrap" className="flex mb-2">
        <Text>{TranslateString(316, 'Deposit')}:</Text>
        <StyledLinkExternal className="flex-shrink" href={addLiquidityUrl}>
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
      {!removed && (
        <Flex justifyContent="space-between" flexWrap="wrap" className="flex mb-2">
          <Text>{TranslateString(23, 'Total Liquidity')}:</Text>
          <Text className="flex-shrink">{totalValueFormated}</Text>
        </Flex>
      )}
      <Flex justifyContent="flex-start" className="flex">
        <Link external href={bscScanAddress} bold={false} className="flex-shrink" style={{ width: '100%' }}>
          {TranslateString(356, 'View on BscScan')}
          <OpenNewIcon color="primary" className="ml-2" />
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
