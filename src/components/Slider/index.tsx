import { Box, ColorStyles, Flex, Text, textStyle } from '@fingerlabs/definixswap-uikit-v2'
import React, { ChangeEvent, useCallback, useMemo, InputHTMLAttributes } from 'react'
import styled from 'styled-components'

interface SliderProps {
  min: number
  max: number
  value: number
  onValueChanged: (newValue: number) => void
  valueLabel?: string
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isCurrentValueMaxValue: boolean
}

const StyledInput = styled.input<StyledInputProps>`
  height: 33px;
  position: relative;
  cursor: pointer;
  box-shadow: unset;
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border: 5px solid #ff6828;
    background-color: ${ColorStyles.WHITE};
    border-radius: 50%;
    cursor: pointer;
    transform: translate(-2px, 1px);
    box-shadow: unset;
  }
  ::-moz-range-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border: 5px solid #ff6828;
    background-color: ${ColorStyles.WHITE};
    border-radius: 50%;
    cursor: pointer;
    transform: translate(-2px, 1px);
    box-shadow: unset;
  }
  ::-ms-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border: 5px solid #ff6828;
    background-color: ${ColorStyles.WHITE};
    border-radius: 50%;
    cursor: pointer;
    transform: translate(-2px, 1px);
    box-shadow: unset;
  }
`

const BarBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 5px;
  top: 18px;
  border-radius: 2.5px;
  background-color: ${ColorStyles.LIGHTGREY};
`

const BarProgress = styled.div<{ progress: number; isCurrentValueMaxValue: boolean }>`
  position: absolute;
  width: ${({ progress, isCurrentValueMaxValue }) => (isCurrentValueMaxValue ? 'calc(100% - 16px)' : `${progress}%`)};
  height: 5px;
  top: 18px;
  background-color: #ff6828;
  border-radius: 2.5px;
`

const Slider: React.FC<SliderProps> = ({ min, max, value, onValueChanged, valueLabel, ...props }) => {
  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      if (onValueChanged) {
        onValueChanged(parseInt(target.value, 10))
      }
    },
    [onValueChanged]
  )
  const progressPercentage = useMemo(() => (value / max) * 100, [value, max])
  const isCurrentValueMaxValue = useMemo(() => value === max, [value, max])

  return (
    <Box position="relative" height="48px">
      <Box position="absolute" width="100%">
        <BarBackground />
        <BarProgress isCurrentValueMaxValue={isCurrentValueMaxValue} progress={progressPercentage} />
        <StyledInput
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          isCurrentValueMaxValue={isCurrentValueMaxValue}
        />
      </Box>
    </Box>
  )
}

export default Slider
