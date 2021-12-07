/* eslint-disable no-shadow */
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import axios from 'axios'
import { useApprovalForAll, useSellNft, usePurchaseOne } from 'hooks/useContract'
import { getDryotusAddress, getNftMarketplaceAddress } from 'utils/addressHelpers'
import useRefresh from './useRefresh'
import { fetchNFTUser } from '../state/actions'
import { State, NFTData } from '../state/types'

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

export const useSellNFTOneItem = (tokenId, price, currencyAddress, amount, date) => {
  const { account }: { account: string } = useWallet()
  const [status, setStatus] = useState(false)
  const [loadings, setLoading] = useState('')
  const sellNft = useSellNft()

  const sell = useCallback(async () => {
    setStatus(false)
    setLoading('loading')
    const jSon = {
      _tokenContract: getDryotusAddress(),
      _description: 'test decription',
      _tokenId: tokenId.toString(),
      _amount: amount,
      _price: price,
      _currency: currencyAddress,
      _sellPeriod: date.toString(),
    }

    if (account) {
      try {
        await sellNft.methods
          .sellNFTOneItem(jSon)
          .send({ from: account })
          .then(async (v) => {
            const body = {
              userAddress: account,
            }
            const response = await axios.post(`${process.env.REACT_APP_API_NFT}/orders`, body)
            if (response.status === 200) {
              setLoading('success')
              setInterval(() => setLoading(''), 5000)
              setInterval(() => setStatus(true), 5000)
            }
          })
          .catch((e) => {
            setLoading('')
            setStatus(false)
          })
      } catch (error) {
        setStatus(false)
      }
    }

    return status
  }, [tokenId, status, price, currencyAddress, amount, date, account, sellNft])

  return { onSell: sell, status, loadings }
}

export const useSousApprove = () => {
  const { account }: { account: string } = useWallet()
  const approvalForAll = useApprovalForAll()

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await approvalForAll.methods
        .setApprovalForAll(getNftMarketplaceAddress(), true)
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

export const usePurchaseOneNFT = (orderCode) => {
  const { account }: { account: string } = useWallet()
  const buyNft = usePurchaseOne()

  const handlePurchaseOneNFT = useCallback(async () => {
    try {
      let txHash
      if (account) {
        txHash = await buyNft.methods.purchaseOneNFT(orderCode).send({ from: account, gas: 200000 })
      }

      return new Promise((resolve, reject) => {
        resolve(txHash)
      })
    } catch (e) {
      return false
    }
  }, [buyNft, orderCode, account])

  return { onPurchase: handlePurchaseOneNFT }
}

export default useNFTUser
