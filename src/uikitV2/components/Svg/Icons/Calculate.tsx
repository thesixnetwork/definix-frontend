import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 16 16" {...props}>
      <g fill="none" fill-rule="evenodd">
        <rect fill="#5E515F" width="16" height="16" rx="3.2"></rect>
        <path
          d="M4.16 5.44H6.8m-2.64 4.715h2.71M5.516 8.8v2.71m4.403-6.872l1.917 1.917m0-1.917L9.918 6.555M9.6 9.04H12m-2.4 2.4H12"
          stroke="#FFF"
          stroke-width="1.28"
          stroke-linecap="round"
        ></path>
      </g>
    </Svg>
  )
}

export default Icon
