import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
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
`

const CardHeadingAccordion: React.FC<CardHeadingAccordionProps> = ({
  tokenName,
  isOldSyrup,
  apy,
  className = '',
  isOpenAccordion = false,
  setIsOpenAccordion,
}) => {
  const { t } = useTranslation()

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
            <Image src={`/images/coins/${tokenName}.png`} width={imgSize} height={imgSize} />
          </StyledFarmImages>

          <Heading fontSize="16px" fontWeight="500 !important">
            {isOldSyrup && '[OLD]'} {tokenName} {t('Pool')}
          </Heading>
        </div>
        {isOpenAccordion ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}
      </div>

      <div className="flex align-center mt-2">
        <Apr color="success" bold>
          {t('APR')}
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
