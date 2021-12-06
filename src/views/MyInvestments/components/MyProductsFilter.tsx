import React, { useRef, useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Box, DropdownOption, DropdownSet, SearchInput, useMatchBreakpoints } from 'definixswap-uikit'

interface Filter {
  defaultIndex: number
  options: DropdownOption[]
}

const Wrap = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 40px 40px 0;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px 20px 0;
  }
`

const MyProductsFilter: React.FC<{
  onChangeDisplayFilter: (keyword: string) => void
  onChangeOrderFilter: (keyword: string) => void
  onChangeSearchInput: (keyword: string) => void
}> = ({ onChangeDisplayFilter, onChangeOrderFilter, onChangeSearchInput }) => {
  const { t } = useTranslation()

  const displayFilter = useMemo<DropdownOption[]>(
    () =>
      [t('All'), t('Farm'), t('Pool'), t('Rebalancing')].map((label) => {
        return {
          id: label.toLowerCase(),
          label,
        }
      }),
    [t],
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
        id: 'sortOrder',
        label: t('Basic order'),
        orderBy: 'asc',
      },
      {
        id: 'apyValue',
        label: t('APR'),
        orderBy: 'desc',
      },
    ],
    [t],
  )
  const [orderByFilterIndex, setOrderByFilterIndex] = useState(0)
  const [isOpenOrderByFilter, setIsOpenOrderByFilter] = useState(false)

  return (
    <Wrap>
      <Flex>
        <Box width={128}>
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
        </Box>
        <Box className="ml-s8" width={128}>
          <DropdownSet
            isOpen={isOpenOrderByFilter}
            activeIndex={orderByFilterIndex}
            options={orderFilter}
            onButtonClick={() => setIsOpenOrderByFilter(!isOpenOrderByFilter)}
            onOptionClick={(index: number) => {
              setOrderByFilterIndex(index)
              onChangeOrderFilter(orderFilter[index].id.toString())
              setIsOpenOrderByFilter(false)
            }}
          />
        </Box>
      </Flex>
      <Box width={200}>
        <SearchInput
          type="text"
          placeholder={t('Search token name')}
          onSearch={(keyword: string) => onChangeSearchInput(keyword.trim().toLowerCase())}
          onReset={() => onChangeSearchInput('')}
        />
      </Box>
    </Wrap>
  )
}

export default MyProductsFilter
