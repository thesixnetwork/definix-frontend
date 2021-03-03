import React from 'react'
import arrow from '../../../images/arrow-right.png'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return <img src={arrow} alt="" style={{ height: '12px' }} {...props} />
}

export default Icon
