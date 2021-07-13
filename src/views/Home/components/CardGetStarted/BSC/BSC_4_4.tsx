import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-42.png'

const BSC_4_4 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('After approve contract, The interface will be changed. You have to stake your LP into this farm by press on')}{' '}
          <Text fontSize="18px" bold color="primary" className="dis-in-block" style={{ lineHeight: 1 }}>
            +
          </Text>{' '}
          {t('button.')}
        </Text>

        <img src={img01} alt="" className="mb-6" />

        <Text fontSize="14px">{t('In the future, if you want to remove your LP. You can remove by press on - button instead. The removed LP will be send to your wallet.')}
        </Text>
      </div>
    </>
  )
}

export default memo(BSC_4_4)
