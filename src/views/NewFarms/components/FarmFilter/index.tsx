import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  Box,
  Text,
  Toggle,
  Flex,
  ColorStyles,
  DropdownSet,
  SearchInput,
  useMatchBreakpoints,
  DropdownOption,
} from 'definixswap-uikit-v2'

const ToggleSection = styled(Flex)`
  align-items: center;
  justify-content: flex-end;
`

const FarmTabButtons = ({ stackedOnly, setStackedOnly, orderBy, search }) => {
  const { t } = useTranslation()
  const { isMaxXl } = useMatchBreakpoints()

  const orderByFilter: DropdownOption[] = useMemo(() => {
    return [
      {
        id: 'sortOrder',
        label: t('Recommend'),
        orderBy: 'asc',
      },
      {
        id: 'apyValue',
        label: t('APR'),
        orderBy: 'desc',
      },
      {
        id: 'totalLiquidityValue',
        label: t('Total Liquidity'),
        orderBy: 'desc',
      },
    ]
  }, [t])
  const [orderByFilterIndex, setOrderByFilterIndex] = useState(0)
  const [isOpenOrderByFilter, setIsOpenOrderByFilter] = useState(false)

  const DropdownSection = () => (
    <DropdownSet
      isOpen={isOpenOrderByFilter}
      activeIndex={orderByFilterIndex}
      options={orderByFilter}
      onButtonClick={() => setIsOpenOrderByFilter(!isOpenOrderByFilter)}
      onOptionClick={(index: number) => {
        setOrderByFilterIndex(index)
        orderBy(orderByFilter[index])
        setIsOpenOrderByFilter(false)
      }}
    />
  )
  const StakedOnlySection = () => (
    <>
      <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
        {t('Staked only Farm')}
      </Text>
      <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
    </>
  )
  if (isMaxXl) {
    return (
      <Flex flexDirection="column">
        <Flex alignItems="center">
          <ToggleSection>
            <StakedOnlySection />
          </ToggleSection>
        </Flex>
        <Flex mt="S_12">
          <Box minWidth={128} mr="S_6">
            <DropdownSection />
          </Box>
          <SearchInput
            type="text"
            placeholder={t('Token name')}
            onSearch={(keyword) => search(keyword.trim().toLowerCase())}
            onReset={() => search('')}
          />
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Flex justifyContent="space-between" alignItems="center">
        <Box width={128}>
          <DropdownSection />
        </Box>
        <ToggleSection ml="S_24">
          <StakedOnlySection />
        </ToggleSection>
      </Flex>
      <Box>
        <SearchInput
          type="text"
          placeholder={t('Token name')}
          onSearch={(keyword) => search(keyword.trim().toLowerCase())}
          onReset={() => search('')}
        />
      </Box>
    </Flex>
  )
}

export default FarmTabButtons
