import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Image, Tag } from 'uikit-dev'

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

const MultiplierTag = styled(Tag)`
  position: absolute;
  top: 0;
  left: 0;
  border-bottom-right-radius: 50%;
  height: 40px;
  min-width: 40px;
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
      <MultiplierTag variant="textSubtle">{multiplier}</MultiplierTag>

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
