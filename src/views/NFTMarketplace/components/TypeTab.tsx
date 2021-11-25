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

const Tab = styled(NavLink)<{ active: boolean }>`
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
    active && theme.isDark
      ? theme.colors.primary
      : // eslint-disable-next-line no-nested-ternary
      active && !theme.isDark
      ? theme.colors.primary
      : !active && !theme.isDark
      ? '#fff'
      : '#2E2F30'};
  color: ${({ theme, active }) =>
    // eslint-disable-next-line no-nested-ternary
    active && theme.isDark
      ? theme.colors.white
      : // eslint-disable-next-line no-nested-ternary
      active && !theme.isDark
      ? theme.colors.white
      : !active && !theme.isDark
      ? '#2E2F30'
      : '#737375'};
  width: 14.333%;
  height: 100%;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;

  &.bg-primary {
    background: ${({ theme }) => theme.colors.primary};
  }

  &.bg-secondary {
    background: #2e2f30;
  }

  &:hover {
    color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.primary)};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    height: auto;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 16px;
    height: auto;
    width: 140px;
  }
`

const TypeTab = ({ current }) => {
  return (
    <Tabs className="mb-5">
      <Tab to="/NFT" active={current === '/NFT'}>
        My NFT
      </Tab>
      <Tab className="ml-2" to="/NFT/market-place" active={current === '/NFT/market-place'}>
        Marketplace
      </Tab>
    </Tabs>
  )
}

export default TypeTab
