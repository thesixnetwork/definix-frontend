import React from 'react'
import OpenNewIcon from '../Svg/Icons/OpenNew'
import Text from '../Text/Text'
import Link from './Link'
import { LinkProps } from './types'

const LinkExternal: React.FC<LinkProps> = ({ children, isIconLeft, ...props }) => {
  const { fontSize } = props
  return (
    <Link external {...props} style={{ textDecoration: 'underline' }}>
      {isIconLeft && <OpenNewIcon color="primary" className="mr-2" />}
      <Text fontSize={fontSize} fontWeight="bold" color="primary">
        {children}
      </Text>
      {!isIconLeft && <OpenNewIcon color="primary" className="ml-2" />}
    </Link>
  )
}

export default LinkExternal
