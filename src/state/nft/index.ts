/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import _, { chain } from 'lodash'
import multicall from '../../utils/multicall'
import * as NFTListData from '../../nft.json'
import dryotusABI from '../../config/abi/dryotus.json'
import { NFTData } from '../types'

interface NFTItem {
  code: string
  price: any
  totalSellingAmount: any
  totalRemainingForPurchase: any
}

interface IState {
  isFetched: boolean
  curOrder: number
  nftListData: NFTData[]
}

export interface Owning {
  [key: string]: number
}

// export interface Owning {
//   [key: string]: number
// }

const name = 'NFT_COLLECTION'
const initialState: IState = {
  isFetched: false,
  curOrder: 0,
  nftListData: NFTListData.data,
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
  },
})

// Actions
export const { setUserNFTs } = nftSlice.actions

const getNFTUser = async ({ account }) => {
  const owningData: Owning = {}
  const groupedNFTS = chain(NFTListData.data).groupBy('name').value()

  await Promise.all(
    Object.keys(groupedNFTS).map(async (key: string) => {
      const NFTGroup: NFTData[] = groupedNFTS[key]
      const calls = NFTGroup.map((nftConfig: NFTData) => {
        const idToCall = Array.from(Array(nftConfig.endID - nftConfig.startID + 1).keys()).map(
          (i: number) => nftConfig.startID + i,
        )
        const addressToCall = Array(nftConfig.endID - nftConfig.startID + 1).fill(
          '0x5F3A5da3d9AEbE7A2c66136c92657ab588a39897',
        )
        return {
          address: '0xB7cdb5199d9D8be847d9B7d9e111977652E53307' || '',
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
          }
        })
      })
      // console.log('allUserNFTSData', allUserNFTSData);
      // return allUserNFTSData;
      return true
    }),
  )
  return [owningData]
}

export const fetchNFTUser = (account) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(getNFTUser(account))
  const [[data]] = await Promise.all(fetchPromise)
  dispatch(setUserNFTs(data))
}

export default nftSlice.reducer
