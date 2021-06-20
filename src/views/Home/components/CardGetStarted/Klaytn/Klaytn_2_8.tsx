/* eslint-disable camelcase */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-61.png'
import UserBlock from 'uikit-dev/widgets/Menu/UserBlock'

const Klaytn_2_8 = ({ title }) => {
  const { account, connect, reset } = useWallet()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (FINIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          In SIX Bridge, you have to connect wallet
        </Text>

        <UserBlock account={account} login={connect} logout={reset} className="mb-4 dis-in-block" onlyConnectBtn />

        <Text fontSize="14px" className="mb-4">
          and then you have to copy your wallet address from Kaikas into “Destination” field.
        </Text>

        <Text fontSize="14px" className="mb-4">
          After the Destination address, you must enter amount of FINIX
        </Text>

        <img src={img01} alt="" />
      </div>
    </>
  )
}

export default memo(Klaytn_2_8)
