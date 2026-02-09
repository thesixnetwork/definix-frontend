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

const extractRaw = (res: any) => {
  if (!res || typeof res !== 'object') return undefined
  if (typeof (res as any).rawTransaction === 'string') return (res as any).rawTransaction
  if (typeof (res as any).raw === 'string') return (res as any).raw
  return undefined
}

const waitTxVisible = async (rpcCaver: any, hash: string, timeoutMs = 20000, intervalMs = 800) => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const tx = await rpcCaver.klay.getTransactionByHash(hash)
      if (tx) return true
    } catch {}
    await sleep(intervalMs)
  }
  return false
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
    } catch {}
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
      let signed: any
      try {
        signed = await kaiaProv.request({ method: 'klay_signTransaction', params: [tx] })
      } catch {
        signed = undefined
      }

      const raw = extractRaw(signed)
      if (raw) {
        const sent = await rpcCaver.rpc.klay.sendRawTransaction(raw)
        const hash = extractHash(sent) || extractHash(signed)
        if (hash) return hash
        throw new Error('Broadcasted raw tx but no hash returned')
      }

      const sent = await kaiaProv.request({ method: 'klay_sendTransaction', params: [tx] })
      const hash = extractHash(sent)
      if (!hash) throw new Error('Wallet did not return transaction hash')

      const ok = await waitTxVisible(rpcCaver, hash, 20000, 800)
      if (!ok) throw new Error('Transaction signed but not broadcasted to network')

      return hash
    } catch (e: any) {
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

