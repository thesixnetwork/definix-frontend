import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M18,13H6a1,1,0,0,1,0-2H18a1,1,0,0,1,0,2Z" />
    </Svg>
  )
}

export default Icon
