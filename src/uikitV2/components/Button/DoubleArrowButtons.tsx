import styled from 'styled-components'
import { ArrowLeftGIcon, ArrowRightGIcon, ArrowLeftWIcon, ArrowRightWIcon } from '../Icon'
import React from 'react'
import Button from './Button'
import { Flex } from '../Box'
import { DoubleArrowButtonsProps, ButtonVariants, ButtonScales } from './types'

const ButtonWrap = styled(Flex)`
  width: 50px;
  height: 28px;
  border: 1px solid #b4a9a8;
  border-radius: 8px;
`

const ArrowButton = styled.button<{ disabled: boolean; isLight: boolean }>`
  padding: 0px;
  width: 16px;
  height: 16px;
  opacity: 1;
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const DoubleArrowButtons: React.FC<DoubleArrowButtonsProps> = ({
  type = 'light',
  disableLeftArrow,
  disableRightArrow,
  onClickLeftArrow,
  onClickRightArrow,
}) => {
  return (
    <ButtonWrap justifyContent="space-between" alignItems="center" className="pa-s6">
      <ArrowButton
        isLight={type === 'light'}
        onClick={() => {
          if (disableLeftArrow) return
          onClickLeftArrow()
        }}
        disabled={disableLeftArrow}
      >
        {type === 'light' ? <ArrowLeftGIcon /> : <ArrowLeftWIcon />}
      </ArrowButton>
      <ArrowButton
        isLight={type === 'light'}
        onClick={() => {
          if (disableRightArrow) return
          onClickRightArrow()
        }}
        disabled={disableRightArrow}
      >
        {type === 'light' ? <ArrowRightGIcon /> : <ArrowRightWIcon />}
      </ArrowButton>
    </ButtonWrap>
  )
}

DoubleArrowButtons.defaultProps = {
  disableLeftArrow: false,
  disableRightArrow: false,
  // eslint-disable-next-line
  onClickLeftArrow: () => {},
  // eslint-disable-next-line
  onClickRightArrow: () => {},
}

export default DoubleArrowButtons
