import { Button, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import FinixCoin from 'uikit-dev/images/finix-coin.png'

const CopyFinixAddress = () => {
  const addressFinix = '0x0f02b1f5af54e04fb6dd6550f009ac2429c4e30d'
  const addressEllipsis = addressFinix
    ? `${addressFinix.substring(0, 6)}...${addressFinix.substring(addressFinix.length - 6)}`
    : null

  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={() => {
        setIsTooltipDisplayed(false)
      }}
      open={isTooltipDisplayed}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      placement="top"
      title="Copied"
    >
      <Button
        variant="outlined"
        fullWidth
        size="large"
        sx={{
          color: (theme) => theme.palette.text.secondary,
          borderColor: (theme) => `${theme.palette.grey[300]} !important`,
          background: 'transparent !important',
        }}
        className="flex align-center px-2 justify-start"
        onClick={() => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(addressFinix)

            setIsTooltipDisplayed(true)
            setTimeout(() => {
              setIsTooltipDisplayed(false)
            }, 1000)
          }
        }}
      >
        <img src={FinixCoin} alt="FinixCoin" width="16" />

        <Typography variant="body2" fontWeight="bold" className="px-2 mr-auto">
          {addressEllipsis}
        </Typography>
      </Button>
    </Tooltip>
  )
}

export default CopyFinixAddress
