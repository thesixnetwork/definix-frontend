/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Image, Text } from 'uikit-dev'
import chrome from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-44.png'
import kaikas from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-45.png'
import addToChrome from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-46.png'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-47.png'
import img02 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-48.png'

const Klaytn_1_1 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <div className="flex align-center mb-2">
          <Image src={chrome} width={72} height={72} mr="12px" />
          <Text fontSize="14px">
            {t('Open your web browser')} <br />( {t('Google Chrome')} )
          </Text>
        </div>
        <div className="flex align-center mb-2">
          <Image src={kaikas} width={72} height={72} mr="12px" />
          <Text fontSize="14px">{t('Download and install Kaikas wallet (chrome plugin)')}</Text>
        </div>

        <img src={addToChrome} alt="" />

        <Text fontSize="14px" className="my-4">
          {t('After install your wallet, please create and confirm your password.')}
        </Text>

        <img src={img01} alt="" />

        <Text fontSize="14px" className="my-4">
          {t('Enter your account nickname.')}
        </Text>

        <img src={img02} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_1_1)
