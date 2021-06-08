import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Modal, Text } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'

const MiniLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: block;
  flex-shrink: 0;
`

const AirDropHarvestModal = ({ onDismiss = () => null }) => {
  return (
    <Modal title="Rewards you haven't harvest yet" onDismiss={onDismiss} isRainbow={false}>
      <div className="flex mb-4">
        <div className="flex align-baseline flex-wrap col-8 pr-6">
          <MiniLogo src={miniLogo} alt="" className="align-self-start" />
          <Heading fontSize="24px !important" className="mr-2" textAlign="left">
            0.00
          </Heading>
          <Text color="textSubtle" textAlign="left">
            KLAY (Airdrop)
          </Text>
          <Text color="textSubtle" fontSize="12px" className="col-12 ml-6">
            = $0.00
          </Text>
        </div>
        <Button fullWidth className="col-4 align-self-center" radii="small">
          Harvest
        </Button>
      </div>
      <div className="flex">
        <div className="flex align-baseline flex-wrap col-8 pr-6">
          <MiniLogo src={miniLogo} alt="" className="align-self-start" />
          <Heading fontSize="24px !important" className="mr-2" textAlign="left">
            0.00
          </Heading>
          <Text color="textSubtle" textAlign="left">
            KLAY (Airdrop)
          </Text>
          <Text color="textSubtle" fontSize="12px" className="col-12 ml-6">
            = $0.00
          </Text>
        </div>
        <Button fullWidth className="col-4 align-self-center" radii="small">
          Harvest
        </Button>
      </div>
    </Modal>
  )
}

export default AirDropHarvestModal
