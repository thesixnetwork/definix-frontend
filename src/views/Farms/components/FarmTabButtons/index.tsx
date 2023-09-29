import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, useMatchBreakpoints } from 'uikit-dev'
import { DropdownSet, DropdownOption } from 'uikitV2/components/DropdownSet'
import { Box, Select, MenuItem, FormControlLabel, Typography } from '@mui/material'
import { Flex } from 'uikitV2/components/Box'
import { Text as CustomText } from 'uikitV2/components/Text'
import { SearchInput } from 'uikitV2/components/SearchInput'
import { Toggle } from 'uikitV2/components/Toggle'
import CustomSwitch from 'uikitV2/components/CustomSwitch'

const Text = styled(CustomText)`
  font-size: 0.875rem;
`

const SpaceBetweenDiv = styled.div`
  justify-content: space-between;
  margin-bottom: 16px;
`
const ToggleWrap = styled(Flex)`
  align-items: center;
  justify-content: flex-end;
`

const SearchInputWrap = styled(Box)`
  width: 200px;
  @media screen and {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 2rem;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 32px;

  ${Text} {
    margin-left: 8px;
  }
`

const FarmTabButtons = ({
  stackedOnly,
  setStackedOnly,
  listView,
  liveOnly,
  setLiveOnly,
  setListView,
  search = (a) => {
    console.log('search', a)
  },
  selectDisplay,
  setSelectDisplay = (a) => {
    console.log('search', a)
  },
  allDisplayChiose = [],
}) => {
  const TranslateString = useI18n()
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const orderBy = (a) => {
    console.log('order', a)
  }
  const [orderByFilterIndex, setOrderByFilterIndex] = useState(0)
  const [isOpenOrderByFilter, setIsOpenOrderByFilter] = useState(false)
  const orderByFilter: DropdownOption[] = [
    {
      id: 'sortOrder',
      label: 'Recommend',
      orderBy: 'asc',
    },
    {
      id: 'apyValue',
      label: 'APR',
      orderBy: 'desc',
    },
    {
      id: 'totalLiquidityValue',
      label: 'Total Liquidity',
      orderBy: 'desc',
    },
  ]
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
      <Text textStyle="R_14R" color="#666666" className="mr-s8">
        Staked only Farm
      </Text>
      <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
    </>
  )

  const FinishedSection = () => (
    <>
      <Text textStyle="R_14R" color="#666666" className="mr-s8">
        Finished
      </Text>
      <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
    </>
  )
  return (
    <SpaceBetweenDiv className="flex">
      <div className="flex">
        <Box className="mr-3" display="flex" alignItems="center">
          <Select
            value={selectDisplay}
            size="small"
            sx={{ width: '130px' }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            }}
            onChange={(e) => {
              setSelectDisplay(e.target.value)
            }}
          >
            {allDisplayChiose.map((data) => (
              <MenuItem {...data}>
                <Text color="rgb(102, 102, 102)" fontWeight={data.value === selectDisplay ? 700 : 100}>
                  {data.key}
                </Text>
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box className="mr-3" display="flex" alignItems="center">
          <FormControlLabel
            labelPlacement="start"
            className="ml-0"
            label={
              <Typography variant="body2" color="textSecondary">
                Staked only Farm
              </Typography>
            }
            control={<CustomSwitch checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />}
          />
        </Box>

        <Box className="mr-3" display="flex" alignItems="center">
          <FormControlLabel
            labelPlacement="start"
            className="ml-0"
            label={
              <Typography variant="body2" color="textSecondary">
                Finished
              </Typography>
            }
            control={<CustomSwitch checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />}
          />
        </Box>
      </div>
      <SearchInputWrap>
        <SearchInput
          type="text"
          placeholder="Token name"
          onSearch={(keyword) => search(keyword.trim().toLowerCase())}
          onReset={() => search('')}
        />
      </SearchInputWrap>
    </SpaceBetweenDiv>
  )
}

export default FarmTabButtons
