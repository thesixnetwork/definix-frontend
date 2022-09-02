import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Flex, Box, Text, ColorStyles, Coin } from '@fingerlabs/definixswap-uikit-v2'
import { Heading, Image, Skeleton } from 'uikit-dev'
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

const CardHeading: React.FC<CardHeadingProps> = ({ isOldSyrup, apy, className = '', isHorizontal = false, veloId }) => {
  const TranslateString = useI18n()

  const finixPrice = usePriceFinixUsd()

  const imgSize = isHorizontal ? 48 : 56

  return (
    <Flex position="relative">
      <Flex marginRight="16px" alignItems="center" width="auto">
        <ImageBox>
          <Image src="/images/coins/velo.png" width={imgSize} height={imgSize} />{' '}
        </ImageBox>
      </Flex>

      <Flex flexDirection="column" alignItems="center">
        <Heading
          textAlign="center"
          fontSize={isHorizontal ? '20px !important' : '24px !important'}
          fontWeight="500 !important"
        >
          {isOldSyrup && '[OLD]'} VELO {TranslateString(348, 'Pool')} {veloId === 1 ? '(Inactive)' : ''}
        </Heading>
        <div className="flex align-center justify-center">
          <Apr color="success" bold>
            {TranslateString(736, 'APR')}
            <div className="ml-1">
              {apy ? `${numeral(apy?.toNumber()).format('0,0.00')}%` : <Skeleton height={24} width={80} />}
            </div>
          </Apr>
          <ApyButton lpLabel="FINIX" finixPrice={finixPrice} apy={apy} />
        </div>
        <Text style={{ fontSize: '12px' }}>Reward Period 60 Days</Text>
      </Flex>
    </Flex>
  )

  // return (
  //   <Flex className={`pos-relative ${className}`} flexDirection="column" alignItems="center" justifyContent="center">
  //     <StyledFarmImages>
  //       <Image src="/images/coins/velo.png" width={imgSize} height={imgSize} />
  //     </StyledFarmImages>

  //     <Heading fontSize={isHorizontal ? '20px !important' : '24px !important'} fontWeight="500 !important">
  //       {isOldSyrup && '[OLD]'} VELO {TranslateString(348, 'Pool')} {veloId === 1 ? '(Inactive)' : ''}
  //     </Heading>

  //     <div className="flex align-center justify-center mt-2">
  //       <Apr color="success" bold>
  //         {TranslateString(736, 'APR')}
  //         <div className="ml-1">
  //           {apy ? `${numeral(apy?.toNumber()).format('0,0.00')}%` : <Skeleton height={24} width={80} />}
  //         </div>
  //       </Apr>
  //       <ApyButton lpLabel="FINIX" finixPrice={finixPrice} apy={apy} />
  //     </div>
  //     <Text style={{ fontSize: '12px' }}>Reward Period 60 Days</Text>
  //   </Flex>
  // )
}

export default CardHeading

const ImageBox = styled(Box)`
  &:first-child {
    z-index: 1;
  }
  &:last-child {
    margin-left: -10px;
  }
`

const APRCoin = styled(Coin)`
  margin-right: 3px;
`
