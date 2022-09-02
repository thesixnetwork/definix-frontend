import { HelpOutlineRounded } from '@mui/icons-material'
import { Box, Tooltip, Typography } from '@mui/material'
import React from 'react'

const SpaceBetweenFormat = ({
  title = '',
  value = '',
  titleElm = undefined,
  valueElm = undefined,
  tooltip = '',
  ...props
}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" {...props}>
      {titleElm || (
        <Typography variant="body2" color="text.disabled" className="flex align-center">
          {title}
          {tooltip && (
            <Tooltip title={tooltip}>
              <HelpOutlineRounded className="ml-1" sx={{ width: '16px', height: '16px' }} />
            </Tooltip>
          )}
        </Typography>
      )}
      {valueElm || (
        <Typography variant="body2" color="text.disabled" fontWeight="bold">
          {value}
        </Typography>
      )}
    </Box>
  )
}

export default SpaceBetweenFormat
