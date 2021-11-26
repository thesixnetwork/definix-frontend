import React, { useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Button, Text, Heading, Flex, useMatchBreakpoints } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import useTheme from 'hooks/useTheme'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import tAra from 'uikit-dev/images/for-ui-v2/nft/T-ARA.png'
import iconCopy from 'uikit-dev/images/for-ui-v2/nft/Icon-copy.png'
import ListFillModal from './ListFillModal'
import TableList from '../TableList'
import ModalComplete from './ModalComplete'

interface Props {
  onDismiss?: () => void
  isMarketplace?: boolean
}

const ImgWrap = styled(Flex)`
  width: 340px;
  height: 330px;
  flex-shrink: 0;
  justify-content: center;
  
  ${({ theme }) => theme.mediaQueries.xs} {
    width: unset;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 340px;
  }
`

const LayoutImg = styled.div`
  text-align: -webkit-center;
`

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
      bodyPadding={isMobile ? '30px 18px' : '42px'}
    >
      <div className={isMobile ? 'w-100' : 'w-100 flex'}>
        <LayoutImg>
          <ImgWrap>
            <video autoPlay muted loop playsInline>
              <source
                src="https://dryotus.definix.com/ipfs/QmdnHBXwbe1tpa8fpKKk1RnAFiU93JpuM7CwmGkUga3kuC/Legendary_T-ARA.mp4"
                type="video/mp4"
              />
            </video>
          </ImgWrap>
        </LayoutImg>
        <div className={isMobile ? 'mt-6' : 'ml-6'}>
          <Text bold fontSize="20px !important" lineHeight="1">
            T-ARA LEGENDARY Grade Limited
          </Text>
          <Text fontSize="14px !important" color="textSubtle" lineHeight="2">
            Dingo x SIX Network NFT Project No.1
          </Text>
          <TableList rows={rows} isLoading={isLoading} isDark={isDark} total={10} />
        </div>
      </div>
    </ModalNFT>
  )
}

export default ListGroupModal
