import React from 'react'
import styled from 'styled-components'
import { Button } from 'uikit-dev'

interface CardTabType {
  menus: string[]
  current: number
  setCurrent: (idx: number) => void
  className?: string
}

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  background: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 56px;
`

const Tab = styled(Button)<{ active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ theme, active }) => (active ? theme.colors.backgroundBlueGradient : 'transparent')} !important;
  color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.textSubtle)} !important;
  width: 33.333%;
  height: 100%;
  border-radius: 0;
  flex-grow: 1;

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
    color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.primary)} !important;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    padding: 16px;
  }
`

const CardTab: React.FC<CardTabType> = ({ menus, current, setCurrent, className }) => {
  return (
    <Tabs className={className}>
      {menus.map((m, idx) => (
        <Tab
          onClick={() => {
            setCurrent(idx)
          }}
          active={current === idx}
        >
          {m}
        </Tab>
      ))}
    </Tabs>
  )
}

export default CardTab
