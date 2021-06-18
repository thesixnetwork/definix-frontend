import React from 'react'
import { Heading, Image, LinkExternal, Text } from 'uikit-dev'
import chrome from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-05.png'
import metamask from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-06.png'
import addToChrome from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-07.png'
import newMetamask from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-08.png'

const Preparation1 = ({ title, className = '' }) => {
  return (
    <>
      <Heading className="mb-4" color="primary">
        {title}
      </Heading>
      <div className={className}>
        <Text fontSize="14px" className="mb-4">
          After create your password, you will get the secret backup phase ( Seed phase )
        </Text>

        <Text fontSize="14px" color="failure" bold>
          IMPORTANT !!
        </Text>
        <Text fontSize="14px" className="mb-4">
          Do not take photo , capture seed phase screen or save seed phase in any kind of digital format.
          <br />
          Write it on a paper and store in a secure location is recommended.
        </Text>
        <img src={newMetamask} alt="" />
      </div>
    </>
  )
}

export default Preparation1
