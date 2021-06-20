/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import styled from 'styled-components'
import { CopyIcon } from '../../components/Svg'
import Text from '../../components/Text/Text'

interface Props {
  toCopy: string
  noPadding?: boolean
  noText?: boolean
  color?: string
  tooltipPos?: string
}

const StyleButton = styled(Text).attrs({ role: 'button' })<{ noPadding: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${(props) => (props.noPadding ? '0 !important' : 'initial')};
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
  ...props
}) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  return (
    <StyleButton
      small
      bold
      onClick={() => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(toCopy)
          setIsTooltipDisplayed(true)
          setTimeout(() => {
            setIsTooltipDisplayed(false)
          }, 1000)
        }
      }}
      noPadding={noPadding}
      {...props}
    >
      <CopyIcon width="20px" color={color || 'primary'} mr={noText ? '' : '8px'} />
      {children}
      <Tooltip isTooltipDisplayed={isTooltipDisplayed} tooltipPos={tooltipPos}>
        Copied
      </Tooltip>
    </StyleButton>
  )
}

export default CopyToClipboard
