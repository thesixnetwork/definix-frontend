/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import numeral from 'numeral'
import moment from 'moment'
import _, { chain } from 'lodash'
import { getDryotusAddress, getNftMarketplaceAddress } from 'utils/addressHelpers'
import multicall from '../../utils/multicall'
import * as NFTListData from '../../nft.json'
import dryotusABI from '../../config/abi/dryotus.json'
import marketInfoABI from '../../config/abi/MarketInfoFacet.json'
import sellerABI from '../../config/abi/SellerFacet.json'
import { NFTData } from '../types'

interface IState {
  isFetched: boolean
  curOrder: number
  nftListData: NFTData[]
  orderOnSell: NFTData[]
  orderItems: NFTData[]
  owning: NFTData[]
  syncData: string
  orderList: []
}
export interface Owning {
  [key: string]: number
}

const initialState: IState = {
  isFetched: false,
  curOrder: 0,
  nftListData: NFTListData.data,
  orderOnSell: [],
  orderItems: [],
  owning: [],
  syncData: '',
  orderList: []
}

export const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    setUserNFTs: (state, { payload }: PayloadAction<Owning>) => {
      // eslint-disable-next-line no-param-reassign
      state.nftListData = state.nftListData.map((nft: NFTData) => {
        const filteredKey = (Object.keys(payload) as string[]).filter(
          (n: string) => parseInt(n, 10) >= nft.startID && parseInt(n, 10) <= nft.endID,
        )
        const result: NFTData = {
          ...nft,
          userData: { amountOwn: filteredKey.length, owning: filteredKey.map((n: string) => parseInt(n, 10)) },
        }
        return result
      })
    },
    setOnwing: (state, action) => {
      const { owning } = action.payload
      state.owning = owning
    },
    setOrderOnsell: (state, action) => {
      const { orderItems, orderOnSell } = action.payload
      state.orderOnSell = orderOnSell
      state.orderItems = orderItems
    },
    setSyncData: (state, action) => {
      const { syncData } = action.payload
      state.syncData = syncData
    },
    setOrderList: (state, action) => {
      const { orderList } = action.payload
      state.orderList = orderList
    }
  },
})

// Actions
export const { setUserNFTs, setOrderOnsell, setOnwing, setSyncData, setOrderList } = nftSlice.actions

const getNFTUser = async (account) => {
  const owningData: Owning = {}
  const tokenId = []
  const groupedNFTS = chain(NFTListData.data).groupBy('name').value()

  if (account) {
    await Promise.all(
      Object.keys(groupedNFTS).map(async (key: string) => {
        const NFTGroup: NFTData[] = groupedNFTS[key]
        const calls = NFTGroup.map((nftConfig: NFTData) => {
          const idToCall = Array.from(Array(nftConfig.endID - nftConfig.startID + 1).keys()).map(
            (i: number) => nftConfig.startID + i,
          )
          const addressToCall = Array(nftConfig.endID - nftConfig.startID + 1).fill(account)
          return {
            address: getDryotusAddress() || '',
            name: 'balanceOfBatch',
            params: [addressToCall, idToCall],
          }
        })
        const allUserNFTSData = await multicall(dryotusABI, calls)

        NFTGroup.forEach((nftConfig: NFTData, index: number) => {
          const [fetchedOwningData] = allUserNFTSData[index]
          fetchedOwningData.forEach((itemOwning: any, itemIndex: number) => {
            // eslint-disable-next-line no-underscore-dangle
            const currentOwning = new BigNumber(itemOwning._hex).isEqualTo(1)
            if (currentOwning) {
              owningData[itemIndex + nftConfig.startID] = 1
              tokenId.push({
                id: itemIndex + nftConfig.startID,
              })
            }
          })
        })
        return true
      }),
    )
  }
  return [owningData, tokenId]
}

