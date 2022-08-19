/* eslint-disable no-nested-ternary */
import { Ratio } from 'config/constants/types'
import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'

interface AssetRatioType {
  isHorizontal?: boolean
  className?: string
  ratio: Ratio[] | any
}

const Tooltip = styled.div<{ tooltipPos?: string }>`
  display: none;
  position: absolute;

  top: ${({ tooltipPos }) => (tooltipPos === 'top' ? 'auto' : tooltipPos === 'bottom' ? 'calc(100% + 8px)' : '50%')};
  left: ${({ tooltipPos }) => (tooltipPos === 'left' ? 'auto' : tooltipPos === 'right' ? 'calc(100% + 8px)' : '50%')};
  bottom: ${({ tooltipPos }) => (tooltipPos === 'top' ? 'calc(100% + 8px)' : 'auto')};
  right: ${({ tooltipPos }) => (tooltipPos === 'left' ? 'calc(100% + 8px)' : 'auto')};
  transform: ${({ tooltipPos }) =>
    tooltipPos === 'top' || tooltipPos === 'bottom' ? 'translate(-50%, 0)' : 'translate(0, -50%)'};

  z-index: 1;
  width: max-content;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: ${({ theme }) => theme.radii.default};
  opacity: 0.7;
  padding: 4px 8px;
  font-size: 12px;
`

const Coin = styled.div<{ isHorizontal?: boolean }>`
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 0 8px;
  width: ${({ isHorizontal }) => (!isHorizontal ? '33.333%' : 'auto')};
  position: relative;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }

  &:hover {
    ${Tooltip} {
      display: block;
    }
  }
`

const AssetRatio: React.FC<AssetRatioType> = ({ isHorizontal = true, className = '', ratio = [] }) => {
  return (
    <div className={className}>
      <Text
        fontSize="14px"
        color="textSubtle"
        className={!isHorizontal ? 'mb-2' : ''}
        textAlign={isHorizontal ? 'left' : 'center'}
      >
        Asset ratio
      </Text>
      <div className="flex flex-wrap" style={{ marginLeft: isHorizontal ? '-8px' : '' }}>
        {ratio.map((m) => (
          <Coin isHorizontal={isHorizontal}>
            <img src={`/images/coins/${m.symbol || ''}.png`} alt={m.symbol} />
            <Text fontSize="16px">{m.value}%</Text>
            <Tooltip tooltipPos="top">{m.symbol}</Tooltip>
          </Coin>
        ))}
      </div>
    </div>
  )
}

export default AssetRatio
