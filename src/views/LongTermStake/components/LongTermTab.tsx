import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { CogIcon, IconButton, useModal } from '../../../uikit-dev'

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  //   background: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 48px;
  border-radius: 8px;
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
  background: ${({ theme, active }) => (active ? theme.colors.primary : '#979797')};
  color: ${({ theme, active }) => (active ? theme.colors.white : '#737375')};
  border-right: 1px solid ${({ theme }) => theme.colors.textDisabled};
  width: 23.333%;
  height: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

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

const LongTermTab = ({ current }) => {
  return (
    <Tabs>
      <Tab className="ml-2" to="/long-term-stake" active={current === '/long-term-stake'}>
        Long-term Stake
      </Tab>
      <Tab className="ml-2" to="/long-term-stake/top-up" active={current === '/long-term-stake/top-up'}>
        Super Stake
      </Tab>
    </Tabs>
  )
}

export default LongTermTab
