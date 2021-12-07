import React, { useState, useCallback, useMemo } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import _ from 'lodash'
import axios from 'axios'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'
import useTheme from 'hooks/useTheme'
import { Button, Text, Image, useMatchBreakpoints, Flex } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import { getFinixAddress, getSixAddress } from 'utils/addressHelpers'
import CopyToClipboard from '../CopyToClipboard'
import EllipsisText from '../../../../components/EllipsisText'
import ListFillModal from './ListFillModal'
import ModalComplete from './ModalComplete'
import { useSousApprove, useCancelOrder, useIsApprove } from '../../../../hooks/useGetMyNft'

interface Props {
  onDismiss?: () => void
  isMarketplace?: boolean
  data: any
  typeName: any
  isOnSell: boolean
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

const ListDetailModal: React.FC<Props> = ({ onDismiss = () => null, isMarketplace, data, typeName, isOnSell }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [onPresentConnectModal] = useModal(<ListFillModal data={data} />)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { onApprove } = useSousApprove()
  const isApprove = useIsApprove()
  const { onCancelOrder } = useCancelOrder(data.orderCode)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const status = _.get(data, 'status')
  const { account }: { account: string } = useWallet()

  const filterCurrency = useMemo(() => {
    const options = [
      { address: getSixAddress(), currency: 'SIX' },
      { address: getFinixAddress(), currency: 'FINIX' },
    ]
    return options.filter((item) => _.get(item, 'address') === data.currency)
  }, [data])

  const handleOrderCancel = async () => {
    try {
      const res = onCancelOrder()
      res
        .then(async (r) => {
          if (r) {
            const body = {
              userAddress: account,
            }
            const response = await axios.post(`${process.env.REACT_APP_API_NFT}/cancel`, body)
            if (response.status === 200) {
              onDismiss()
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    } catch (e) {
      console.error(e)
    }
  }

  const heandleDelistOrList = () => {
    return typeName === 'Group' ? typeGroup() : typeGrid()
  }

  const handleIsApproveForGrid = () => {
    const disable = status === 0
    return isApprove ? (
      <Button disabled={disable} fullWidth radii="small" className="mt-3" onClick={() => onPresentConnectModal()}>
        List
      </Button>
    ) : (
      <Button fullWidth radii="small" className="mt-3" onClick={() => handleApprove()}>
        Approve Contract
      </Button>
    )
  }

  const handleIsApproveForGroup = () => {
    return isApprove ? (
      <Button fullWidth radii="small" className="mt-3" onClick={() => onPresentConnectModal()}>
        List
      </Button>
    ) : (
      <Button fullWidth radii="small" className="mt-3" onClick={() => handleApprove()}>
        Approve Contract
      </Button>
    )
  }

  const typeGroup = () => {
    return status !== undefined ? (
      <Button
        fullWidth
        radii="small"
        onClick={() => handleOrderCancel()}
        style={{ backgroundColor: '#E2B23A' }}
        className="mt-3"
      >
        Delist
      </Button>
    ) : (
      handleIsApproveForGroup()
    )
  }

  const typeGrid = () => {
    return isOnSell ? (
      <Button
        fullWidth
        radii="small"
        onClick={() => handleOrderCancel()}
        style={{ backgroundColor: '#E2B23A' }}
        className="mt-3"
      >
        Delist
      </Button>
    ) : (
      handleIsApproveForGrid()
    )
  }

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      if (!txHash.status) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

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
                <source src={_.get(data, 'videoUrl')} type="video/mp4" />
              </video>
            </ImgWrap>
          </LayoutImg>
        </LazyLoad>

        <div className={isMobile ? 'mt-6' : 'ml-6'}>
          <Text bold fontSize={isMobile ? '26px !important' : '30px !important'} lineHeight="1">
            #{data.tokenID}
          </Text>
          <Text bold fontSize={isMobile ? '14px !important' : '18px !important'} lineHeight="1.4">
            {data.name} {data.title}
          </Text>
          <Text fontSize={isMobile ? '12px !important' : '14px !important'} color="textSubtle" lineHeight="1.5">
            Dingo x SIX Network NFT Project No.1
          </Text>
          <div className="mt-4">
            <Text fontSize="14px !important" color="textSubtle">
              Metadata
            </Text>
            <div className="flex align-center">
              <EllipsisText start={17} text={data.metaDataURL || ''} />
              <CopyToClipboard toCopy={data.metaDataURL || ''}>Copy Address</CopyToClipboard>
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
              <CopyToClipboard toCopy={data.name}>Copy Address</CopyToClipboard>
            </div>
          </div>
          {isOnSell && (
            <>
              <div className="mt-3">
                <Text fontSize="14px !important" color="textSubtle">
                  Price
                </Text>
                <div className="flex align-center">
                  <Image src={`/images/coins/${_.get(filterCurrency, '0.currency')}.png`} width={16} height={16} />
                  <Text bold fontSize="22px" color="text" paddingLeft="6px">
                    {data.price} {_.get(filterCurrency, '0.currency')}
                  </Text>
                </div>
              </div>
              <div className="mt-3">
                <Text fontSize="14px !important" color="textSubtle">
                  Until
                </Text>
                <Text bold fontSize="14px !important" color="text">
                  {data.sellPeriod > 0 ? '28/12/21 00:00:00 GMT+7' : '-'}
                </Text>
              </div>
            </>
          )}
          {heandleDelistOrList()}
        </div>
      </div>
    </ModalNFT>
  )
}

export default ListDetailModal
