/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-57.png'

const Klaytn_2_5 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          After confirmation, QR code will be generated from the system. You have to use these address and memo text as
          a destination when transfer from exchange platform.
        </Text>

        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_2_5)
