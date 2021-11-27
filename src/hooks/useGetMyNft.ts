/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import sellNFTOneItemABI from 'config/abi/SellerFacet.json'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { getContract } from 'utils/web3'
import { useApprovalForAll, useSellNft } from 'hooks/useContract'
import useRefresh from './useRefresh'
import { fetchNFTUser } from '../state/actions'
import { State, NFTData } from '../state/types'
import dryotusABI from '../config/abi/dryotus.json'

interface IState {
  isFetched: boolean
  curOrder: number
  nftListData: NFTData[]
}

const useNFTUser = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useWallet()

  useEffect(() => {
    if (account) {
      dispatch(fetchNFTUser(account))
    }
  }, [slowRefresh, account, dispatch])

  const nftUser = useSelector((state: State) => state.nft)
  return { nftUser }
}

export const useSellNFTOneItem = (nftAddress, tokenId, price, currencyAddress, amount) => {
  const { account }: { account: string } = useWallet()
  const test = useSellNft()

  const sell = useCallback(async () => {
    const jSon = {
      _tokenContract: nftAddress,
      _description: 'test decription',
      _tokenId: tokenId[0].toString(),
      _amount: amount,
      _price: price,
      _currency: currencyAddress,
    }
    console.log("jSon", test)
    let txHash
    if (account) {
      // const callContract = getContract(sellNFTOneItemABI.abi, '0x6Cef51b5684e39597EEf0b82F1e932F45f56a394')
      txHash = await test.methods.sellNFTOneItem(jSon).send({ from: '0x5F3A5da3d9AEbE7A2c66136c92657ab588a39897' })
      console.log("txHash", txHash)
      return txHash
    }

    return txHash
  }, [nftAddress, tokenId, price, currencyAddress, amount, account, test])

  return { onSell: sell }
}

export const useSousApprove = () => {
  const { account }: { account: string } = useWallet()
  const approvalForAll = useApprovalForAll()

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await approvalForAll.methods
        .setApprovalForAll('0xB7cdb5199d9D8be847d9B7d9e111977652E53307', true)
        .send({ from: account })

      return txHash
    } catch (e) {
      return false
    }
  }, [account, approvalForAll])

  return { onApprove: handleApprove }
}

export default useNFTUser
