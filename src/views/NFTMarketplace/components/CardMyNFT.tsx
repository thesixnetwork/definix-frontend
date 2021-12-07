import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { Card, Text } from 'uikit-dev'
import FlexLayout from 'components/layout/FlexLayout'
import NFTCard from './NFTCard'
import MyOrderCard from './MyOrderCard'
import SelectView from './SelectView'
import TypeTab from './TypeTab'
import useRefresh from '../../../hooks/useRefresh'
import { fetchNFTUser, fetchUserOrderOnSell } from '../../../state/actions'
import { State } from '../../../state/types'

const FinixStake = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  padding: 1.5rem !important;

  a {
    display: block;
  }
`

export type TypeName = 'Grid' | 'Group'

const CardMyNFT = () => {
  const [listView, setListView] = useState(false)
  const [isMarketplace, setIsMarketplace] = useState(false)
  const [typeName, setTypeName] = useState<TypeName>('Grid')
  const [groupList, setGroupList] = useState([])
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const nftUser = useSelector((state: State) => state.nft)
  const orderItems = _.get(nftUser, 'orderItems')
  const orderOnSell = _.get(nftUser, 'orderOnSell')
  const owning = _.get(nftUser, 'owning')

  const intersectionBy = useMemo(() => {
    const data = []
    orderItems.map((item) => ({
      ...item,
      ...orderOnSell.find(
        ({ id, price, currency, description, status, sellPeriod, code }) =>
          id === item.id &&
          status !== 2 &&
          item.isReady &&
          data.push({
            tokenId: item.tokenId,
            price,
            currency,
            description,
            status,
            sellPeriod,
            orderCode: code,
            orderId: item.orderId,
            isReady: item.isReady,
          }),
      ),
    }))
    return data
  }, [orderOnSell, orderItems])

  useEffect(() => {
    if (account) {
      // get My collections
      dispatch(fetchNFTUser(account))
      // get Orders
      dispatch(fetchUserOrderOnSell(account))
    }
  }, [account, dispatch, fastRefresh])

  const filterdList = useMemo(() => {
    return _.get(nftUser, 'nftListData')?.filter(
      (data) => typeof data?.userData?.amountOwn === 'number' && data?.userData?.amountOwn > 0,
    )
  }, [nftUser])

  const filterMyOrder = useMemo(() => {
    const OrderArray = []
    owning.filter((x) =>
      filterdList.filter((y) => {
        if (x.id >= y?.startID && x.id <= y?.endID) {
          OrderArray.push({
            tokenID: _.get(x, 'id'),
            code: _.get(y, 'code'),
            detailDescKey: _.get(y, 'detailDescKey'),
            detailTitleKey: _.get(y, 'detailTitleKey'),
            endID: _.get(y, 'endID'),
            grade: _.get(y, 'grade'),
            imageUrl: _.get(y, 'imageUrl'),
            limitCount: _.get(y, 'limitCount'),
            metaDataURL: _.get(y, 'metaDataURL'),
            name: _.get(y, 'name'),
            order: _.get(y, 'order'),
            previewImgId: _.get(y, 'previewImgId'),
            previewVideoUrl: _.get(y, 'previewVideoUrl'),
            startID: _.get(y, 'startID'),
            title: _.get(y, 'title'),
            totalAmount: _.get(y, 'totalAmount'),
            userData: _.get(y, 'userData'),
            videoUrl: _.get(y, 'videoUrl'),
            nftNormal: _.get(y, 'nftNormal')
          })
        }
        return OrderArray
      }),
    )
    return OrderArray
  }, [owning, filterdList])

  const filterOrder = useMemo(() => {
    const OrderArray = []
    intersectionBy.filter((x) =>
      filterdList.some(
        (y) =>
          x.tokenId >= y?.startID &&
          x.tokenId <= y?.endID &&
          OrderArray.push({
            videoUrl: y?.videoUrl,
            codeData: y?.code,
            code: y?.code,
            orderCode: x?.orderCode,
            detailDescKey: y?.detailDescKey,
            detailTitleKey: y?.detailTitleKey,
            endID: y?.endID,
            grade: y?.grade,
            imageUrl: y?.imageUrl,
            limitCount: y?.limitCount,
            metaDataURL: y?.metaDataURL,
            nftNormal: y?.nftNormal,
            name: y?.name,
            order: y?.order,
            previewImgId: y?.previewImgId,
            previewVideoUrl: y?.previewVideoUrl,
            startID: y?.startID,
            title: y?.title,
            totalAmount: y?.totalAmount,
            userData: y?.userData,
            price: x?.price,
            currency: x?.currency,
            description: x?.description,
            tokenID: x?.tokenId,
            status: x?.status,
            sellPeriod: x?.sellPeriod,
            orderId: x.orderId,
          }),
      ),
    )
    return OrderArray
  }, [filterdList, intersectionBy])

  const dataForGroup = useMemo(() => {
    const merge = filterMyOrder.filter((o1) => !filterOrder.some((o2) => o1.tokenID === o2.tokenID))
    return filterOrder.concat(merge)
  }, [filterMyOrder, filterOrder])

  useEffect(() => {
    const h = {}

    filterMyOrder.forEach((x) => {
      h[x.order] = (h[x.order] || []).concat(x.userData.amountOwn, x.videoUrl, x.name, x.title, x.code)
    })

    const hdata = Object.keys(h).map((k) => ({
      order: k,
      filterdList: h[k],
      tokenID: k,
      count: h[k].length,
      isGroup: true,
    }))

    setGroupList(hdata)
  }, [filterMyOrder])

  return (
    <div className="align-stretch mt-5">
      <TypeTab current="/nft" />
      <FinixStake>
        {owning.length > 0 ? (
          <>
            <SelectView typeName={typeName} setTypeName={setTypeName} />
            {typeName === 'Grid' ? (
              <>
                {filterOrder.length > 0 && (
                  <>
                    <Text className="mt-5 mb-5" fontSize="16px">
                      My Listing : <b>{filterOrder.length} results</b>
                    </Text>
                    <FlexLayout cols={3}>
                      {filterOrder.map(
                        (data) =>
                          data.status !== 2 && (
                            <MyOrderCard
                              typeName={typeName}
                              isHorizontal={listView}
                              isMarketplace={isMarketplace}
                              data={data}
                              dataForGroup={dataForGroup}
                            />
                          ),
                      )}
                    </FlexLayout>
                  </>
                )}
                {dataForGroup.length > 0 && (
                  <>
                    <Text className="mt-5 mb-5" fontSize="16px">
                      My Collection : <b>{dataForGroup.length} results</b>
                    </Text>
                    <FlexLayout cols={3}>
                      {dataForGroup.map((data) => (
                        <NFTCard
                          typeName={typeName}
                          isHorizontal={listView}
                          isMarketplace={isMarketplace}
                          data={data}
                          dataForGroup={dataForGroup}
                        />
                      ))}
                    </FlexLayout>
                  </>
                )}
              </>
            ) : (
              <>
                {groupList.length > 0 && (
                  <>
                    <Text className="mt-5 mb-5" fontSize="16px">
                      <b>{groupList.length} results</b>
                    </Text>
                    <FlexLayout cols={3}>
                      {groupList.map((data) => (
                        <NFTCard
                          typeName={typeName}
                          isHorizontal={listView}
                          isMarketplace={isMarketplace}
                          data={data}
                          dataForGroup={dataForGroup}
                        />
                      ))}
                    </FlexLayout>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center">
            <Text fontSize="26px !important">You don’t have any NFT</Text>
            <Text fontSize="18px !important">
              You can buy NFT by this button below or Marketplace button on the top
            </Text>
          </div>
        )}
      </FinixStake>
    </div>
  )
}

export default CardMyNFT
