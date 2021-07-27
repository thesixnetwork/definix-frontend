/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Link, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-55.png'

const Klaytn_2_3 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t(
            'To transfer SIX to Kaikas. You need to bridge SIX from Stella (XLM) network to Klaytn network by using this link.',
          )}
        </Text>

        <Link href="https://bridge.six.network/" target="_blank" className="mb-4">
          https://bridge.six.network/
        </Link>

        <img src={img01} alt="" className="mb-4" />

        <Text fontSize="14px">
          {t(
            'The bridge transaction from Stellar network is including with 25 SIX/XLM per transaction, the transaction fee will be deducted from your bridge amount automatically.',
          )}
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_2_3)
