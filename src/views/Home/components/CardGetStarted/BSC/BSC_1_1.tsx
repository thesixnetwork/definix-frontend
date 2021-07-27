import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Image, Link, Text } from 'uikit-dev'
import chrome from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-05.png'
import metamask from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-06.png'
import addToChrome from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-07.png'
import newMetamask from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-08.png'

const BSC_1_1 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <div className="flex align-center mb-2">
          <Image src={chrome} width={72} height={72} mr="12px" />
          <Text fontSize="14px">
            {t('Open your web browser')} <br />( {t('Google Chrome')} )
          </Text>
        </div>
        <div className="flex align-center mb-4">
          <Image src={metamask} width={72} height={72} mr="12px" />
          <Text fontSize="14px">
            {t('Download and install chrome plugin wallet from this linkMetamask :')}{' '}
            <Link href="https://metamask.io/" target="_blank">
              https://metamask.io/
            </Link>
          </Text>
        </div>

        <img src={addToChrome} alt="" />

        <Text fontSize="14px" className="my-2">
          {t('After install your wallet, select on create a new wallet and seed phase')}
        </Text>

        <img src={newMetamask} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_1_1)
