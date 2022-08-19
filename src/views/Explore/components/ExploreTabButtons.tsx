import { Box, FormControlLabel, Typography } from '@mui/material'
import React from 'react'
import CustomSwitch from 'uikitV2/components/CustomSwitch'

const ExploreTabButtons = ({ isInvested, setIsInvested }) => {
  return (
    <Box display="flex" alignItems="center" mt="40px">
      <FormControlLabel
        labelPlacement="start"
        className="ml-0"
        label={
          <Typography variant="body2" color="textSecondary">
            Invested only
          </Typography>
        }
        control={
          <CustomSwitch
            checked={isInvested}
            onChange={() => {
              setIsInvested(!isInvested)
            }}
          />
        }
      />
    </Box>
  )
}

export default ExploreTabButtons
