import { ethers } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { Trade, TokenAmount, CurrencyAmount, ETHER } from 'definixswap-sdk'
import { useCallback, useMemo } from 'react'
import { UseDeParamForExchange } from 'hooks/useDeParam'
import { useTranslation } from 'react-i18next'
import { useToast } from 'state/toasts/hooks'
import { ROUTER_ADDRESS } from 'config/constants'
import ERC20_ABI from 'config/constants/abis/erc20.json'

import useTokenAllowance from 'hooks/useTokenAllowance'
import { Field } from '../state/swap/actions'
import { KlaytnTransactionResponse } from '../state/transactions/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { useTokenContract } from './useContract'
import { getApproveAbi } from './hookHelper'

import { calculateGasMargin } from '../utils'
import useWallet from './useWallet'
import useKlipContract, { MAX_UINT_256_KLIP } from './useKlipContract'
import { getCaver, getCaverInstance, getCaverKlay } from 'utils/caver'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const { account, chainId } = useWallet()

  const { isKlip, request } = useKlipContract()
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])
  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('Approve was called unnecessarily')
      return
    }

    if (!token) {
      console.error('No token')
      return
    }

    if (!tokenContract) {
      console.error('TokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('Missing amount to approve')
      return
    }

    if (!spender) {
      console.error('No spender')
      return
    }

    let useExact = false
    if (isKlip()) {
      await request({
        contractAddress: tokenContract.address,
        abi: getApproveAbi(),
        input: [spender, MAX_UINT_256_KLIP],
        value: '0',
      })
    } else {
      const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true
        return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
      })

      return tokenContract
        .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: KlaytnTransactionResponse) => {
          addTransaction(response, {
            summary: `Approve ${amountToApprove.currency.symbol}`,
            approval: { tokenAddress: token.address, spender },
          })
          toastSuccess(
            t('{{Action}} Complete', {
              Action: t('actionApprove'),
            }),
          )
        })
        .catch((error: Error) => {
          toastError(
            t('{{Action}} Failed', {
              Action: t('actionApprove'),
            }),
          )
          console.error('Failed to approve token', error)
        })
    }
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    chainId,
    account,
    addTransaction,
    toastSuccess,
    t,
    toastError,
  ])

  return [approvalState, approve]
}
// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(chainId, trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage],
  )
  return useApproveCallback(amountToApprove, ROUTER_ADDRESS[chainId])
}
