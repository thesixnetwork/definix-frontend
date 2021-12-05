import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import useTheme from '../../../hooks/useTheme'
import plusWhite from '../../../uikit-dev/images/for-ui-v2/nft/plus-white.png'
import { Text, Heading, Image, Flex, Button } from '../../../uikit-dev'

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

const Box = styled.div<{ status?: string }>`
  padding: 6px 20px 6px 20px;
  border: ${({ status }) => `1px solid ${status}`};
  color: ${({ status }) => `${status}`};
  border-radius: 8px;
  font-size: 12px;
`

const DetailOrder: React.FC<ExpandableSectionProps> = ({
  isHorizontal = false,
  className = '',
  data,
  typeName,
  isMarketplace,
}) => {
  const filterCurrency = useMemo(() => {
    const options = [
      { address: '0x1FD5a30570b384f03230595E31a4214C9bEdC964', currency: 'SIX' },
      { address: '0x1FD5a30570b384f03230595E31a4214C9bEdC962', currency: 'FINIX' },
    ]
    return options.filter((item) => _.get(item, 'address') === data.currency)
  }, [data])

  const setData = useMemo(() => {
    let txt = ''
    if (data.status === 0) {
      txt = '#55BD92'
    } else if (data.status === 1) {
      txt = '#F5C858'
    }
    return txt
  }, [data])

  // enum OrderStatus {OnSell,SoldOut,Cancel,Other}
  const textStatus = useMemo(() => {
    let txt = ''
    if (data.status === 0) {
      txt = 'Listed'
    } else if (data.status === 1) {
      txt = 'Sold'
    }
    return txt
  }, [data])

  return (
    <>
      <InfosBox>
        <div>
          <div className="flex flex-wrap" style={{ marginRight: '-6px', justifyContent: 'space-between' }}>
            <Heading bold className="flex-shrink">
              #{data.tokenID}
            </Heading>
            <Box status={setData}>{textStatus}</Box>
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
            <Image src={`/images/coins/${_.get(filterCurrency, '0.currency')}.png`} width={20} height={20} />
            <Text fontSize="12px" color="text" paddingLeft="6px">
              {data.price} {_.get(filterCurrency, '0.currency')}
            </Text>
          </div>
        </div>
        <div className="flex justify-space-between">
          <Text fontSize="12px" color="textSubtle">
            Until
          </Text>
          <Text fontSize="12px" color="text">
            {data.sellPeriod === 0 ? '-' : data.sellPeriod}
          </Text>
        </div>
      </PriceUnitBox>
    </>
  )
}

export default DetailOrder
