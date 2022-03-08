import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useWallet from 'hooks/useWallet'
import { useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'
import { getCaver } from 'utils/caver'

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number },
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    return blocksSinceCheck > 2
  }
  return true
}

export default function Updater(): null {
  const { chainId, library } = useWallet()

  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector<AppState, AppState['transactions']>((s) => s.transactions)

  const transactions = chainId ? state[chainId] ?? {} : {}

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return

    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach((hash) => {
        getCaver()
          .klay?.getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )

              // toastSuccess(transactions[hash]?.summary)
              // addPopup(
              //   {
              //     txn: {
              //       hash,
              //       success: receipt.status,
              //       summary: transactions[hash]?.summary,
              //     },
              //   },
              //   hash
              // )
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
            }
          })
          .catch((error) => {
            // toastError(transactions[hash]?.summary)
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, transactions, lastBlockNumber, dispatch])

  return null
}
