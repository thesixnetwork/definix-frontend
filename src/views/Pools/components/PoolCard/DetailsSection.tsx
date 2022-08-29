import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React from 'react'
import styled from 'styled-components'
import { ChevronRightIcon, Flex, Link, Text } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import { DetailsSectionProps } from './types'

const Wrapper = styled.div<{ isHorizontal?: boolean }>`
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<DetailsSectionProps> = ({
  tokenName,
  totalStaked,
  bscScanAddress,
  isHorizontal = false,
  className = '',
}) => {
  const TranslateString = useI18n()

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={bscScanAddress}
      bold={false}
      className={`flex-shrink ${linkClassName}`}
      color="textSubtle"
      fontSize="12px"
    >
      {TranslateString(356, 'View on BscScan')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
        <Text fontSize="0.75rem" color="textSubtle">
          Total staked
        </Text>
        <div className="flex" style={{ alignItems: 'baseline', paddingTop: 6 }}>
          <Text bold className="flex-shrink" fontSize="1.125rem">
            {numeral(getBalanceNumber(totalStaked)).format('0,0')}
          </Text>
          <Text style={{ marginLeft: 4 }} fontSize="0.75rem" fontWeight="500" color="rgb(102, 102, 102)">
            FINIX
          </Text>
        </div>
        <Text fontSize="0.875rem" color="textSubtle" textAlign="left">
          = $ 0{/* {numeral(rawEarningsBalance * finixPrice.toNumber()).format('0,0.0000')} */}
        </Text>
      </Flex>

      {false && (
        <div className="flex justify-end mt-1" style={{ marginRight: '-6px' }}>
          <LinkView />
        </div>
      )}
    </Wrapper>
  )
}

export default DetailsSection
