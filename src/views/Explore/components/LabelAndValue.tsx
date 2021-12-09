import React from 'react'
import { Flex, FlexProps, Text } from 'definixswap-uikit-v2'
import SignNumber from './SignNumber'

interface LableAndValueType extends FlexProps {
  label: string
  value: number | string
  signValue?: number
}

const LableAndValue: React.FC<LableAndValueType> = ({ label, value, signValue, ...props }) => {
  return (
    <Flex {...props}>
      <Text textStyle="R_14R" color="mediumgrey" className="mr-s8">
        {label}
      </Text>
      {signValue ? (
        <SignNumber textStyle="R_14M" value={signValue}>
          {value}
        </SignNumber>
      ) : (
        <Text textStyle="R_14M" color="deepgrey">
          {value}
        </Text>
      )}
    </Flex>
  )
}

export default LableAndValue
