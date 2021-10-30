import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { Text, Heading } from 'uikit-dev'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFinixAddress, getWklayAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceFinixKusdt } from 'state/hooks'

export interface ExpandableSectionProps {
  isHorizontal?: boolean
  className?: string
  removed?: boolean
  totalLiquidityUSD?: string
}

const Wrapper = styled.div<{ isHorizontal?: boolean }>`
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  removed,
  totalLiquidityUSD,
  isHorizontal = false,
  className = '',
}) => {
  const TranslateString = useI18n()
  // const finixBalance = useTokenBalance(getFinixAddress())
  // const klayBalance = useTokenBalance(getWklayAddress())
  // console.log('finix balance: ', finixBalance, new BigNumber(getBalanceNumber(finixBalance)).multipliedBy(usePriceFinixKusdt()).toNumber());
  // console.log('klay balance: ', klayBalance);

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      {!removed && (
        <>
          <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}</Text>
          <Heading fontSize="20px !important" textAlign="left" color="text" className="col-6 pr-3">
            {totalLiquidityUSD}
          </Heading>
        </>
      )}
    </Wrapper>
  )
}

export default DetailsSection
