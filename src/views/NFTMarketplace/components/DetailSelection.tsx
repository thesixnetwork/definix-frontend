// import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Image } from '../../../uikit-dev'

export interface ExpandableSectionProps {
  isHorizontal?: boolean
  className?: string
  isMarketplace?: boolean
}

const InfosBox = styled.div<{ isHorizontal?: boolean, isMarketplace?: boolean }>`
  padding: 16px;
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom: ${({ isHorizontal, theme, isMarketplace }) =>
    // eslint-disable-next-line no-nested-ternary
    !isHorizontal && isMarketplace ? `1px solid ${theme.colors.border}`  : 'none'};
`

const PriceUnitBox = styled.div<{ isHorizontal?: boolean }>`
  padding: 10px 16px;
  background: ${({ isHorizontal, theme }) =>
    // eslint-disable-next-line no-nested-ternary
    !isHorizontal && theme.isDark
      ? '#121212'
      : !isHorizontal && theme.isDark
        ? theme.colors.cardFooter
        : 'transparent'};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({ isHorizontal = false, className = '', isMarketplace }) => {
  return (
    <>
      <InfosBox isHorizontal={isHorizontal}>
        <div className="flex align-baseline flex-wrap justify-space-between mb-1">
          <div className="flex flex-wrap justify-end">
            <Heading bold className="flex-shrink">
              #02
            </Heading>
          </div>
        </div>
        <div className="flex align-baseline flex-wrap justify-space-between">
          <div className="flex flex-wrap justify-end">
            <Text bold className="flex-shrink">
              T-ARA LEGENDARY Grade Limited
            </Text>
          </div>
        </div>
        <div className="flex align-baseline flex-wrap justify-space-between">
          <div className="flex flex-wrap justify-end">
            <Text bold className="flex-shrink" color="textSubtle">
              Dingo x SIX Network NFT Project No.1
            </Text>
          </div>
        </div>
      </InfosBox>
      {isMarketplace && (
        <PriceUnitBox>
          <div className="flex justify-space-between py-1">
            <Text fontSize="12px" color="textSubtle">
              Price
    </Text>
            <div className="flex">
              <Image src="/images/coins/FINIX.png" width={16} height={16} />
              <Text fontSize="12px" color="text" paddingLeft="6px">
                2,837.2938 FINIX
     </Text>
            </div>
          </div>
          <div className="flex justify-space-between">
            <Text fontSize="12px" color="textSubtle">
              Until
   </Text>
            <Text fontSize="12px" color="text">
              28/12/21 00:00:00 GMT+7
   </Text>
          </div>
        </PriceUnitBox>
      )}

    </>
  )
}

export default DetailsSection
