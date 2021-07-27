import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import click from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-10.png'
import select from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-11.png'

const BSC_1_3 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t(
            'Now your wallet is ready to use. but DEFINIX is run on Binance smart chain. You have to change your network first.',
          )}
        </Text>
        <img src={click} alt="" />
        <Text fontSize="14px" className="mb-4" textAlign="center">
          {t('Click here to change')}
        </Text>
        <img src={select} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_1_3)
