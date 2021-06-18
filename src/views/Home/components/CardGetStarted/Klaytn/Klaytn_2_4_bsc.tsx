/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-56.png'

const Klaytn_2_4 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          Enter your email address and amount then copy your wallet address from metamask into “Destination” field.
        </Text>

        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_2_4)
