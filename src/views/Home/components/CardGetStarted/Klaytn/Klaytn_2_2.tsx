/* eslint-disable camelcase */
import React, { memo } from 'react'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import bsc from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-53.png'
import klaytn from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-54.png'

const CustomButton = styled.img`
  cursor: pointer;
  width: 180px;
  margin: 0 auto;
  display: block;
`

const Klaytn_2_2 = ({ title, onNext }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          To transfer SIX to Kaikas, It’s have 2 choices
        </Text>

        <Text fontSize="14px" className="mb-4">
          Please select a choice
        </Text>

        <CustomButton
          src={bsc}
          alt=""
          onClick={() => {
            onNext(1, 2)
          }}
          className="mb-3"
        />
        <CustomButton
          src={klaytn}
          alt=""
          onClick={() => {
            onNext(1, 2)
          }}
        />
      </div>
    </>
  )
}

export default memo(Klaytn_2_2)
