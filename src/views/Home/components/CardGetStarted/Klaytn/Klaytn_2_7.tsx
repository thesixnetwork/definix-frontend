/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Link, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-60.png'

const Klaytn_2_7 = ({ title }) => {
  const { t } = useTranslation()
  
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (FINIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('To transfer FINIX to Kaikas. You need to bridge FINIX from BSC network to Klaytn network by using this link.')}
        </Text>

        <Link href="https://bridge.six.network/" target="_blank" className="mb-4">
          https://bridge.six.network/
        </Link>

        <img src={img01} alt="" className="mb-4" />

        <Text fontSize="14px">
          {t('The bridge transaction from BSC network is including with 0.1% FINIX per transaction, the transaction fee will be deducted from your bridge amount automatically.')}
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_2_7)
