/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Text, Heading, Image, useMatchBreakpoints, Flex } from 'uikit-dev'
import copyWhite from 'uikit-dev/images/for-ui-v2/nft/copy-white.png'
import copyBlack from 'uikit-dev/images/for-ui-v2/nft/copy-black.png'

interface Props {
  toCopy: string
  noPadding?: boolean
  noText?: boolean
  color?: string
  tooltipPos?: string
  iconWidth?: string
}

const StyleButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 0;
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean; tooltipPos?: string }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'block' : 'none')};
  position: absolute;

  top: ${({ tooltipPos }) => (tooltipPos === 'top' ? 'auto' : tooltipPos === 'bottom' ? 'calc(100% + 8px)' : '50%')};
  left: ${({ tooltipPos }) => (tooltipPos === 'left' ? 'auto' : tooltipPos === 'right' ? 'calc(100% + 8px)' : '50%')};
  bottom: ${({ tooltipPos }) => (tooltipPos === 'top' ? 'calc(100% + 8px)' : 'auto')};
  right: ${({ tooltipPos }) => (tooltipPos === 'left' ? 'calc(100% + 8px)' : 'auto')};
  transform: ${({ tooltipPos }) =>
    tooltipPos === 'top' || tooltipPos === 'bottom' ? 'translate(-50%, 0)' : 'translate(0, -50%)'};

  z-index: 1;
  width: 80px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: ${({ theme }) => theme.radii.default};
  opacity: 0.7;
  padding: 4px 8px;
  font-size: 12px;
`

const CopyToClipboard: React.FC<Props> = ({
  toCopy,
  children,
  noPadding = false,
  noText = false,
  color,
  tooltipPos = 'bottom',
  iconWidth = '20px',
  ...props
}) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  return (
    <>
      <StyleButton
        onClick={() => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(toCopy)
            setIsTooltipDisplayed(true)
            setTimeout(() => {
              setIsTooltipDisplayed(false)
            }, 1000)
          }
        }}
      >
        <Image src={copyWhite} width={20} height={18} />
      </StyleButton>
    </>
  )
}

export default CopyToClipboard
