import React, { useMemo } from 'react'
import { Text, TextProps } from 'definixswap-uikit'

interface PageTitleType extends TextProps {
  text: string
  small?: boolean
}

const PageTitle: React.FC<PageTitleType> = ({ text, small, ...props }) => {
  const size = useMemo(
    () =>
      small
        ? {
            text: 'R_23B',
            mb: 'S_28',
          }
        : {
            text: 'R_32B',
            mb: 'S_40',
          },
    [small],
  )
  return (
    <Text as="h2" textStyle={size.text} mb={size.mb} {...props}>
      {text}
    </Text>
  )
}

export default PageTitle
