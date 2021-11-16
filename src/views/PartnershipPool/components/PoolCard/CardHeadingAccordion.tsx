import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Flex, Heading, Image, Skeleton, Text } from 'uikit-dev'
import ApyButton from './ApyButton'

interface CardHeadingAccordionProps {
  tokenName: string
  isOldSyrup: boolean
  apy: BigNumber
  className?: string
  isOpenAccordion: boolean
  setIsOpenAccordion: (isOpen: boolean) => void
  veloId: number
}

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

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

const CardHeadingStyle = styled(Flex)`
  padding: 16px;

  .currency {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 0;

    .imgs {
      width: auto;
      margin-right: 8px;

      > div {
        width: 24px;
        height: 24px;
        min-width: initial;
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 16px 16px 16px 50px;
  }
`

const CardHeadingAccordion: React.FC<CardHeadingAccordionProps> = ({
  tokenName,
  isOldSyrup,
  apy,
  className = '',
  isOpenAccordion = false,
  setIsOpenAccordion,
  veloId,
}) => {
  const TranslateString = useI18n()

  const finixPrice = usePriceFinixUsd()

  const imgSize = 24

  return (
    <CardHeadingStyle
      className={`${className} ${isOpenAccordion ? 'bd-b' : ''}`}
      flexDirection="column"
      justifyContent="center"
      onClick={() => {
        setIsOpenAccordion(!isOpenAccordion)
      }}
    >
      <div className="flex justify-space-between">
        <div className="currency">
          <StyledFarmImages className="imgs">
            <Image src="/images/coins/velo.png" alt="velo" width={imgSize} height={imgSize} />
          </StyledFarmImages>

          <Heading fontSize="16px" fontWeight="500 !important">
            {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')} {veloId === 1 ? 'V2' : ''}
          </Heading>
        </div>
        {isOpenAccordion ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}
      </div>

      <div className="flex align-center mt-2">
        <Apr color="success" bold>
          {TranslateString(736, 'APR')}
          <div className="ml-1">
            {apy ? `${numeral(apy?.toNumber()).format('0,0.00')}%` : <Skeleton height={24} width={80} />}
          </div>
        </Apr>
        <ApyButton lpLabel={tokenName} finixPrice={finixPrice} apy={apy} />
      </div>
    </CardHeadingStyle>
  )
}

export default CardHeadingAccordion
