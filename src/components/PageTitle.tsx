import React, { useMemo } from 'react'
import { Text, TextProps } from '@fingerlabs/definixswap-uikit-v2'

interface PageTitleType extends TextProps {
  text: string
  desc?: string
  small?: boolean
}

const PageTitle: React.FC<PageTitleType> = ({ text, desc, small, ...props }) => {
  const size = useMemo(
    () =>
      small
        ? {
            text: 'R_23B',
            desc: 'R_12R',
            mb: 'S_28',
          }
        : {
            text: 'R_32B',
            desc: 'R_18R',
            mb: 'S_40',
          },
    [small],
  )
  return (
    <>
      <Text as="h2" textStyle={size.text} mb={desc ? 'S_8' : size.mb} {...props}>
        {text}
      </Text>
      {desc && (
        <Text textStyle={size.desc} mb={size.mb} color="textSubtle" {...props}>
          {desc}
        </Text>
      )}
    </>
  )
}

export default PageTitle
