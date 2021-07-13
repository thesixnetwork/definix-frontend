/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'

const Klaytn_4_2 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('Now you can select the token you want to pair from “Select Token” dropdown menu')}
          <br />
          {t('The system will auto-calculate the amount of pair token automatically.')}
        </Text>

        <Text fontSize="14px" className="mb-4">
          {t('After that you need to “Approve contract” by press on')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            {t('Approve')}
          </Text>{' '}
          {t('button.')}
        </Text>

        <Text fontSize="14px" className="mb-4">
          {t('Once you already approve contract, you have to press on')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            {t('Deposit')}
          </Text>{' '}
          {t('button again to pair liquidity.')}
        </Text>

        <Text fontSize="14px" className="mb-4">
          {t('The')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            FINIX-SIX LP
          </Text>{' '}
          {t('will be send directly into your wallet.')}
        </Text>

        <Text fontSize="14px">
          {t('Now you are ready to start your first farm. Go to')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            {t('Yield farming')}
          </Text>{' '}
          {t('on menu bar and select')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            {t('Farm')}
          </Text>
          .
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_4_2)
