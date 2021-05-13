import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Image } from 'uikit-dev'
import ribbin from 'uikit-dev/images/for-ui-v2/ribbin.png'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  farmImage?: string
  tokenSymbol?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const MultiplierTag = styled.div`
  position: absolute;
  top: -3px;
  left: 16px;
  width: 52px;
  height: 36px;
  background: url(${ribbin});
  background-size: contain;
  background-repeat: no-repeat;

  p {
    color: ${({ theme }) => theme.colors.white};
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
`

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 12px 12px 8px 12px;
  margin-bottom: 1rem;

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

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  // isCommunityFarm,
  farmImage,
  tokenSymbol,
}) => {
  const firstCoin = farmImage.split('-')[0].toLocaleLowerCase()
  const secondCoin = farmImage.split('-')[1].toLocaleLowerCase()

  return (
    <Wrapper className="pt-5" flexDirection="column" alignItems="center" style={{ position: 'relative' }}>
      <MultiplierTag>
        <p>{multiplier}</p>
      </MultiplierTag>

      <StyledFarmImages>
        <Image src={`/images/coins/${firstCoin}.png`} alt={tokenSymbol} width={56} height={56} />
        <Image src={`/images/coins/${secondCoin}.png`} alt={tokenSymbol} width={56} height={56} />
      </StyledFarmImages>

      <Heading fontSize="24px !important" fontWeight="500 !important">
        {lpLabel}
      </Heading>
      {/* <Flex justifyContent="center">
        {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
        <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
      </Flex> */}
    </Wrapper>
  )
}

export default CardHeading
