import React from 'react'
import styled from 'styled-components'
import { Button, Heading } from '../../../uikit-dev'

interface CardTabType {
  menus: string[]
  current?: number
  setCurrent?: (idx: number) => void
  currentTabHeader?: number
  setCurrentTabHeader?: (idx: number) => void
  className?: string
  isHeader: boolean
}

const Tabs = styled.div`
  display: flex;
  align-items: center;
`

const Tab = styled(Button)<{ active: boolean }>`
  display: flex;
  font-size: 0.875rem;
  padding: 1.5rem 0rem;
  justify-content: center;
  background: transparent !important;
  color: ${({ theme, active }) => (active ? '#30ADFF' : theme.colors.textSubtle)} !important;
  border-bottom: ${({ active }) => active && '0.25rem solid #30ADFF'} !important;
  border-radius: 0;

  &:hover {
    color: ${({ theme, active }) => (active ? '#30ADFF' : theme.colors.primary)} !important;
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 0.875rem;
    width: 30%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 0.775rem;
    padding: 1.5rem 1rem;
    width: 30%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 0.875rem;
    width: 16%;
  }
`

const CardTab: React.FC<CardTabType> = ({
  menus,
  current,
  setCurrent,
  currentTabHeader,
  setCurrentTabHeader,
  className,
  isHeader,
}) => {
  return (
    <Tabs className={className}>
      {isHeader && (
        <Heading className="pr-5" fontSize="26px !important">
          Proposals
        </Heading>
      )}
      {isHeader
        ? menus.map((m, idx) => (
            <Tab
              className="pa-6"
              onClick={() => {
                if (currentTabHeader !== idx) {
                  setCurrentTabHeader(idx)
                }
              }}
              active={currentTabHeader === idx}
            >
              {m}
            </Tab>
          ))
        : menus.map((m, idx) => (
            <Tab
              onClick={() => {
                if (current !== idx) {
                  setCurrent(idx)
                }
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
