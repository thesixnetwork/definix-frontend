import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Image } from 'uikit-dev'
import ribbin from '../../../../uikit-dev/images/ribbin.png'

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
  top: -19px;
  left: 0;
  width: 80px;
  height: 51px;
  background: url(${ribbin});
  background-size: contain;
  background-repeat: no-repeat;

  p {
    color: ${({ theme }) => theme.colors.white};
    font-weight: bold;
    width: 64px;
    text-align: center;
    margin-top: 20px;
  }
`

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundBox};
  padding: 12px 12px 8px 12px;
  margin-bottom: 2rem;

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
        <Image src={`/images/coins/${firstCoin}.png`} alt={tokenSymbol} width={48} height={48} />
        <Image src={`/images/coins/${secondCoin}.png`} alt={tokenSymbol} width={48} height={48} />
      </StyledFarmImages>

      <Heading>{lpLabel}</Heading>
      {/* <Flex justifyContent="center">
        {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
        <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
      </Flex> */}
    </Wrapper>
  )
}

export default CardHeading
