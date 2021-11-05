import React, { useMemo } from 'react'
import { Text, TextProps } from 'definixswap-uikit'

interface SingType extends TextProps {
  value?: number;
}

const SignNumber: React.FC<SingType> = ({
  value,
  children,
  ...props
}) => {
  const color = useMemo(() => {
    if (! value) return null;
    return value > 0 ? 'green' : 'red';
  }, [value])

  const sign = useMemo(() => {
    if (! value) return '';
    return value > 0 ? '+' : '';
  }, [value])

  return (
    <Text as="span" color={color} {...props}>{sign}{children}</Text>
  )
}

export default SignNumber
