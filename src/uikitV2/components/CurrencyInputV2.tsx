/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, Chip, Typography, styled } from '@mui/material'
import BigNumber from 'bignumber.js'
import React from 'react'
import { useMatchBreakpoints } from 'uikit-dev'
import NumericalInputV2 from 'uikitV2/components/NumericalInputV2'

interface CurrencyInputV2Props {
  value: string
  showMaxButton: boolean
  balance?: BigNumber
  id: string
  currency: any
  label?: string
  hideBalance?: boolean
  hideInput?: boolean
  className?: string
  onMax?: () => void
  onQuarter?: () => void
  onHalf?: () => void
  onUserInput: (value: string) => void
}

const InputBox = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
`

const CurrencyInputV2 = ({
  value,
  showMaxButton,
  balance,
  label = 'Input',
  currency,
  hideBalance = false,
  hideInput = false,
  id,
  className,
  onMax,
  onQuarter,
  onHalf,
  onUserInput,
}: CurrencyInputV2Props) => {
  const { account } = useWallet()
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg

  const thisName = (() => {
    if (currency.symbol === 'WKLAY') return 'KLAY'
    if (currency.symbol === 'WBNB') return 'BNB'
    return currency.symbol
  })()
  return (
    <Box id={id} className={className} mb="1.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="12px">
        <Box display="flex" alignItems="center">
          {currency.symbol && <img src={`/images/coins/${currency.symbol}.png`} alt="" width={32} height={32} />}
          <Typography fontWeight="bold" sx={{ ml: '12px' }}>
            {thisName}
          </Typography>
        </Box>

        {account && !!hideBalance === false && (
          <Typography variant="body2" color="text.secondary">
            Balance
            <Typography variant="body2" fontWeight="bold" component="span" ml={0.5}>
              {!hideBalance && !!currency && balance
                ? balance.toNumber().toLocaleString('en-US', { maximumFractionDigits: 4 })
                : ' -'}
            </Typography>
          </Typography>
        )}
      </Box>

      <InputBox style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}>
        {!hideInput && (
          <>
            <NumericalInputV2
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
              style={{ width: isMobile && currency && showMaxButton && label ? '100%' : 'auto' }}
            />

            {account && currency && showMaxButton && label !== 'To' && (
              <Box display="flex">
                <Chip label="25%" size="small" variant="outlined" onClick={onQuarter} sx={{ ml: '6px' }} />
                <Chip label="50%" size="small" variant="outlined" onClick={onHalf} sx={{ ml: '6px' }} />
                <Chip label="MAX" size="small" variant="outlined" onClick={onMax} sx={{ ml: '6px' }} />
              </Box>
            )}
          </>
        )}
      </InputBox>
    </Box>
  )
}

export default CurrencyInputV2