const getUserOrderOnSell = async ({ account }) => {
  const ordetItems = []
  const orderOnSell = []
  try {
    const calls = [
      {
        address: getNftMarketplaceAddress(),
        name: 'getUserOrderOnSell',
        params: [account],
      },
    ]
    const userOrders = await multicall(marketInfoABI.abi, calls)
    const result = _.get(userOrders, '0.ordersReturn_')
    const orders = result.map(async (value) => {
      const sellPeriod = new Date(new BigNumber(_.get(value, 'sellPeriod._hex')).toNumber() * 1000)
      orderOnSell.push({
        amount: new BigNumber(_.get(value, 'amount._hex')).toNumber(),
        code: _.get(value, 'code'),
        created: new BigNumber(_.get(value, 'created._hex')).toNumber(),
        currency: _.get(value, 'currency'),
        description: _.get(value, 'description'),
        id: new BigNumber(_.get(value, 'id._hex')).toNumber(),
        itemCount: new BigNumber(_.get(value, 'itemCount._hex')).toNumber(),
        owner: _.get(value, 'owner'),
        price: new BigNumber(_.get(value, 'price._hex')).dividedBy(new BigNumber(10).pow(18)).toNumber(),
        status: _.get(value, 'status'),
        sellPeriod:
          new BigNumber(_.get(value, 'sellPeriod._hex')).toNumber() === 0
            ? 0
            : moment(sellPeriod).format(`DD-MMM-YY HH:mm:ss`),
        totalRemainingForSell: new BigNumber(_.get(value, 'totalRemainingForSell._hex')).toNumber(),
      })

      const call = [
        {
          address: getNftMarketplaceAddress(),
          name: 'getOrderItems',
          params: [new BigNumber(_.get(value, 'id._hex')).toNumber()],
        },
        {
          address: getNftMarketplaceAddress(),
          name: 'orderIsReadyForSellByCode',
          params: [_.get(value, 'code')],
        },
      ]
      const [getOrderItems, getOrderIsReadyForSell] = await multicall(marketInfoABI.abi, call)
      return { getOrderItems, getOrderIsReadyForSell }
    })

    const saleItems_ = await Promise.all(orders)
    saleItems_.filter((i) => {
      _.get(i, 'getOrderIsReadyForSell').some((isReady) =>
        _.get(i, 'getOrderItems.saleItems_').some((v) =>
          ordetItems.push({
            tokenId: new BigNumber(v.tokenId._hex).toNumber(),
            amount: new BigNumber(v.amount._hex).toNumber(),
            code: v.code,
            id: new BigNumber(v.id._hex).toNumber(),
            orderId: new BigNumber(v.orderId._hex).toNumber(),
            price: new BigNumber(v.price._hex).dividedBy(new BigNumber(10).pow(18)).toNumber(),
            tokenContract: v.tokenContract,
            isReady,
          }),
        ),
      )
      return ordetItems
    })
  } catch (error) {
    console.log(error)
  }

  return [ordetItems, orderOnSell]
}

const getItemByCode = async ({ code }) => {
  const ordetItems = []
  const orderOnSell = []
  try {
    code.map(async (value) => {
      const calls = [
        {
          address: getNftMarketplaceAddress(),
          name: 'getItemByCode',
          params: [value.orderCode],
        },
      ]
      const userOrders = await multicall(marketInfoABI.abi, calls)
      const orderList = _.get(userOrders, '0.0')
    })
  } catch (error) {
    console.log(error)
  }

  return [ordetItems, orderOnSell]
}

export const fetchNFTUser = (account) => async (dispatch) => {
  const fetchPromise = []
  if (account) {
    fetchPromise.push(getNFTUser(account))
  }
  const [[data, tokenId]] = await Promise.all(fetchPromise)
  dispatch(setUserNFTs(data))
  dispatch(setOnwing({ owning: tokenId }))
}

export const fetchUserOrderOnSell = (account) => async (dispatch) => {
  const fetchPromise = []
  if (account) {
    fetchPromise.push(getUserOrderOnSell({ account }))
  }
  const [[orderItems, orderOnSell]] = await Promise.all(fetchPromise)
  dispatch(setOrderOnsell({ orderItems, orderOnSell }))
}

export const fetchItemByCode = (code) => async (dispatch) => {
  const fetchPromise = []
  if (code) {
    fetchPromise.push(getItemByCode({ code }))
  }
  // const [[orderItems, orderOnSell]] = await Promise.all(fetchPromise)
  // dispatch(setOrderOnsell({ orderItems, orderOnSell }))
}

export const fetchSyncDatabyOrder = (orderId) => async (dispatch) => {
  const body = {
    orderId,
  }
  const response = await axios.post(`${process.env.REACT_APP_API_NFT}/sync`, body)
  dispatch(setSyncData({ syncData: response.data.message }))
}

// Marketplace
export const fetchOrderList = (orderId) => async (dispatch) => {
  const response = await axios.get(`${process.env.REACT_APP_API_NFT}/orderlist?sort=ASC&limit=10&pageNumber=1&startIndex=1&endIndex=60`)
  dispatch(setOrderList({ orderList: response.data }))
}

export default nftSlice.reducer
