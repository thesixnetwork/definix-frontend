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
  useMatchBreakpoints,
  DropdownOption,
} from '@fingerlabs/definixswap-uikit-v2'

const Wrap = styled(Flex)`
  position: absolute;
  bottom: 0;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.S_16}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    position: relative;
  }
`

const ToggleWrap = styled(Flex)`
  align-items: center;
  justify-content: flex-end;
`

const PoolFilter = ({ stackedOnly, setStackedOnly, liveOnly, setLiveOnly, orderBy, search }) => {
  const { t } = useTranslation()
  const { isMaxXl } = useMatchBreakpoints()

  const orderByFilter = useMemo<DropdownOption[]>(
    () => [
      {
        id: 'sortOrder',
        label: t('Recommend'),
        orderBy: 'asc',
      },
      {
        id: 'apyValue',
        label: t('Order APR'),
        orderBy: 'desc',
      },
      {
        id: 'totalStakedValue',
        label: t('By Total staked'),
        orderBy: 'desc',
      },
    ],
    [t],
  )
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
      <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} mr="S_8" style={{ wordBreak: 'keep-all' }}>
        {t('Staked only Pools')}
      </Text>
      <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
    </>
  )
  // const LiveOnlySection = () => (
  //   <>
  //     <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
  //       {t('Finished pool')}
  //     </Text>
  //     <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
  //   </>
  // )

  if (isMaxXl) {
    return (
      <Flex justifyContent="space-between" alignItems="center" mb="S_16">
        <Box width="148px">
          <DropdownSection />
        </Box>
        <Box ml="S_8">
          <ToggleWrap>
            <StakedOnlySection />
          </ToggleWrap>
        </Box>
      </Flex>
    )
  }

  return (
    <Wrap>
      <Flex justifyContent="space-between" alignItems="center">
        <Box width={148}>
          <DropdownSection />
        </Box>
        <ToggleWrap ml="S_24">
          <StakedOnlySection />
        </ToggleWrap>
        {/* <ToggleWrap ml="S_24">
          <LiveOnlySection />
        </ToggleWrap> */}
      </Flex>
      {/* <Box width={200}>
        <SearchInput
          type="text"
          placeholder={t('Token name')}
          onSearch={(keyword) => search(keyword.trim().toLowerCase())}
          onReset={() => search('')}
        />
      </Box> */}
    </Wrap>
  )
}

export default PoolFilter
