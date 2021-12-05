/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
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

export const useSellNFTOneItem = (nftAddress, tokenId, price, currencyAddress, amount, date) => {
  const { account }: { account: string } = useWallet()
  const sellNft = useSellNft()

  const sell = useCallback(async () => {
    const jSon = {
      _tokenContract: nftAddress,
      _description: 'test decription',
      _tokenId: tokenId.toString(),
      _amount: amount,
      _price: price,
      _currency: currencyAddress,
      _sellPeriod: date.toString(),
    }

    let txHash
    if (account) {
      txHash = await sellNft.methods.sellNFTOneItem(jSon).send({ from: account })
      return txHash
    }

    return new Promise((resolve, reject) => {
      resolve(txHash)
    })
  }, [nftAddress, tokenId, price, currencyAddress, amount, date, account, sellNft])

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

export const useCancelOrder = (orderCode) => {
  const { account }: { account: string } = useWallet()
  const sellNft = useSellNft()

  const handleCancelOrder = useCallback(async () => {
    try {
      let txHash
      if (account) {
        txHash = await sellNft.methods.cancelOneOrder(orderCode).send({ from: account })
      }

      return new Promise((resolve, reject) => {
        resolve(txHash)
      })
    } catch (e) {
      return false
    }
  }, [sellNft, orderCode, account])

  return { onCancelOrder: handleCancelOrder }
}

export default useNFTUser
