import Caver from 'caver-js'
import { ethers } from 'ethers'
import getRpcUrl from 'utils/getRpcUrl'
import { AvailableConnectors } from 'six-kaia-wallet-kit'

type SendOpts = {
  account: string
  to: string
  data: string
  valueHex?: string
  gasLimitHint?: string
  gasPriceHint?: string
  connector?: AvailableConnectors | null
}

const isHex = (s: any) => typeof s === 'string' && s.startsWith('0x')

const toHex = (v: any) => {
  try {
    if (v == null) return undefined
    if (typeof v === 'string') {
      if (v.startsWith('0x')) return v
      return '0x' + BigInt(v).toString(16)
    }
    if (typeof v === 'number') return '0x' + BigInt(Math.trunc(v)).toString(16)
    if (typeof v === 'object' && typeof v.toString === 'function') {
      const s = v.toString()
      if (isHex(s)) return s
      return '0x' + BigInt(s).toString(16)
    }
    return undefined
  } catch {
    return undefined
  }
}

const bumpHex = (hex: string | undefined, multiplier = 1.6) => {
  if (!hex) return undefined
  try {
    const n = BigInt(hex)
    const scaled = BigInt(Math.floor(multiplier * 1000))
    const result = (n * scaled) / BigInt(1000)
    return '0x' + result.toString(16)
  } catch {
    return undefined
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const extractHash = (res: any) => {
  if (typeof res === 'string') return res
  if (res && typeof res === 'object') {
    if (typeof (res as any).transactionHash === 'string') return (res as any).transactionHash
    if (typeof (res as any).hash === 'string') return (res as any).hash
    if (typeof (res as any).result === 'string') return (res as any).result
  }
  return undefined
}

const extractRaw = (res: any): string | undefined => {
  if (!res || typeof res !== 'object') return undefined
  // Standard formats
  if (typeof (res as any).rawTransaction === 'string') return (res as any).rawTransaction
  if (typeof (res as any).raw === 'string') return (res as any).raw
  // DCent / hardware wallet formats
  if (typeof (res as any).result === 'string' && (res as any).result.startsWith('0x')) {
    return (res as any).result
  }
  // Nested tx object
  if ((res as any).tx && typeof (res as any).tx === 'object') {
    if (typeof (res as any).tx.rawTransaction === 'string') return (res as any).tx.rawTransaction
    if (typeof (res as any).tx.raw === 'string') return (res as any).tx.raw
  }
  // Check for signed transaction data
  if (typeof (res as any).signedTransaction === 'string') return (res as any).signedTransaction
  return undefined
}

/**
 * Extracts a transaction hash from a wallet error object.
 * Kaia Wallet includes the full receipt in "reverted" errors, allowing us to verify on-chain.
 */
const extractHashFromError = (err: any): string | undefined => {
  if (!err) return undefined

  // Direct transactionHash in error
  if (typeof err?.transactionHash === 'string') return err.transactionHash

  // Nested in data property (common in Kaia Wallet errors)
  if (typeof err?.data?.transactionHash === 'string') return err.data.transactionHash

  // Check error message for a hash pattern (0x followed by 64 hex chars)
  const msg = err?.message || err?.data?.message || ''
  if (typeof msg === 'string') {
    const hashMatch = msg.match(/0x[a-fA-F0-9]{64}/)
    if (hashMatch) return hashMatch[0]
  }

  // Check if error itself contains receipt-like structure
  if (err?.blockHash && err?.transactionIndex !== undefined) {
    return err.transactionHash
  }

  // Deep search in error object for transactionHash
  try {
    const errStr = JSON.stringify(err)
    const match = errStr.match(/"transactionHash"\s*:\s*"(0x[a-fA-F0-9]{64})"/)
    if (match) return match[1]
  } catch { }

  return undefined
}

const waitTxVisible = async (rpcCaver: any, hash: string, timeoutMs = 20000, intervalMs = 800) => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const tx = await rpcCaver.klay.getTransactionByHash(hash)
      if (tx) return true
    } catch { }
    await sleep(intervalMs)
  }
  return false
}

