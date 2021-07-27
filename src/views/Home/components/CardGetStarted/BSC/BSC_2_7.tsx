import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'

const BSC_2_7 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px">{t('Now you have all required tokens. Let’s advance to the next step.')}</Text>
      </div>
    </>
  )
}

export default memo(BSC_2_7)
