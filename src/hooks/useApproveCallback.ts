// src/hooks/useApproveCallback.ts
import Caver from 'caver-js'
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
import { getCaver } from 'utils/caver'

// >>> ใช้ helper ใหม่ที่รองรับ D'Cent / fee-delegation / legacy gas
import { safeSendContractTx, normalizeTxError } from 'utils/tx'

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
  const { account, chainId, connector } = useWallet()

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

    // KLIP เส้นทางเดิม (QR / in-app) — คงไว้ไม่แตะ
    if (isKlip()) {
      try {
        await request({
          contractAddress: tokenContract.address,
          abi: getApproveAbi(),
          input: [spender, MAX_UINT_256_KLIP],
          value: '0',
        })
        toastSuccess(
          t('{{Action}} Complete', {
            Action: t('actionApprove'),
          }),
        )
      } catch (e: any) {
        const err = normalizeTxError(e)
        toastError(
          t('{{Action}} Failed', {
            Action: t('actionApprove'),
          }),
          err.message,
        )
        console.error('Failed to approve token (klip)', err)
      }
      return
    }

    // Non-Klip: ใช้ safeSendContractTx (รองรับ D’Cent, Kaikas, MetaMask)
    try {
      // detect token ที่ไม่ยอม max allowance → ถ้า estimateGas MaxUint256 พัง ให้สลับไป exact
      let useExact = false
      const gasEst = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
        useExact = true
        return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
      })

      // เดิมโค้ดใช้ flagFeeDelegate + caver fee-delegation
      // ตอนนี้ย้าย logic ไปอยู่ใน safeSendContractTx แล้ว
      // ตรงนี้ encode data อย่างเดียว
      const iface = new ethers.utils.Interface(ERC20_ABI as any)
      const data = iface.encodeFunctionData('approve', [
        spender,
        useExact ? amountToApprove.raw.toString() : MaxUint256,
      ])

      // เลือก gas limit hint (optional) — ให้ helper estimate เองก็ได้
      const gasLimitHint =
        gasEst && gasEst._isBigNumber ? '0x' + (gasEst as any).toHexString().replace(/^0x/, '') : undefined

      const txHash = await safeSendContractTx({
        account: account as string,
        to: token.address,
        data,
        gasLimitHint, // ปล่อยว่างได้ถ้าอยากให้ helper estimate เอง
        connector: (connector as any) ?? null,
      })

      addTransaction({ hash: txHash } as unknown as KlaytnTransactionResponse, {
        summary: `Approve ${amountToApprove.currency.symbol}`,
        approval: { tokenAddress: token.address, spender },
      })

      toastSuccess(
        t('{{Action}} Complete', {
          Action: t('actionApprove'),
        }),
      )
    } catch (e: any) {
      const err = normalizeTxError(e)
      toastError(
        t('{{Action}} Failed', {
          Action: t('actionApprove'),
        }),
        err.message,
      )
      console.error('Failed to approve token', err)
    }
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    connector,
    account,
    addTransaction,
    toastSuccess,
    t,
    toastError,
    isKlip,
    request,
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
