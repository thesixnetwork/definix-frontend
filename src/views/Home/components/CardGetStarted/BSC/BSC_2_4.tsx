import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-18.png'

const BSC_2_4 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t(
            'After confirmation, QR code will be generated from the system. You have to use these address and memo text as a destination when transfer from exchange platform.',
          )}
        </Text>
        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_2_4)
