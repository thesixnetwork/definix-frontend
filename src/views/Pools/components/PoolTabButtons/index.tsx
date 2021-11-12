import React, { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Toggle, Flex, ColorStyles, Dropdown, DropdownButton, DropdownItem } from 'definixswap-uikit'

const PoolTabButtons = ({ stackedOnly, setStackedOnly, liveOnly, setLiveOnly, orderBy }) => {
  const { t } = useTranslation()
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)

  const dropdownDataList = useRef([
    {
      id: 'sortOrder',
      label: 'Recommend',
    },
    {
      id: 'apy',
      label: 'APR',
    },
  ])
  // {
  //   id: 'totalLiquidity',
  //   label: 'Total Liquidity'
  // }
  return (
    <Box className="mt-s40">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Dropdown
            isOpen={isOpenDropdown}
            target={<DropdownButton onClick={() => setIsOpenDropdown(!isOpenDropdown)}>filter</DropdownButton>}
            onItemClick={(index) => orderBy(dropdownDataList.current[index].id)}
          >
            {dropdownDataList.current.map((data) => (
              <DropdownItem key={data.id}>{data.label}</DropdownItem>
            ))}
          </Dropdown>

          <Flex alignItems="center" className="mx-s24">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              {t('Staked only')}
            </Text>
            <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
          </Flex>

          <Flex alignItems="center">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              Finished
            </Text>
            <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
          </Flex>
        </Flex>
        <Box>search box</Box>
      </Flex>
    </Box>
  )
}

export default PoolTabButtons
