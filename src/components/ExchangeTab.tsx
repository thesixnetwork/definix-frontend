import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { CogIcon, IconButton, useModal } from 'uikit-dev'
import SettingsModal from './PageHeader/SettingsModal'

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  background: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 56px;
`

const Tab = styled(NavLink)<{ active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ theme, active }) => (active ? theme.colors.backgroundBlueGradient : 'transparent')};
  color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.textSubtle)};
  border-right: 1px solid ${({ theme }) => theme.colors.textDisabled};
  width: 33.333%;
  height: 100%;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: ${({ active }) => (active ? '#349BE7' : 'transparent')};
    position: absolute;
    top: 100%;
    left: calc(50% - 8px);
  }

  &:hover {
    color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.primary)};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    padding: 16px;
  }
`

const StyleButton = styled(IconButton)`
  padding: 0 20px !important;
  width: auto;
  background: transparent !important;
  height: 56px;
  width: 56px !important;
  border-radius: 0;
  flex-shrink: 0;

  svg {
    stroke: ${({ theme }) => theme.colors.textSubtle} !important;
  }

  &:hover {
    svg {
      stroke: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

const ExchangeTab = ({ current }) => {
  const [onPresentSettings] = useModal(<SettingsModal />)

  return (
    <Tabs>
      <Tab to="/swap" active={current === '/swap'}>
        SWAP TOKEN
      </Tab>
      <Tab to="/liquidity" active={current === '/liquidity'}>
        LIQUIDITY
      </Tab>
      <Tab as="a" href="https://bridge.six.network" target="_blank" active={current === '/bridge'}>
        BRIDGE
      </Tab>
      <StyleButton variant="text" onClick={onPresentSettings} title="Settings">
        <CogIcon />
      </StyleButton>
    </Tabs>
  )
}

export default ExchangeTab
