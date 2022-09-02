import { Colors } from '../../types'
import { HTMLAttributes } from 'react'
import { BackgroundProps, BorderProps, LayoutProps, PositionProps, SpaceProps } from 'styled-system'

export const scales = {
  SM: 'sm',
  MD: 'md',
} as const

export type Scales = typeof scales[keyof typeof scales]

export interface CheckboxProps {
  scale?: Scales
  variantColor?: keyof Colors
}

export interface CheckboxLabelProps
  extends BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    HTMLAttributes<HTMLLabelElement> {
  control: React.ReactNode
  children: React.ReactNode
}
