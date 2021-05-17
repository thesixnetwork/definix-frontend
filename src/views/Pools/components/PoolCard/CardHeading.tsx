import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Flex, Heading, Image, Skeleton, Text } from 'uikit-dev'
import ApyButton from './ApyButton'
import { CardHeadingProps } from './types'

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;

  > * {
    flex-shrink: 0;

    &:nth-child(01) {
      position: relative;
      z-index: 1;
    }
    &:nth-child(02) {
      margin-left: -8px;
    }
  }
`

const Apr = styled(Text)`
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.successAlpha};
  font-size: 12px;
  border-radius: ${({ theme }) => theme.radii.small};
  display: flex;
  align-items: center;
`

const CardHeading: React.FC<CardHeadingProps> = ({
  tokenName,
  isOldSyrup,
  apy,
  className = '',
  isHorizontal = false,
}) => {
  const TranslateString = useI18n()

  const finixPrice = usePriceFinixUsd()

  const imgSize = isHorizontal ? 48 : 56

  return (
    <Flex className={`pos-relative ${className}`} flexDirection="column" alignItems="center" justifyContent="center">
      <StyledFarmImages>
        <Image src={`/images/coins/${tokenName}.png`} width={imgSize} height={imgSize} />
      </StyledFarmImages>

      <Heading fontSize={isHorizontal ? '20px !important' : '24px !important'} fontWeight="500 !important">
        {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')}
      </Heading>

      <div className="flex align-center justify-center mt-2">
        <Apr color="success" bold>
          {TranslateString(736, 'APR')}
          <div className="ml-1">
            {apy ? `${numeral(apy?.toNumber()).format('0,0.00')}%` : <Skeleton height={24} width={80} />}
          </div>
        </Apr>
        <ApyButton lpLabel={tokenName} finixPrice={finixPrice} apy={apy} />
      </div>
    </Flex>
  )
}

export default CardHeading
