import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { CogIcon, IconButton, useModal } from '../../../uikit-dev'

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  //   background: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 48px;
  border-radius: 8px;
`
// const renderApprovalOrStakeButton = () => {
//   return isDark  ? (
//     renderStakeOrInsufficient()
//   ) : (
//       <Button fullWidth className="align-self-center" radii="small" onClick={handleApprove}>
//         Approve Contract
//       </Button>
//     )
// }

const Tab = styled(NavLink) <{ active: boolean }>`
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
    active && theme.isDark ? theme.colors.primary : active && !theme.isDark ? theme.colors.primary : !active && !theme.isDark ? '#fff' : '#2E2F30'};
  color: ${({ theme, active }) =>
    // eslint-disable-next-line no-nested-ternary
    active && theme.isDark ? theme.colors.white : active && !theme.isDark ? theme.colors.white : !active && !theme.isDark ? '#2E2F30' : '#737375'};
  width: 23.333%;
  height: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  &.bg-primary {
    background: ${({ theme }) => theme.colors.primary};
  }
  
  &.bg-secondary {
    background: #2E2F30;
  }

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

const LongTermTab = ({ current }) => {
  console.log('current ==', current)
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
