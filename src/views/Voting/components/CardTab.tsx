import React from 'react'
import styled from 'styled-components'
import { useAllProposalOfType } from '../../../hooks/useVoting'
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
  padding: 1.5rem 0rem 1.5rem 0rem;
  justify-content: center;
  background: transparent !important;
  color: ${({ theme, active }) => (active ? '#30ADFF' : theme.colors.textSubtle)} !important;
  border-bottom: ${({ theme, active }) => active && '0.25rem solid #30ADFF'} !important;
  width: 10%;
  border-radius: 0;

  &:hover {
    color: ${({ theme, active }) => (active ? '#30ADFF' : theme.colors.primary)} !important;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
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
  const allProposal = useAllProposalOfType()
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
