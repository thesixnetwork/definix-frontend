import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-43.png'

const BSC_4_5 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('The last step is to deposit your LP into this farm by enter an amount of your LP and press')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block" style={{ lineHeight: 1 }}>
            {t('Deposit')} SIX-FINIX LP
          </Text>{' '}
          {t('button ( Require BNB for a gas price )')}
        </Text>

        <img src={img01} alt="" className="mb-6" />

        <Text fontSize="14px">
          <Text fontSize="14px" color="primary" className="dis-in-block" style={{ lineHeight: 1 }}>
            {t('CONGRATULATION!!')}
          </Text>{' '}
          {t('Now you have your first farm running!! You can check your ROI from the dashboard on homepage.')}
        </Text>
      </div>
    </>
  )
}

export default memo(BSC_4_5)
