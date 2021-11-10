import React, { ReactElement, useState } from 'react'
import Collapsible from 'react-collapsible'
import { Button, Text, ChevronDownIcon, ChevronUpIcon, Link } from 'uikit-dev'
import Airdrop2img from 'uikit-dev/images/Airdrop/Definix-on-KLAYTN-12.png'

interface Props {
  open: boolean
  disable: boolean
  toggle: () => void
}

const TriggerElement = ({ isDown }): ReactElement => {
  return (
    <div style={{ width: '100%', cursor: 'pointer' }}>
      <div style={{ fontSize: '20px' }}>
        Criteria for 2nd airdrop claim
        <img src={Airdrop2img} style={{ width: '50px', marginLeft: '15px' }} alt="" />
        <div style={{ float: 'right' }}>
          {console.log('isdown ', isDown)}
          <div style={{ marginTop: '15px' }}>{isDown ? <ChevronDownIcon /> : <ChevronUpIcon />}</div>
        </div>
      </div>

      <hr style={{ width: '100%', marginTop: '20px', marginBottom: '20px', opacity: '0.3' }} />
    </div>
  )
}
export default function DiscriptionSecondAirdrop({ open = false, disable = false, toggle }: Props): ReactElement {
  return (
    <Collapsible handleTriggerClick={toggle} trigger={<TriggerElement isDown={open} />} open={open} disabled={disable}>
      <div>
        <Text lineHeight="2">
          1. Must have LP staked on Definix Klaytn during 21st June 2021 3:00:00 p.m. — 20th August 2021 9:59:59
          a.m.(GMT +7).
        </Text>
        <Text lineHeight="2">
          2. The airdrop will be automatically distributed 30 KLAY within 48 hours to the wallet address that used on{' '}
          <a style={{ color: '#0973B9' }} href="https://klaytn.definix.com">
            klaytn.definix.com
          </a>{' '}
          after supply liquidity and received LP token from{' '}
          <a style={{ color: '#0973B9' }} href="https://klaytn.definix.com">
            klaytn.definix.com
          </a>
        </Text>
        <Text lineHeight="2">
          3. Users must connect the same wallet used in claiming the airdrop from the first campaign.
        </Text>
        <Text lineHeight="2">4. Input the destination Klaytn wallet (KIP-7 supported) on the claiming page</Text>

        <Text lineHeight="2">4. Airdrop is limited and distributed in a first come first serve method.</Text>
        <Text lineHeight="2">
          4.2. In case you use hardware wallet, please create new Kaikas wallet.
          {/* <a style={{ color: '#528FA9' }} href="/" target="#">
  Create Kaikas wallet
</a> */}
        </Text>

        <Text lineHeight="2">
          5. All the airdrop activity is performed and triggered by the action of a smart contract. In case the user
          puts in the account that the user doesn’t have a private key; the airdrop cannot be claimed and will be lost
          forever.
        </Text>
        <Text lineHeight="2">
          6. Airdrops will be distributed to all users equally which sums up to $200K plus unclaimed airdrop from the
          first campaign per account.
        </Text>
      </div>
      <br />
      <br />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <a href="https://klaytn.definix.com">
          <Button fullWidth>Supply your liquidity at Definix on Klaytn</Button>
        </a>
      </div>
    </Collapsible>
  )
}
