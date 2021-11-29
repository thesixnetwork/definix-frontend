import React, { useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Box, DropdownOption, DropdownSet, SearchInput, useMatchBreakpoints } from 'definixswap-uikit'

interface Filter {
  defaultIndex: number
  options: DropdownOption[]
}
const MyProductsFilter: React.FC<{
  onChangeDisplayFilter: (keyword: string) => void
  onChangeOrderFilter: (keyword: string) => void
  onChangeSearchInput: (keyword: string) => void
}> = ({ onChangeDisplayFilter, onChangeOrderFilter, onChangeSearchInput }) => {
  const { t } = useTranslation()
  const displayFilter = useRef<Filter>({
    defaultIndex: 0,
    options: [t('All'), t('Farm'), t('Pool'), t('Rebalancing')].map((label) => {
      return {
        id: label.toLowerCase(),
        label,
      }
    }),
  })

  // 정렬 Dropdown 버튼
  // -Basic order/APR/Total Liquidity 선택한 순서로 정렬
  // -Basic order는 Farm, Pool, Rebalancing, Long-term stake, Voting fee 순이며 Farm 하위 리스트의 순서는 farm에서 노출되는 Recommand 순서와 동일하다. -APR, Total Liquidity 선택 시 상품 구분없이 리스트 정렬된다.
  // APR: 높은 상품이 최상단
  // Total Liqudity: 높은 상품이 최상단
  const orderFilter = useRef<Filter>({
    defaultIndex: 0,
    options: [
      {
        id: 'sortOrder',
        label: t('Basic order'),
        orderBy: 'asc',
      },
      {
        id: 'apyValue',
        label: t('APR'),
        orderBy: 'desc',
      }
    ],
  })

  const Wrap = styled(Flex)`
    justify-content: space-between;
    align-items: center;
    padding: 40px 40px 0;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      padding: 20px 20px 0;
    }
  `

  return (
    <Wrap>
      <Flex>
        <Box width={128}>
          <DropdownSet
            defaultIndex={displayFilter.current.defaultIndex || 0}
            options={displayFilter.current.options}
            onItemClick={(index: number) => onChangeDisplayFilter(displayFilter.current.options[index].id.toString())}
          />
        </Box>
        <Box className="ml-s8" width={128}>
          <DropdownSet
            defaultIndex={orderFilter.current.defaultIndex || 0}
            options={orderFilter.current.options}
            onItemClick={(index: number) => onChangeOrderFilter(orderFilter.current.options[index].id.toString())}
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
