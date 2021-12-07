import React, { useState, useMemo } from 'react'
import _ from 'lodash'
import Lottie from 'react-lottie'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'
import useTheme from 'hooks/useTheme'
import success from 'uikit-dev/animation/complete.json'
import load from 'uikit-dev/animation/farmPool.json'
import { Button, Text, Image, useMatchBreakpoints, Flex } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import { getFinixAddress, getSixAddress } from 'utils/addressHelpers'
import CopyToClipboard from '../CopyToClipboard'
import EllipsisText from '../../../../components/EllipsisText'
import ListFillModal from './ListFillModal'
import ModalComplete from './ModalComplete'
import { usePurchaseOneNFT } from '../../../../hooks/useGetMyNft'

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

const EllipText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
`

const CompleteOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const LoadOptions = {
  loop: true,
  autoplay: true,
  animationData: load,
}

const ListDetailBuyModal: React.FC<Props> = ({ onDismiss = () => null, isMarketplace, data }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [onPresentConnectModal] = useModal(<ListFillModal data={data} />)
  const [handleBuy] = useModal(<ModalComplete />)
  const { onPurchase, loadings, status } = usePurchaseOneNFT(_.get(data, 'orderCode'))
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const loading = () => {
    return (
      loadings !== '' && (
        <Lottie
          options={loadings === 'loading' ? LoadOptions : CompleteOptions}
          height={loadings === 'loading' ? 300 : 155}
          width={loadings === 'loading' ? 444 : 185}
        />
      )
    )
  }

  const filterCurrency = useMemo(() => {
    const options = [
      { address: getSixAddress(), currency: 'SIX' },
      { address: getFinixAddress(), currency: 'FINIX' },
    ]
    return options.filter((item) => _.get(item, 'orderCurrency') === data.currency)
  }, [data])

  const purchase = () => {
    try {
      const res = onPurchase()
      res
        .then(async (r) => {
          if (r) {
            handleBuy()
          }
        })
        .catch((e) => {
          onDismiss()
        })
    } catch (e) {
      onDismiss()
    }
  }

  const dataContract = {
    smartcontract: process.env.REACT_APP_NFT_MARKETPLACE_TESTNET || '',
  }

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
        {loadings !== '' ? (
          loading()
        ) : (
            <>
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
                  #{data.tokenId}
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
                  <EllipText>
                    <EllipsisText start={17} text={data.metaDataURL || ''} />
                    <CopyToClipboard toCopy={data.metaDataURL || ''}>
                      Copy Address
              </CopyToClipboard>
                  </EllipText>
                </div>
                <div className="mt-3">
                  <Text fontSize="14px !important" color="textSubtle">
                    NFT token standard
            </Text>
                  <Text bold fontSize="16px !important" color="text">
                    {data.nftNormal}
                  </Text>
                </div>
                <div className="mt-3">
                  <Text fontSize="14px !important" color="textSubtle">
                    Smart Contract address
            </Text>
                  <EllipText>
                    <EllipsisText start={6} end={5} text={dataContract.smartcontract} />
                    <CopyToClipboard toCopy={dataContract.smartcontract}>
                      Copy Address
              </CopyToClipboard>
                  </EllipText>
                </div>

                <div className="mt-3">
                  <Text fontSize="14px !important" color="textSubtle">
                    Price
            </Text>
                  <div className="flex align-center">
                    <Image src={`/images/coins/${_.get(filterCurrency, '0.currency')}.png`} width={20} height={20} />
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
                    {data.orderSellPeriod > 0 ? data.orderSellPeriod : '-'}
                  </Text>
                </div>
                <Button fullWidth radii="small" className="mt-3" onClick={() => purchase()}>
                  Buy
          </Button>
              </div>
            </>
          )}



      </div>
    </ModalNFT>
  )
}

export default ListDetailBuyModal
