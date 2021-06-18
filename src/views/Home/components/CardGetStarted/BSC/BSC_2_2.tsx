import React, { memo } from 'react'
import { Heading, Link, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-16.png'

const BSC_2_2 = ({ title }) => {
  return (
    <>
      <Heading className="mb-4" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          To transfer SIX to metamask. You need to bridge SIX from Stella (XLM) network to BSC network by using this
          link.
        </Text>
        <Link href="https://bridge.six.network/" target="_blank">
          https://bridge.six.network/
        </Link>
        <img src={img01} alt="" className="mb-4" />
        <Text fontSize="14px">
          The bridge transaction from Stellar network is including with 25 SIX/XLM per transaction, the transaction fee
          will be deducted from your bridge amount automatically.
        </Text>
      </div>
    </>
  )
}

export default memo(BSC_2_2)
