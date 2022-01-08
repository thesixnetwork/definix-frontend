import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import { addTransaction, KlaytnTransactionResponse } from './actions'
import { TransactionDetails } from './reducer'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response?: KlaytnTransactionResponse,
  customData?: {
    type?: string
    data?: { firstToken?: string; firstTokenAmount?: string; secondToken?: string; secondTokenAmount?: string }
    summary?: string
    approval?: { tokenAddress: string; spender: string }
    klipTx?: string
  },

) => void {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (
      response?: KlaytnTransactionResponse,
      {
        type,
        data,
        summary,
        approval,
        klipTx
      }: {
        type?: string
        data?: { firstToken?: string; firstTokenAmount?: string; secondToken?: string; secondTokenAmount?: string }
        summary?: string
        approval?: { tokenAddress: string; spender: string }
        klipTx?: string
      } = {},
    ) => {
      if (!account) return
      if (!chainId) return
      if (klipTx) {

        dispatch(addTransaction({ type, data, hash: klipTx, from: account, chainId, approval, summary }))
      }
      else if (response) {
        const { hash, transactionHash } = response
        if (!hash && !transactionHash) {
          throw Error('No transaction hash found.')
        }
        const txHash = hash || transactionHash
        dispatch(addTransaction({ type, data, hash: txHash, from: account, chainId, approval, summary }))
      }
    },
    [dispatch, chainId, account]
  )
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useActiveWeb3React()

  const state = useSelector<AppState, AppState['transactions']>(s => s.transactions)

  return chainId ? state[chainId] ?? {} : {}
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some(hash => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        }
        const { approval } = tx
        if (!approval) return false
        return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
      }),
    [allTransactions, spender, tokenAddress]
  )
}
