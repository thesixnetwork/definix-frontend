import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-22.png'

const BSC_2_6 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (BNB)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('To transfer BNB to metamask. You need Binance account and BNB coin.')}
        </Text>

        <Text fontSize="16px" color="failure" bold>
          {t('IMPORTANT !!')}
        </Text>
        <Text fontSize="14px">{t('Enter your Metamask address and select network to BEP20(BSC).')}</Text>
        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_2_6)
