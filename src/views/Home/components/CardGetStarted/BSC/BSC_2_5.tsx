/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-20.png'
import img02 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-21.png'
import UserBlock from 'uikit-dev/widgets/Menu/UserBlock'

const BSC_2_5 = ({ title }) => {
  const { account, connect, reset } = useWallet()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          In metamask wallet, you have to add SIX token into your wallet to view your coin.
        </Text>
        <Text fontSize="14px" className="mb-4">
          Press Connect Wallet
        </Text>

        <UserBlock account={account} login={connect} logout={reset} className="mb-4 dis-in-block" position="bottom" />

        <Text fontSize="14px" className="mb-4">
          And press these buttons
        </Text>

        <div className="mb-6">
          <img src={img01} alt="" className="mb-2" style={{ cursor: 'pointer' }} />
          <img src={img02} style={{ cursor: 'pointer' }} alt="" />
        </div>

        <Text fontSize="14px">
          After finish the process, please wait 10-20 minutes. You will recieve SIX in your metamask wallet
          automatically.
        </Text>
      </div>
    </>
  )
}

export default memo(BSC_2_5)
