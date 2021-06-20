/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-72.png'

const Klaytn_4_3 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          Select{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            FINIX-SIX LP
          </Text>{' '}
          and press{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            Approve contract
          </Text>{' '}
          button. ( This process require KLAY as a gas fee )
        </Text>
        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_4_3)
