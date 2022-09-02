import { ExtendColorProps } from '../../types'
import { SpaceProps } from 'styled-system'

export interface LabelProps extends SpaceProps, ExtendColorProps {
  type: string
}

export const labelTypes = {
  NOTI: 'noti',
  TOKEN: 'token',
} as const
