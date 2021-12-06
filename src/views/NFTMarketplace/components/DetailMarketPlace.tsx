import React from 'react'
import styled from 'styled-components'
import useTheme from '../../../hooks/useTheme'
import plusWhite from '../../../uikit-dev/images/for-ui-v2/nft/plus-white.png'
import { Text, Heading, Image, Flex } from '../../../uikit-dev'

export interface ExpandableSectionProps {
  isHorizontal?: boolean
  className?: string
  data: any
  typeName: string
  isMarketplace?: boolean
}

const InfosBox = styled.div<{ isHorizontal?: boolean; isMarketplace?: boolean }>`
  padding: 16px;
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom: ${({ isHorizontal, theme, isMarketplace }) =>
    // eslint-disable-next-line no-nested-ternary
    !isHorizontal && isMarketplace ? `1px solid ${theme.colors.border}` : 'none'};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
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

const GroupPlus = styled.div<{ isHorizontal?: boolean }>`
  border: 1px solid #737375;
  border-radius: 50%;
  background-color: #0973b9;
  position: absolute;
  top: 76%;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 8%;
  width: 10%;
`

const BottomContent = styled(Flex)`
  width: 100%;
  justify-content: flex-end;

  @media screen and (max-width: ${768}) {
    padding: 0px 20px 18px 20px;
  }
`

const CircleCount = styled.div`
  border: 1px solid #737375;
  border-radius: 50%;
  background-color: #0973b9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -32px;
  margin-bottom: 12px;
  z-index: 10;
  height: 35px;
  width: 35px;
`

const TextCount = styled(Text)`
  text-shadow: 0px 2px 4px #00000050;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
`

const DetailMarketPlace: React.FC<ExpandableSectionProps> = ({
  isHorizontal = false,
  className = '',
  data,
  typeName,
  isMarketplace,
}) => {
  const { isDark } = useTheme()
  return (
    <>
      <InfosBox>
        <div>
          {typeName === 'Group' && (
            <BottomContent>
              <CircleCount>
                <img src={plusWhite} alt="" width="20%" />
                <TextCount>{data.count}</TextCount>
              </CircleCount>
            </BottomContent>
          )}

          <div className="flex flex-wrap" style={{ marginRight: '-6px' }}>
            <Heading bold className="flex-shrink">
              #{data.tokenId}
            </Heading>
          </div>
        </div>
        <div className="flex align-baseline flex-wrap justify-space-between">
          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Text bold className="flex-shrink">
              {data.name} {data.title}
            </Text>
          </div>
        </div>
        <div className="flex align-baseline flex-wrap justify-space-between">
          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Text bold className="flex-shrink" color="textSubtle">
              Dingo x SIX Network NFT Project No.1
            </Text>
          </div>
        </div>
      </InfosBox>

      <PriceUnitBox>
        <div className="flex justify-space-between py-1">
          <Text fontSize="12px" color="textSubtle">
            Price
          </Text>
          <div className="flex">
            <Image src="/images/coins/FINIX.png" width={16} height={16} />
            <Text fontSize="12px" color="text" paddingLeft="6px">
              {data.price} FINIX
            </Text>
          </div>
        </div>
        <div className="flex justify-space-between">
          <Text fontSize="12px" color="textSubtle">
            Until
          </Text>
          <Text fontSize="12px" color="text">
            {data.orderSellPeriod > 0 ? data.orderSellPeriod : '-'}
          </Text>
        </div>
      </PriceUnitBox>
    </>
  )
}

export default DetailMarketPlace
