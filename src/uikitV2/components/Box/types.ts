import { HTMLAttributes } from 'react'
import {
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  GridProps,
} from 'styled-system'
import { ExtendColorProps } from '../../types'

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    HTMLAttributes<HTMLDivElement> {
  textStyle?: string
}

export interface FlexProps extends BoxProps, FlexboxProps {}
export interface GridComponentProps extends BoxProps, GridProps {}
