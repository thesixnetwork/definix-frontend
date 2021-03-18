import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg width="24" height="18" viewBox="0 0 24 18" {...props}>
      <g transform="translate(-64 130.002) rotate(-90)">
        <path
          d="M120.709,67.795l-3.5-3.5a1,1,0,0,0-1.414,0l-3.5,3.5a1,1,0,0,0,1.414,1.414l1.793-1.793V87a1,1,0,1,0,2,0V67.416l1.793,1.793a1,1,0,0,0,1.414-1.414Z"
          transform="translate(0 -0.002)"
          fill="#404041"
        />
        <path
          d="M264.709,82.793a1,1,0,0,0-1.414,0L261.5,84.586V65a1,1,0,1,0-2,0V84.586l-1.793-1.793a1,1,0,1,0-1.414,1.414l3.5,3.5a1,1,0,0,0,1.414,0l3.5-3.5a1,1,0,0,0,0-1.414Z"
          transform="translate(-135 0)"
          fill="#404041"
        />
      </g>
    </Svg>
  )
}

export default Icon
