import React, { useState, useCallback } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'
import useTheme from 'hooks/useTheme'
import { Button, Text, Heading, Image, useMatchBreakpoints, Flex } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import tAra from 'uikit-dev/images/for-ui-v2/nft/T-ARA.png'
import copyWhite from 'uikit-dev/images/for-ui-v2/nft/copy-white.png'
import copyBlack from 'uikit-dev/images/for-ui-v2/nft/copy-black.png'
import CopyToClipboard from '../CopyToClipboard'
import EllipsisText from '../../../../components/EllipsisText'
import ListFillModal from './ListFillModal'
import ModalComplete from './ModalComplete'
import { useSousApprove } from '../../../../hooks/useGetMyNft'

interface Props {
  onDismiss?: () => void
  isMarketplace?: boolean
  data: any
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

const ListDetailBuyModal: React.FC<Props> = ({ onDismiss = () => null, isMarketplace, data }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [onPresentConnectModal] = useModal(<ListFillModal data={data} />)
  const [handleBuy] = useModal(<ModalComplete />)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { isDark } = useTheme()


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
        <LazyLoad offset={100}>
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
        </LazyLoad>

        <div className={isMobile ? 'mt-6' : 'ml-6'}>
          <Text bold fontSize={isMobile ? '26px !important' : '30px !important'} lineHeight="1">
            #1234
          </Text>
          <Text bold fontSize={isMobile ? '14px !important' : '18px !important'} lineHeight="1.4">
            {/* {data.name} {data.title} */}
            test
          </Text>
          <Text fontSize={isMobile ? '12px !important' : '14px !important'} color="textSubtle" lineHeight="1.5">
            Dingo x SIX Network NFT Project No.1
          </Text>
          <div className="mt-4">
            <Text fontSize="14px !important" color="textSubtle">
              Metadata
            </Text>
            <div className="flex align-center">
              <EllipsisText start={17} text={"https://klaytn.definix.com/" || ''} />
              <CopyToClipboard toCopy="https://klaytn.definix.com/">Copy Address</CopyToClipboard>
            </div>
          </div>
          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              NFT token standard
            </Text>
            <Text bold fontSize="16px !important" color="text">
              BEP-1155
            </Text>
          </div>
          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              Smart Contract address
            </Text>
            <div className="flex align-center">
              <EllipsisText start={6} end={5} text="0x5503a12290a7Cc6128d18b0DA6FBEab009165311" />
              <CopyToClipboard toCopy="test">Copy Address</CopyToClipboard>
            </div>
          </div>

          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              Price
                </Text>
            <div className="flex align-center">
              <Image src="/images/coins/FINIX.png" width={16} height={16} />
              <Text bold fontSize="22px" color="text" paddingLeft="6px">
                2,837.2938 FINIX
                  </Text>
            </div>
          </div>
          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              Until
                </Text>
            <Text bold fontSize="14px !important" color="text">
              28/12/21 00:00:00 GMT+7
                </Text>
            {/* ถ้าไม่ได้ใส่ วันที่/เวลา */}
            {/* <Text fontSize="12px" color="text">
                  -
                </Text> */}
          </div>
          <Button fullWidth radii="small" className="mt-3" onClick={() => handleBuy()}>
            Buy
          </Button>

        </div>
      </div>
    </ModalNFT >
  )
}

export default ListDetailBuyModal
