import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-37.png'

const BSC_3_3 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('The routing, minimum received, price impact and fee will be shown at the lower position of the box before you confirm swapping.')}
        </Text>
        <Text fontSize="14px" className="mb-4">
          {t('You can set the slippage tolerance from the setting icon at the top-right corner. ( default setting is 0.1% )')}
        </Text>
        <Text fontSize="14px" className="mb-4">
          {t('*Prepare your BNB to be a gas fee.')}
        </Text>
        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_3_3)
