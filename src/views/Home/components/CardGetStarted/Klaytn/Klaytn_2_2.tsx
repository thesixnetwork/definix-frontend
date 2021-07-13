/* eslint-disable camelcase */
import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import bsc from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-53.png'
import klaytn from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-54.png'

const CustomButton = styled.img`
  cursor: pointer;
  width: 180px;
  margin: 0 auto;
  display: block;
`

const Klaytn_2_2 = ({ title, onNext, setIsTransferSixFromKlaytn }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('To transfer SIX to Kaikas, It’s have 2 choices')}
        </Text>

        <Text fontSize="14px" className="mb-4">
          {t('Please select a choice')}
        </Text>

        <CustomButton
          src={bsc}
          alt=""
          onClick={() => {
            onNext(1, 2)
            setIsTransferSixFromKlaytn(false)
          }}
          className="mb-3"
        />
        <CustomButton
          src={klaytn}
          alt=""
          onClick={() => {
            onNext(1, 2)
            setIsTransferSixFromKlaytn(true)
          }}
        />
      </div>
    </>
  )
}

export default memo(Klaytn_2_2)
