import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Box, DropdownOption, DropdownSet, SearchInput } from '@fingerlabs/definixswap-uikit-v2'
import { mediaQueries, spacing } from 'uikitV2/base'

const Wrap = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 40px 40px 0;
  ${mediaQueries.mobileXl} {
    flex-direction: column;
    padding: 20px 20px 0;
  }
`
const Row = styled(Flex)`
  width: 50%;
  &.search-input-wrap {
    width: 200px;
  }
  ${mediaQueries.mobileXl} {
    width: 100%;
    &.search-input-wrap {
      margin-top: ${spacing.S_8}px;
      width: 100%;
    }
  }
`
const DropdownWrap = styled(Box)`
  width: 128px;
  &:first-child {
    margin-right: ${spacing.S_8}px;
    min-width: 176px;
  }
  ${mediaQueries.mobileXl} {
    width: 50%;
    &:first-child {
      min-width: 176px;
    }
  }
`

const MyProductsFilter: React.FC<{
  onChangeDisplayFilter: (keyword: string) => void
  onChangeOrderFilter: (orderBy: DropdownOption) => void
  onChangeSearchInput: (keyword: string) => void
}> = ({ onChangeDisplayFilter, onChangeOrderFilter, onChangeSearchInput }) => {
  const displayFilter = useMemo<DropdownOption[]>(
    () => [
      {
        id: 'all',
        label: 'All',
      },
      {
        id: 'farm',
        label: 'Farm',
      },
      {
        id: 'pool',
        label: 'Pool',
      },
      {
        id: 'rebalancing',
        label: 'Rebalancing',
      },
      {
        id: 'longtermstake',
        label: 'Long-term Stake',
      },
    ],
    [],
  )
  const [displayFilterIndex, setDisplayFilterIndex] = useState(0)
  const [isOpenDisplayFilter, setIsOpenDisplayFilter] = useState(false)

  // 정렬 Dropdown 버튼
  // -Basic order/APR/Total Liquidity 선택한 순서로 정렬
  // -Basic order는 Farm, Pool, Rebalancing, Long-term stake, Voting fee 순이며 Farm 하위 리스트의 순서는 farm에서 노출되는 Recommand 순서와 동일하다. -APR, Total Liquidity 선택 시 상품 구분없이 리스트 정렬된다.
  // APR: 높은 상품이 최상단
  // Total Liqudity: 높은 상품이 최상단
  const orderFilter = useMemo<DropdownOption[]>(
    () => [
      {
        id: '',
        label: 'Basic order',
        orderBy: 'asc',
      },
      {
        id: 'apyValue',
        label: 'Order APR',
        orderBy: 'desc',
      },
    ],
    [],
  )
  const [orderByFilterIndex, setOrderByFilterIndex] = useState(0)
  const [isOpenOrderByFilter, setIsOpenOrderByFilter] = useState(false)

  return (
    <Wrap>
      <Row>
        <DropdownWrap>
          <DropdownSet
            isOpen={isOpenDisplayFilter}
            activeIndex={displayFilterIndex}
            options={displayFilter}
            onButtonClick={() => setIsOpenDisplayFilter(!isOpenDisplayFilter)}
            onOptionClick={(index: number) => {
              setDisplayFilterIndex(index)
              onChangeDisplayFilter(displayFilter[index].id.toString())
              setIsOpenDisplayFilter(false)
            }}
          />
        </DropdownWrap>
        <DropdownWrap>
          <DropdownSet
            isOpen={isOpenOrderByFilter}
            activeIndex={orderByFilterIndex}
            options={orderFilter}
            onButtonClick={() => setIsOpenOrderByFilter(!isOpenOrderByFilter)}
            onOptionClick={(index: number) => {
              setOrderByFilterIndex(index)
              onChangeOrderFilter(orderFilter[index])
              setIsOpenOrderByFilter(false)
            }}
          />
        </DropdownWrap>
      </Row>
      <Row className="search-input-wrap">
        <SearchInput
          type="text"
          placeholder="Search token name"
          onSearch={(keyword: string) => onChangeSearchInput(keyword.trim().toLowerCase())}
          onReset={() => onChangeSearchInput('')}
        />
      </Row>
    </Wrap>
  )
}

export default MyProductsFilter
