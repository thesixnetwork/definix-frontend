/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'

const Klaytn_4_2 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          Now you can select the token you want to pair from “Select Token” dropdown menu
          <br />
          The system will auto-calculate the amount of pair token automatically.
        </Text>

        <Text fontSize="14px" className="mb-4">
          After that you need to “Approve contract” by press on{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            Approve
          </Text>{' '}
          button.
        </Text>

        <Text fontSize="14px" className="mb-4">
          Once you already approve contract, you have to press on{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            Deposit
          </Text>{' '}
          button again to pair liquidity.
        </Text>

        <Text fontSize="14px" className="mb-4">
          The{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            FINIX-SIX LP
          </Text>{' '}
          will be send directly into your wallet.
        </Text>

        <Text fontSize="14px" className="mb-4">
          Now you are ready to start your first farm. Go to{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            Yield farming
          </Text>{' '}
          on menu bar and select{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            Farm
          </Text>
          .
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_4_2)
