/* eslint-disable no-nested-ternary */
import { HelpOutlineRounded } from '@mui/icons-material'
import { Box, Tooltip, Typography } from '@mui/material'
import React from 'react'

const TwoLineFormatV2 = ({
  icon = '',
  title,
  subTitle = '',
  value = '',
  subValue = '',
  tooltip = '',
  className = '',
  children = undefined,
  percent = '',
  percentColor = '',
  diffAmounts = '',
  diffAmountsColor = '',
  large = false,
  extraLarge = false,
}) => {
  return (
    <Box className={className}>
      <Typography
        variant={extraLarge ? 'body1' : large ? 'body2' : 'caption'}
        sx={{
          color: (theme) => theme.palette.text.disabled,
          display: 'flex',
          alignItems: 'center',
          fontWeight: extraLarge ? '500' : 'normal',
          mb: extraLarge ? '8px' : '',
        }}
      >
        {icon && <img src={icon} alt="" width="20px" height="20px" style={{ marginRight: '6px' }} />}

        {title}

        {subTitle && (
          <Typography fontSize="0.75rem" color="textSecondary" className="ml-2">
            {subTitle}
          </Typography>
        )}

        {tooltip && (
          <Tooltip title={tooltip}>
            <HelpOutlineRounded className="ml-1" sx={{ width: '16px', height: '16px' }} />
          </Tooltip>
        )}
      </Typography>

      {value && (
        <Typography
          fontSize={large ? '1.25rem' : '1.125rem'}
          fontWeight="500"
          sx={{ display: 'flex', alignItems: 'baseline' }}
        >
          {value}

          {subValue && (
            <Typography fontSize="0.75rem" color="textSecondary" className="ml-2">
              {subValue}
            </Typography>
          )}

          {diffAmounts && diffAmounts !== '0' && (
            <Typography fontSize="0.75rem" fontWeight="500" color={diffAmountsColor} className="ml-2">
              {diffAmounts}
            </Typography>
          )}

          {percent && percent !== '(0%)' && percent !== '0%' && (
            <Typography fontSize="0.75rem" fontWeight="500" color={percentColor} className="ml-2">
              {percent}
            </Typography>
          )}
        </Typography>
      )}

      {children}
    </Box>
  )
}

export default TwoLineFormatV2
