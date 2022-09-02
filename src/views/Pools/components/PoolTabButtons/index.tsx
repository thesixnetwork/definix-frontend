import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'uikit-dev'
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
  // const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  // const isMobile = !isXl

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
          label={
            <Typography variant="body2" color="textSecondary">
              {TranslateString(999, 'Live')}
            </Typography>
          }
          control={<CustomSwitch checked={liveOnly} onChange={() => setLiveOnly(!liveOnly)} />}
        />
      </Box>

      <Box display="flex" alignItems="center" mt="30px">
        <FormControlLabel
          labelPlacement="start"
          className="ml-0"
          label={
            <Typography variant="body2" color="textSecondary">
              Staked only
            </Typography>
          }
          control={<CustomSwitch checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />}
        />
      </Box>
    </div>
  )
}

export default PoolTabButtons
