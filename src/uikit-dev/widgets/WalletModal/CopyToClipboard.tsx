import React, { useState } from 'react'
import styled from 'styled-components'
import { CopyIcon } from '../../components/Svg'
import Text from '../../components/Text/Text'

interface Props {
  toCopy: string
  noPadding?: boolean
}

const StyleButton = styled(Text).attrs({ role: 'button' })<{ noPadding: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${(props) => (props.noPadding ? '0 !important' : 'initial')};
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'block' : 'none')};
  position: absolute;
  bottom: -22px;
  right: 0;
  left: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: ${({ theme }) => theme.radii.default};
  opacity: 0.7;
`

const CopyToClipboard: React.FC<Props> = ({ toCopy, children, noPadding = false, ...props }) => {
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
      <CopyIcon width="20px" color="primary" mr="8px" />
      {children}
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
    </StyleButton>
  )
}

export default CopyToClipboard
