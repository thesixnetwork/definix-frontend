import React from 'react'
import styled from 'styled-components'
import { SIDEBAR_WIDTH_FULL, SIDEBAR_WIDTH_REDUCED } from './config'
import PanelBody from './PanelBody'
import { PanelProps, PushedProps } from './types'

interface Props extends PanelProps, PushedProps {
  showMenu: boolean
  isMobile: boolean
}

const StyledPanel = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.nav.background};
  width: ${({ isPushed }) => (isPushed ? `${SIDEBAR_WIDTH_FULL}px` : 0)};
  height: 100%;
  z-index: 11;
  transition: padding-top 0.2s, width 0.2s;
  // border-right: ${({ isPushed }) => (isPushed ? `1px solid ${({ theme }) => theme.colors.border}` : 0)};
  overflow: ${({ isPushed }) => (isPushed ? 'initial' : 'hidden')};
  transform: translate3d(0, 0, 0);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  ${({ theme }) => theme.mediaQueries.nav} {
    // border-right: 1px solid ${({ theme }) => theme.colors.border};
    width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
`

const Panel: React.FC<Props> = (props) => {
  const { isPushed, showMenu } = props
  return (
    <StyledPanel isPushed={isPushed} showMenu={showMenu}>
      <PanelBody {...props} />
      {/* <PanelFooter {...props} /> */}
    </StyledPanel>
  )
}

export default Panel
