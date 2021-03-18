import React from 'react'
import styled from 'styled-components'
import { SIDEBAR_WIDTH_FULL, SIDEBAR_WIDTH_REDUCED } from './config'
import PanelBody from './PanelBody'
import { PanelProps, PushedProps } from './types'
import { Login } from '../WalletModal/types'

interface Props extends PanelProps, PushedProps {
  showMenu: boolean
  isMobile: boolean
  account?: string
  login: Login
  logout: () => void
}

const StyledPanel = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.white};

  position: absolute;
  top: 0;
  left: 0;

  ${({ theme }) => theme.mediaQueries.nav} {
    position: relative;

    background-color: rgba(255, 255, 255, 0.7);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  width: ${({ isPushed }) => (isPushed ? `${SIDEBAR_WIDTH_FULL}px` : 0)};
  height: 100%;
  z-index: 11;
  transition: padding-top 0.2s, width 0.2s;
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-top: none;
  border-bottom: none;
  overflow: ${({ isPushed }) => (isPushed ? 'initial' : 'hidden')};
  transform: translate3d(0, 0, 0);
  // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  ${({ theme }) => theme.mediaQueries.nav} {
    // width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
    width: ${SIDEBAR_WIDTH_FULL}px;
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
