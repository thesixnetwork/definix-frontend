import { HelpOutlineRounded } from '@mui/icons-material'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import { Box, Button, InputAdornment, OutlinedInput, Tooltip, Typography } from '@mui/material'
import useUserSlippageTolerance from 'hooks/useUserSlippageTolerance'
import React, { useEffect, useState } from 'react'

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const predefinedValues = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 },
]

const SlippageToleranceSettings = () => {
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else {
        setError('Enter a valid slippage percentage')
      }
    } catch {
      setError('Enter a valid slippage percentage')
    }
  }, [value, setError, setUserslippageTolerance])

  // Notify user if slippage is risky
  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError('Your transaction may fail')
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError('Your transaction may be frontrun')
    }
  }, [userSlippageTolerance, setError])

  return (
    <Box mb={5}>
      <Typography color="text.secondary" fontWeight={500} sx={{ display: 'flex', alignItems: 'center' }} mb={2}>
        Slippage Tolerance
        <Tooltip title="Your transaction will revert if the price changes unfavorably by more than this percentage.">
          <HelpOutlineRounded className="ml-1" sx={{ width: '16px', height: '16px' }} />
        </Tooltip>
      </Typography>

      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
        <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 0 }}>
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            const handleClick = () => setValue(predefinedValue)

            return (
              <Button
                key={predefinedValue}
                variant="contained"
                color={value === predefinedValue ? 'primary' : 'info'}
                onClick={handleClick}
                sx={{ mr: 1, width: '88px', flexShrink: 0 }}
              >
                {label}
              </Button>
            )
          })}
        </Box>

        <OutlinedInput
          type="number"
          inputProps={{ step: 0.1, min: 0.1 }}
          size="small"
          placeholder="5%"
          value={value}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <Typography color="text.primary" fontWeight={500}>
                %
              </Typography>
            </InputAdornment>
          }
          sx={{ width: '184px' }}
        />
      </Box>

      {error && (
        <Typography variant="body2" color="error" mt="8px" sx={{ display: 'flex', alignItems: 'center', mt: '12px' }}>
          <ErrorRoundedIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default SlippageToleranceSettings
