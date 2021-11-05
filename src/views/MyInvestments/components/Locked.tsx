import React from 'react'
import { Text } from 'uikit-dev'
import useI18n from 'hooks/useI18n'

const Locked = () => {
  const TranslateString = useI18n()
  return (
    <Text fontSize="24px !important" color="textDisabled" style={{ lineHeight: '76px' }}>
      {TranslateString(298, 'Locked')}
    </Text>
  )
}
export default Locked
