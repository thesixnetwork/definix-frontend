/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-50.png'

const Klaytn_1_3 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          Press Start Kaikas.
        </Text>
        <img src={img01} alt="" className="mb-4" />
        <Text fontSize="14px" className="mb-4">
          Now your wallet is ready to use on DEFINIX.
        </Text>
        <Text fontSize="14px" className="mb-4">
          Every transaction on DEFINIX on Klaytn require KLAY to pay for a gas fee. Make sure you have enough KLAY to
          pay for it.
        </Text>
        <Text fontSize="14px" className="mb-6">
          Now you are ready to proceed to next step. Transfer your token from exchange to your wallet.
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_1_3)
