/* eslint-disable no-nested-ternary */
import { Tooltip, Typography } from '@mui/material'
import { Ratio } from 'config/constants/types'
import React from 'react'
import styled from 'styled-components'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'

interface AssetRatioType {
  isHorizontal?: boolean
  className?: string
  ratio: Ratio[] | any
}

const Coin = styled.div<{ isHorizontal?: boolean }>`
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 0 8px;
  width: ${({ isHorizontal }) => (!isHorizontal ? '33.333%' : 'auto')};
  position: relative;

  img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const AssetRatio: React.FC<AssetRatioType> = ({ isHorizontal = true, className = '', ratio = [] }) => {
  return (
    <TwoLineFormatV2 title="Asset Ratio" className={className}>
      <div className="flex flex-wrap" style={{ marginLeft: isHorizontal ? '-8px' : '' }}>
        {ratio.map((m) => (
          <Tooltip title={m.symbol}>
            <Coin isHorizontal={isHorizontal}>
              <img src={`/images/coins/${m.symbol || ''}.png`} alt={m.symbol} />
              <Typography variant="body2">{m.value}%</Typography>
            </Coin>
          </Tooltip>
        ))}
      </div>
    </TwoLineFormatV2>
  )
}

export default AssetRatio
