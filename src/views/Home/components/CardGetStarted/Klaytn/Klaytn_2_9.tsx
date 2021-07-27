/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'

const Klaytn_2_9 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t(
            'After finish the process, please wait 10-20 minutes. You will recieve FINIX in your Kaikas wallet automatically.',
          )}
        </Text>

        <Text fontSize="14px">{t('Now you have all required tokens. Let’s advance to the next step.')}</Text>
      </div>
    </>
  )
}

export default memo(Klaytn_2_9)
