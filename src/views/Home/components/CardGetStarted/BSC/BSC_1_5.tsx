import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-13.png'

const BSC_1_5 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('Binance smart chain is already added to your network. Now your wallet is ready to use on DEFINIX.')}
        </Text>
        <img src={img01} alt="" />
        <Text fontSize="14px" className="mb-4">
          {t(
            'Every transaction on DEFINIX on BSC require BNB to pay for a gas fee. Make sure you have enough BNB to pay for it.',
          )}
        </Text>
        <Text fontSize="14px">
          {t('Now you are ready to proceed to next step. Transfer your token from exchange to your wallet.')}
        </Text>
      </div>
    </>
  )
}

export default memo(BSC_1_5)
