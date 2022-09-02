import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, Text, Toggle, useMatchBreakpoints } from 'uikit-dev'
import { Box, Select, MenuItem, FormControlLabel, Typography } from '@mui/material'
import CustomSwitch from 'uikitV2/components/CustomSwitch'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 2rem;

    .flex {
      margin: 0 !important;
    }
  } ;
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

const PoolTabButtons = ({
  stackedOnly,
  setStackedOnly,
  liveOnly,
  setLiveOnly,
  listView,
  setListView,
  selectDisplay,
  setSelectDisplay,
  allDisplayChiose = [],
}) => {
  const TranslateString = useI18n()
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <div className="flex mt-3">
      <Box className="mr-3" display="flex" alignItems="center" mt="30px">
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

      <Box className="mr-3" display="flex" alignItems="center" mt="30px">
        <FormControlLabel
          labelPlacement="start"
          className="ml-0"
          label={<Text color="textSecondary">{TranslateString(999, 'Live')}</Text>}
          control={<CustomSwitch checked={liveOnly} onChange={() => setLiveOnly(!liveOnly)} />}
        />
      </Box>

      <Box display="flex" alignItems="center" mt="30px">
        <FormControlLabel
          labelPlacement="start"
          className="ml-0"
          label={<Text color="textSecondary">Staked only</Text>}
          control={<CustomSwitch checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />}
        />
      </Box>
    </div>
  )

  // return (
  //   <Wrapper className="flex">
  //     {isMobile ? (
  //       <div className="flex justify-self-start">
  //         <IconButton
  //           size="sm"
  //           onClick={() => {
  //             setListView(true)
  //           }}
  //           variant="text"
  //           className="mr-1"
  //           isStroke
  //         >
  //           <ListViewIcon isStroke color={listView || isDark ? 'primary' : 'textSubtle'} />
  //         </IconButton>
  //         <IconButton
  //           size="sm"
  //           onClick={() => {
  //             setListView(false)
  //           }}
  //           isStroke
  //           variant="text"
  //         >
  //           <CardViewIcon isStroke color={!listView || isDark ? 'primary' : 'textSubtle'} />
  //         </IconButton>
  //       </div>
  //     ) : (
  //       <div className="flex">
  //         <Button
  //           size="sm"
  //           onClick={() => {
  //             setListView(true)
  //           }}
  //           startIcon={<ListViewIcon isStroke color={listView || isDark ? 'white' : 'primary'} />}
  //           variant={listView ? 'primary' : 'secondary'}
  //           className="mr-2"
  //           isStroke
  //         >
  //           List View
  //         </Button>
  //         <Button
  //           size="sm"
  //           onClick={() => {
  //             setListView(false)
  //           }}
  //           variant={!listView ? 'primary' : 'secondary'}
  //           startIcon={<CardViewIcon isStroke color={!listView || isDark ? 'white' : 'primary'} />}
  //           isStroke
  //         >
  //           Card View
  //         </Button>
  //       </div>
  //     )}

  //     <div className="flex mt-3">
  //       <ToggleWrapper>
  //         <Toggle checked={liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
  //         <Text> {TranslateString(999, 'Live')}</Text>
  //       </ToggleWrapper>

  //       <Button
  //         size="sm"
  //         onClick={() => {
  //           setStackedOnly(false)
  //         }}
  //         variant={!stackedOnly ? 'primary' : 'secondary'}
  //         className="mr-2"
  //       >
  //         All Pool
  //       </Button>
  //       <Button
  //         size="sm"
  //         onClick={() => {
  //           setStackedOnly(true)
  //         }}
  //         variant={stackedOnly ? 'primary' : 'secondary'}
  //       >
  //         Staked
  //       </Button>
  //     </div>
  //   </Wrapper>
  // )
}

export default PoolTabButtons
