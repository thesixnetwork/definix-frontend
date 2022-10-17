import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path
        d="M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17zm0 9.278a4.667 4.667 0 00-4.661 4.444A6.972 6.972 0 0012 19c1.87 0 3.569-.733 4.824-1.928l-.163.15A4.666 4.666 0 0012 12.779zm0-5.445A2.333 2.333 0 1012 12a2.333 2.333 0 000-4.667z"
        fill="#FFF"
        fill-rule="evenodd"
      ></path>
    </Svg>
  )
}

export default Icon