/**
 * Verifies transaction status on-chain by checking the receipt.
 * This helps detect false wallet errors (e.g., wallet shows "reverted" but tx actually succeeded).
 * @returns { success: boolean, status: string, receipt: any }
 */
const verifyTxOnChain = async (
  rpcCaver: any,
  hash: string,
  timeoutMs = 30000,
  intervalMs = 2000
): Promise<{ success: boolean; status: string; receipt: any }> => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const receipt = await rpcCaver.klay.getTransactionReceipt(hash)
      if (receipt) {
        // status "0x1" = success, "0x0" = failed
        const success = receipt.status === '0x1' || receipt.status === 1 || receipt.status === true
        const status = success ? 'success' : 'failed'
        return { success, status, receipt }
      }
    } catch { }
    await sleep(intervalMs)
  }
  return { success: false, status: 'pending', receipt: null }
}

const getRpcCaver = () => {
  const rpcUrl = getRpcUrl()
  const httpProvider = new Caver.providers.HttpProvider(rpcUrl)
  return new Caver(httpProvider)
}

export async function safeSendContractTx(opts: SendOpts): Promise<string> {
  const { account, to, data, valueHex = '0x0', gasLimitHint, gasPriceHint } = opts

  const isKaia = typeof (window as any)?.klaytn !== 'undefined'
  const kaiaProv: any = isKaia ? (window as any).klaytn : null

  const rpcCaver = getRpcCaver()

  let gpHex = toHex(gasPriceHint)
  if (!gpHex) {
    try {
      gpHex = toHex(await rpcCaver.klay.getGasPrice())
    } catch { }
  }
  if (!gpHex) gpHex = '0x3b9aca00'
  const finalGasPriceHex = bumpHex(gpHex, 2.0) || bumpHex(gpHex, 1.6) || gpHex

  let gasHex = toHex(gasLimitHint)
  if (!gasHex) {
    try {
      const est = await rpcCaver.klay.estimateGas({ from: account, to, data, value: valueHex })
      const estHex = toHex(est)
      gasHex = bumpHex(estHex, 1.25) || estHex
    } catch {
      gasHex = '0x7a120'
    }
  }

  if (isKaia) {
    const tx = {
      from: account,
      to,
      gas: gasHex!,
      gasPrice: finalGasPriceHex,
      value: valueHex,
      data,
    }

    try {
      // Create a promise that times out - helps detect if wallet hangs
      const sendWithTimeout = async (timeoutMs: number) => {
        return new Promise<any>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error('Transaction request timed out. Please check your wallet.'))
          }, timeoutMs)

          kaiaProv
            .request({ method: 'klay_sendTransaction', params: [tx] })
            .then((result: any) => {
              clearTimeout(timer)
              resolve(result)
            })
            .catch((err: any) => {
              clearTimeout(timer)
              reject(err)
            })
        })
      }

      // 120 second timeout for hardware wallet signing
      const sent = await sendWithTimeout(120000)
      const hash = extractHash(sent)
      if (!hash) throw new Error('Wallet did not return transaction hash')

      await waitTxVisible(rpcCaver, hash, 30000, 1000)
      return hash
    } catch (e: any) {
      // Check if the wallet error contains a transaction hash
      // (Kaia Wallet sometimes shows "reverted" errors for successful transactions)
      // Check if the wallet error contains a transaction hash
      // (Kaia Wallet sometimes shows false "reverted" errors for successful transactions)
      const errorHash = extractHashFromError(e)
      if (errorHash) {
        const verification = await verifyTxOnChain(rpcCaver, errorHash)
        if (verification.success) return errorHash
      }
      throw normalizeTxError(e)
    }
  }

  try {
    const ethProvider = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = ethProvider.getSigner()
    const txResp = await signer.sendTransaction({
      to,
      data,
      value: valueHex,
      gasLimit: gasHex ? ethers.BigNumber.from(gasHex) : undefined,
      gasPrice: ethers.BigNumber.from(finalGasPriceHex),
    })
    return txResp.hash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export function normalizeTxError(e: any): Error {
  const m =
    e?.data?.message || e?.error?.message || e?.message || (typeof e === 'object' ? JSON.stringify(e) : String(e))
  return new Error(m)
}
