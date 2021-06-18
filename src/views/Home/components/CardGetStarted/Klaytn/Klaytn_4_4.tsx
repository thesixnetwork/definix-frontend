/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-73.png'

const Klaytn_4_4 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          After approve contract, The interface will be changed. You have to stake your LP into this farm by press on{' '}
          <Text fontSize="18px" bold color="primary" className="dis-in-block" style={{ lineHeight: 1 }}>
            +
          </Text>{' '}
          button.
        </Text>

        <img src={img01} alt="" className="mb-6" />

        <Text fontSize="14px">
          In the future, if you want to remove your LP. You can remove by press on - button instead. The removed LP will
          be send to your wallet.
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_4_4)
