import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-17.png'

const BSC_2_3 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('Enter your email address and amount then copy your wallet address from metamask into “Destination” field.')}
        </Text>
        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_2_3)
