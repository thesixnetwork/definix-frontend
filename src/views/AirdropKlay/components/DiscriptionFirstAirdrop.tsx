import React, { ReactElement } from 'react'
import Collapsible from 'react-collapsible'
import { Text, ChevronDownIcon, ChevronUpIcon } from 'uikit-dev'

interface Props {
  open: boolean
  disable: boolean
  toggle: ()=> void
}
const TriggerElement = ({ isDown}): ReactElement => {
    return (
        <div style={{ width: '100%', cursor: "pointer" }}>
            <div style={{ fontSize: '20px' }}>
                Criteria for 1st airdrop claim
                
                <div style={{ float: "right" }}>
                    {console.log("isdown ",isDown)}
                    <div style={{marginTop:"15px"}}>
                    {isDown ? <ChevronDownIcon />:<ChevronUpIcon /> }
                    </div>
                </div>
            </div>

            <hr style={{ width: '100%', marginTop: '20px', marginBottom: '20px', opacity: '0.3' }} />

        </div>
    )
}
export default function DiscriptionFirstAirdrop({ open = false, disable = false,toggle }: Props): ReactElement {
  return (
    <Collapsible
    trigger={<TriggerElement isDown={open} />} 
    handleTriggerClick={toggle} 
      triggerStyle={{ fontSize: '20px' }}
      open={open}
      disabled={disable}
    >
      
      <Text lineHeight="2">
        1. The users who start using bsc.definix.com from 1st April 2021, 3:00:00PM - 12th June 2021, 6:59:59PM (GMT+7)
        are screenshot on the block count.
      </Text>
      <Text lineHeight="2">
        2. Users can start claiming their airdrop on 21st June 2021 10:00:00 AM - 20th August 2021 9:59:59 AM (GMT+7)
      </Text>
      <Text lineHeight="2">
        3. The users need to sign-in their wallet; the address of the wallet must be matched with the screenshot block
        mentioned above.
      </Text>
      <Text lineHeight="2">4. Input the destination Klaytn wallet (KIP-7 supported) on the claiming page</Text>
      <div style={{ marginLeft: '20px' }}>
        <Text lineHeight="2">
          4.1. In case you use software wallet such as Metamask, Binance Chain Wallet, Trust Wallet, and etc. as a
          destination, you can import your seed phrase to Kaikas wallet.
          {/* <a style={{ color: '#528FA9' }} href="/" target="#">
  How to import seed phrase to Kaikas wallet.
</a> */}
        </Text>
        <Text lineHeight="2">
          4.2. In case you use hardware wallet, please create new Kaikas wallet.
          {/* <a style={{ color: '#528FA9' }} href="/" target="#">
  Create Kaikas wallet
</a> */}
        </Text>
      </div>
      <Text lineHeight="2">
        5. All the airdrop activity is performed and triggered by action of smart contract. In case the user puts in the
        account that the user doesn’t have a private key the airdrop will be lost forever.
      </Text>
      <Text lineHeight="2">6. Airdrop will be equally distributed to every user who is under the criteria above.</Text>
    </Collapsible>
  )
}
