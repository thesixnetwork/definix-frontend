import React from 'react'
import Link from './Link'
import { LinkProps } from './types'
import OpenNewIcon from '../Svg/Icons/OpenNew'

const LinkExternal: React.FC<LinkProps> = ({ children, isIconLeft, ...props }) => {
  return (
    <Link external {...props}>
      {isIconLeft && <OpenNewIcon color="primary" mr="8px" />}
      {children}
      {!isIconLeft && <OpenNewIcon color="primary" ml="4px" />}
    </Link>
  )
}

export default LinkExternal
