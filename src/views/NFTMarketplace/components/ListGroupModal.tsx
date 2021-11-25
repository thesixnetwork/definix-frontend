import React, { useState } from 'react'
import _ from 'lodash'
import { Button, Text, Heading, Image, useMatchBreakpoints } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import useTheme from 'hooks/useTheme'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import tAra from 'uikit-dev/images/for-ui-v2/nft/T-ARA.png'
import iconCopy from 'uikit-dev/images/for-ui-v2/nft/Icon-copy.png'
import ListFillModal from './ListFillModal'
import TableList from './TableList'
import ModalComplete from './ModalComplete'

interface Props {
  onDismiss?: () => void
  isMarketplace?: boolean
}

const ListGroupModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [onPresentConnectModal] = useModal(<ListFillModal />)
  const [handleBuy] = useModal(<ModalComplete />)
  const { isXl } = useMatchBreakpoints()
  const { isDark, toggleTheme } = useTheme()
  const isMobile = !isXl

  const rows = [
    {
      id: 1,
      name: 'toon',
    },
    {
      id: 2,
      name: 'mo',
    },
    {
      id: 3,
      name: 'mo',
    },
    {
      id: 4,
      name: 'mo',
    },
  ]

  return (
    <ModalNFT
      isRainbow={false}
      title=""
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      classHeader="bd-b-n pa-0"
    >
      <div className="flex">
        <div className={isMobile ? 'text-center' : ''}>
          <img alt="" src={tAra} />
        </div>
        <div className="ml-5">
          <Text bold fontSize="22px !important" lineHeight="1.3">
            T-ARA LEGENDARY Grade Limited
          </Text>
          <Text fontSize="16px !important" color="textSubtle" lineHeight="1.5">
            Dingo x SIX Network NFT Project No.1
          </Text>
          <TableList rows={rows} isLoading={isLoading} isDark={isDark} total={10} />
        </div>
      </div>
    </ModalNFT>
  )
}

export default ListGroupModal
