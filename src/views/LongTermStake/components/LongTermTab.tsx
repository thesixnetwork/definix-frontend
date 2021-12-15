import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  height: 48px;
  border-radius: 8px;
`

const Tab = styled(NavLink)<{ active: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ theme, active }) =>
    // eslint-disable-next-line no-nested-ternary
    active === 'true' && theme.isDark
      ? theme.colors.primary
      : // eslint-disable-next-line no-nested-ternary
      active === 'true' && !theme.isDark
      ? theme.colors.primary
      : !(active === 'true') && !theme.isDark
      ? '#fff'
      : '#2E2F30'};
  color: ${({ theme, active }) =>
    // eslint-disable-next-line no-nested-ternary
    active === 'true' && theme.isDark
      ? theme.colors.white
      : // eslint-disable-next-line no-nested-ternary
      active === 'true' && !theme.isDark
      ? theme.colors.white
      : !(active === 'true') && !theme.isDark
      ? '#2E2F30'
      : '#737375'};
  width: 23.333%;
  height: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  &.bg-primary {
    background: ${({ theme }) => theme.colors.primary};
  }

  &.bg-secondary {
    background: #2e2f30;
  }

  &:before {
    content: '';
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: ${({ active }) => (active === 'true' ? '#349BE7' : 'transparent')};
    position: absolute;
    top: 100%;
    left: calc(50% - 8px);
  }

  &:hover {
    color: ${({ theme, active }) => (active === 'true' ? theme.colors.white : theme.colors.primary)};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    padding: 16px;
  }
`

const LongTermTab = ({ current }) => {
  return (
    <Tabs>
      <Tab className="ml-2" to="/long-term-stake" active={(current === '/long-term-stake').toString()}>
        Long-term Stake
      </Tab>
      <Tab className="ml-2" to="/long-term-stake/top-up" active={(current === '/long-term-stake/top-up').toString()}>
        Super Stake
      </Tab>
    </Tabs>
  )
}

export default LongTermTab
