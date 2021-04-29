import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronUpIcon, ChevronDownIcon } from '../../components/Svg'
import { MENU_ENTRY_HEIGHT } from './config'
import { LinkLabel, MenuEntry } from './MenuEntry'
import { PushedProps } from './types'

interface Props extends PushedProps {
  label: string
  icon: React.ReactElement
  initialOpenState?: boolean
  className?: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // Safari fix
  flex-shrink: 0;
`

const AccordionContent = styled.div<{ isOpen: boolean; isPushed: boolean; maxHeight: number }>`
  max-height: ${({ isOpen, maxHeight }) => (isOpen ? `${maxHeight}px` : 0)};
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Accordion: React.FC<Props> = ({
  label,
  icon,
  isPushed,
  pushNav,
  initialOpenState = false,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpenState)

  const handleClick = () => {
    if (isPushed) {
      setIsOpen((prevState) => !prevState)
    } else {
      pushNav(true)
      setIsOpen(true)
    }
  }

  return (
    <Container>
      <MenuEntry onClick={handleClick} className={className} style={{ border: 'none' }}>
        {icon}
        <LinkLabel isPushed={isPushed}>{label}</LinkLabel>
        {isOpen ? <ChevronUpIcon className="ml-1" /> : <ChevronDownIcon className="ml-1" />}
      </MenuEntry>
      <AccordionContent
        isOpen={isOpen}
        isPushed={isPushed}
        maxHeight={React.Children.count(children) * MENU_ENTRY_HEIGHT}
      >
        {children}
      </AccordionContent>
    </Container>
  )
}

export default Accordion
