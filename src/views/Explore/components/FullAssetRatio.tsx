import { Box, Typography } from '@mui/material'
import { Ratio } from 'config/constants/types'
import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit-dev'

interface FullAssetRatioType {
  className?: string
  ratio: Ratio[] | any
}

const Coin = styled.div<{ width: string; isMobile: boolean }>`
  width: ${({ width }) => width};

  .name {
    display: flex;
    flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
    align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};

    img {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      border-radius: ${({ theme }) => theme.radii.circle};
      margin-right: 4px;
    }
  }
`

const Bar = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  height: 24px;
  width: 100%;
  margin-bottom: 12px;
  border-right: 1px solid white;
`

const FullAssetRatio: React.FC<FullAssetRatioType> = ({ ratio = [], className = '' }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Box p={{ xs: '20px', lg: 4 }}>
      <Typography color="textSecondary" fontWeight={500} sx={{ mb: '20px' }}>
        Asset Ratio
      </Typography>

      <div className="flex">
        {ratio.map((m) => (
          <Coin width={`${m.value}%`} isMobile={isMobile}>
            <Bar color={m.color} />
            <div className="name">
              <img src={`/images/coins/${m.symbol || ''}.png`} alt="" />
              <Typography variant="body2">{m.value}%</Typography>
            </div>
          </Coin>
        ))}
      </div>
    </Box>
  )
}

export default FullAssetRatio
