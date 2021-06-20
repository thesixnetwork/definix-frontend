/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-63.png'

const Klaytn_2_4_klaytn = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          In Coinone (Exchange) You have to enter amount and then copy your wallet address from Kaikas wallet into
          “Withdrawal address” field.
        </Text>

        <img src={img01} alt="" className="mb-4" />

        <Text fontSize="14px">
          After finish the process, please wait a minutes. You will recieve SIX in your Kaikas wallet automatically.
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_2_4_klaytn)
