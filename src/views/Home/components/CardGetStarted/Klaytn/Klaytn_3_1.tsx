/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import connect from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-19.png'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-64.png'

const Klaytn_3_1 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-2">
          {t('To use DEFINIX, you need to connect your wallet to the platform easily by press on this button.')}
        </Text>

        <img src={connect} alt="" width="200px" />

        <Text fontSize="14px" className="mb-4">
          {t('Keep in mind that on every transaction, you need KLAY to pay for a gas price.')}
          <br />
          {t('Please prepare enough KLAY in your wallet. These tokens can be swap in DEFINIX.')}
        </Text>

        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_3_1)
