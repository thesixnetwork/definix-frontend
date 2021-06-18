import React, { memo } from 'react'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-14.png'
import six from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-15.png'
import bnb from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-23.png'

const CustomButton = styled.img`
  cursor: pointer;
  width: 120px;
  margin: 0 8px;
`

const BSC_2_1 = ({ title, className = '', onNext }) => {
  return (
    <>
      <Heading className="mb-4" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          You need a wallet address to transfer token to your wallet (Metamask). Your address will be shown at the upper
          part of Metamask as a picture below.
        </Text>
        <img src={img01} alt="" className="mb-4" />
        <Text fontSize="14px" className="mb-3">
          Please select a token you want to transfer
        </Text>
        <div className="flex align-center justify-center">
          <CustomButton
            src={six}
            alt=""
            onClick={() => {
              onNext(1, 1)
            }}
          />
          <CustomButton
            src={bnb}
            alt=""
            onClick={() => {
              onNext(1, 5)
            }}
          />
        </div>
      </div>
    </>
  )
}

export default memo(BSC_2_1)
