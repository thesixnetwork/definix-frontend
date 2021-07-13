/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-72.png'

const Klaytn_4_3 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('Select')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            FINIX-SIX LP
          </Text>{' '}
          {t('and press')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            {t('Approve contract')}
          </Text>{' '}
          {t('button. ( This process require KLAY as a gas fee )')}
        </Text>
        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_4_3)
