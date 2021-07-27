import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-12.png'

const BSC_1_4 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('Input network information follow the picture below.')}
        </Text>
        <img src={img} alt="" />
        <Text fontSize="14px" textAlign="center">
          {t('Click on Save button to complete')}
        </Text>
      </div>
    </>
  )
}

export default memo(BSC_1_4)
