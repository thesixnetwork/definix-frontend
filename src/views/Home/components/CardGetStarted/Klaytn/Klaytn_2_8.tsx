/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import connect from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-19.png'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-61.png'

const Klaytn_2_8 = ({ title }) => {
  const { t } = useTranslation()
  
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (FINIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-2">
          {t('In SIX Bridge, you have to connect wallet')}
        </Text>

        <img src={connect} alt="" width="200px" />

        <Text fontSize="14px" className="mb-4">
          {t('and then you have to copy your wallet address from Kaikas into “Destination” field.')}
        </Text>

        <Text fontSize="14px" className="mb-4">
          {t('After the Destination address, you must enter amount of FINIX')}
        </Text>

        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_2_8)
