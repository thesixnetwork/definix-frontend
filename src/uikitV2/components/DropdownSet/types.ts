import { TextStyles } from '../../text'
import { HTMLAttributes } from 'react'
import { LayoutProps, PositionProps as SPositionProps } from 'styled-system'
export type Position = 'top' | 'bottom'
export type Scale = 'sm' | 'md'

export const scales: Record<
  Scale,
  {
    textStyle: TextStyles
    activeTextStyle: TextStyles
  }
> = {
  sm: {
    textStyle: TextStyles.R_12R,
    activeTextStyle: TextStyles.R_12R,
  },
  md: {
    textStyle: TextStyles.R_14R,
    activeTextStyle: TextStyles.R_14M,
  },
}

export interface PositionProps {
  position?: Position
}

export interface DropdownOption {
  id: string | number
  label: string
  [key: string]: any
}

export interface DropdownSetProps extends PositionProps, Omit<SPositionProps, 'position'>, LayoutProps {
  scale?: Scale
  options: DropdownOption[]
  isOpen: boolean
  activeIndex: number
  onButtonClick: () => void
  onOptionClick: (index: number) => void
}

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean
  isDivide?: boolean
  scale?: Scale
}
