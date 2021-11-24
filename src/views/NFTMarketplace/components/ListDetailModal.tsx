import React, { useState } from 'react'
import _ from 'lodash'
import { Button, Text, Heading } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import ModalSorry from 'uikit-dev/widgets/Modal/Modal'
import tAra from 'uikit-dev/images/for-ui-v2/t-ara.png'
import ListFillModal from './ListFillModal'

interface Props {
  onDismiss?: () => void
}

const ListDetailModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [onPresentConnectModal] = useModal(<ListFillModal />)
  console.log('Modal')
  return (
    <ModalSorry
      isRainbow={false}
      title=""
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      classHeader="bd-b-n pa-0"
    >
      <div className="flex">
        <img alt="" src={tAra} width="340px" height="340px" />
        <div className="ml-5">
          <Heading fontSize="34px !important" lineHeight="2">
            #02
          </Heading>
          <Heading fontSize="22px !important" lineHeight="2">
            T-ARA LEGENDARY Grade Limited
          </Heading>
          <Text fontSize="16px !important" color="textSubtle" lineHeight="2">
            Dingo x SIX Network NFT Project No.1
          </Text>
          <div className="mt-4">
            <Text fontSize="14px !important" color="textSubtle">
              Metadata
            </Text>
            <Text fontSize="16px !important" color="textSubtle">
              https://dryotus.definix.com/…
            </Text>
          </div>
          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              NFT token standard
            </Text>
            <Text fontSize="16px !important" color="textSubtle">
              BEP-1155
            </Text>
          </div>
          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              Smart Contract address
            </Text>
            <Text fontSize="16px !important" color="textSubtle">
              0x5503...65311
            </Text>
          </div>
          <Button fullWidth radii="small" className="mt-3" onClick={() => onPresentConnectModal()}>
            List
          </Button>
        </div>
      </div>
    </ModalSorry>
  )
}

export default ListDetailModal
