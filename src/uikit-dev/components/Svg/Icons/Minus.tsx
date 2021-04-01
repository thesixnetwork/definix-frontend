import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 14 1.2" {...props}>
      <path
        d="M13.2,1H1.2C.65,1,.2.775.2.5S.65,0,1.2,0h12c.55,0,1,.225,1,.5S13.75,1,13.2,1Z"
        transform="translate(-0.2)"
      />
    </Svg>
  )
}

export default Icon
