/* eslint-disable camelcase */
import React, { memo } from 'react'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-51.png'
import six from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-15.png'
import finix from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-52.png'

const CustomButton = styled.img`
  cursor: pointer;
  width: 120px;
  margin: 0 8px;
`

const Klaytn_2_1 = ({ title, onNext, setIsTransferSixFromKlaytn }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          You need a wallet address to transfer token to your wallet (Kaikas). Your address will be shown at the upper
          part of Kaikas as a picture below.
        </Text>
        <img src={img01} alt="" className="mb-4" />
        <Text fontSize="14px" className="mb-3">
          Please select a token you want to transfer
        </Text>
        <div className="flex align-center justify-center">
          <CustomButton
            src={six}
            alt=""
            onClick={() => {
              onNext(1, 1)
              setIsTransferSixFromKlaytn(false)
            }}
          />
          <CustomButton
            src={finix}
            alt=""
            onClick={() => {
              onNext(1, 6)
              setIsTransferSixFromKlaytn(false)
            }}
          />
        </div>
      </div>
    </>
  )
}

export default memo(Klaytn_2_1)
