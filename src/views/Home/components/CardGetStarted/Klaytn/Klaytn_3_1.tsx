/* eslint-disable camelcase */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-64.png'
import UserBlock from 'uikit-dev/widgets/Menu/UserBlock'

const Klaytn_3_1 = ({ title }) => {
  const { account, connect, reset } = useWallet()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          To use DEFINIX, you need to connect your wallet to the platform easily by press on this button.
        </Text>
        <UserBlock account={account} login={connect} logout={reset} className="mb-4 dis-in-block mx-auto" />
        <Text fontSize="14px" className="mb-4">
          Keep in mind that on every transaction, you need KLAY to pay for a gas price.
          <br />
          Please prepare enough KLAY in your wallet. These tokens can be swap in DEFINIX.
        </Text>
        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_3_1)
