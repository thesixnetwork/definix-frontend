import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-17.png'

const BSC_2_3 = ({ title }) => {
  return (
    <>
      <Heading className="mb-4" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          Enter your email address and amount then copy your wallet address from metamask into “Destination” field.
        </Text>
        <img src={img01} alt="" className="mb-4" />
      </div>
    </>
  )
}

export default memo(BSC_2_3)
