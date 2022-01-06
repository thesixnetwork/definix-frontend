import Caver from 'caver-js'
import { ethers } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { Trade, TokenAmount, CurrencyAmount, ETHER } from 'definixswap-sdk'
import { KlipConnector } from "@sixnetwork/klip-connector"
import { KlipModalContext } from "@sixnetwork/klaytn-use-wallet"
import { useCallback, useMemo, useContext } from 'react'
import UseDeParam from 'hooks/useDeParam'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { useTranslation } from 'react-i18next'
import { useToast } from 'state/toasts/hooks'
import { ROUTER_ADDRESS } from '../constants'
import { useTokenAllowance } from '../data/Allowances'
import { Field } from '../state/swap/actions'
import { KlaytnTransactionResponse } from '../state/transactions/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './index'
import * as klipProvider from './KlipProvider'
import { getApproveAbi } from './HookHelper'

import ERC20_ABI from '../constants/abis/erc20.json'
import { calculateGasMargin  } from '../utils'


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
  const { account, chainId } = useActiveWeb3React()
  const { setShowModal } = useContext(KlipModalContext())
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation();

  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  const { connector } = useCaverJsReact()
  // const { setShowModal } = useContext(KlipModalContext())
  // check the current approval status
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
    if (isKlipConnector(connector)) {
      const abi = JSON.stringify(getApproveAbi())
      const input = JSON.stringify([spender, '115792089237316195423570985008687907853269984665640564039457584007913129639935'])
      // setShowModal(true)
      await klipProvider.genQRcodeContactInteract(tokenContract.address, abi, input,"0",setShowModal)
      await klipProvider.checkResponse()
      setShowModal(false)
      
    } else {
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    })

    const iface = new ethers.utils.Interface(ERC20_ABI)

    const flagFeeDelegate = await UseDeParam(chainId, 'KLAYTN_FEE_DELEGATE', 'N')

    if (flagFeeDelegate === "Y") {
      const caverFeeDelegate = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
      const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS
      // @ts-ignore
      const caver = new Caver(window.caver)
      // eslint-disable-next-line consistent-return
      return caver.klay
        .signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: account,
          to: token?.address,
          gas: calculateGasMargin(estimatedGas),
          data: iface.encodeFunctionData("approve", [spender, useExact ? amountToApprove.raw.toString() : MaxUint256]),
        })
        .then((userSignTx) => {
          const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
          userSigned.feePayer = feePayerAddress

          return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
            return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).then((tx: KlaytnTransactionResponse) => {
              addTransaction(tx, {
                summary: `Approve ${amountToApprove.currency.symbol}`,
                approval: { tokenAddress: token.address, spender },
              })
            }).catch((error: Error) => {
              console.error('Failed to approve token', error)
            })
          })
        })
        .catch((tx) => {
          return tx.transactionHash
        })
    }

    // eslint-disable-next-line consistent-return
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
  }, [approvalState, token, tokenContract, amountToApprove, spender, connector, setShowModal, chainId, account, addTransaction, toastSuccess, t, toastError])

  return [approvalState, approve]
}
// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(chainId, trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  )
  return useApproveCallback(amountToApprove, ROUTER_ADDRESS[chainId])
}

const isKlipConnector = (connector) => connector instanceof KlipConnector
