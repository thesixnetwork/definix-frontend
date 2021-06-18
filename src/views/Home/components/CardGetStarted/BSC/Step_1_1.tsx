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
        <div className="flex align-center mb-2">
          <Image src={chrome} width={72} height={72} mr="12px" />
          <Text fontSize="14px">
            Open your web browser <br />( Google Chrome )
          </Text>
        </div>
        <div className="flex align-center mb-4">
          <Image src={metamask} width={72} height={72} mr="12px" />
          <Text fontSize="14px">
            Download and install chrome plugin wallet from this linkMetamask :{' '}
            <LinkExternal href="https://metamask.io/" target="_blank" fontWeight="100 !important">
              https://metamask.io/
            </LinkExternal>
          </Text>
        </div>

        <img src={addToChrome} alt="" />

        <Text fontSize="14px" className="my-2">
          After install your wallet, select on create a new wallet and seed phase
        </Text>

        <img src={newMetamask} alt="" />
      </div>
    </>
  )
}

export default Preparation1
