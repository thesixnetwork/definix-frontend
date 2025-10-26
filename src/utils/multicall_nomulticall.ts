import type { AbiItem } from 'web3-utils'
import { getWeb3 } from 'utils/web3'

interface Call {
  address: string
  name: string
  params?: any[]
}

const toArrayStrict = (v: any): any[] => {
  if (Array.isArray(v)) return v
  if (v && typeof v === 'object' && typeof (v as any).length === 'number') return Array.from(v as any)
  return [v]
}

const normalizeByAbi = (fnAbi: any, raw: any): any[] => {
  const outs = Array.isArray(fnAbi?.outputs) ? fnAbi.outputs : []

  if (outs.length <= 1) {
    const arr = toArrayStrict(raw)
    const name = outs[0]?.name
    if (name) (arr as any)[name] = arr[0]
    return arr
  }

  const arr: any[] = []
  for (let i = 0; i < outs.length; i += 1) {
    const name = outs[i]?.name
    const v = raw?.[i] ?? (name ? raw?.[name] : undefined)
    arr.push(v)
    if (name) (arr as any)[name] = v
  }
  return arr
}

const multicall = async (abi: unknown, calls: Call[]): Promise<any[]> => {
  const web3 = getWeb3()
  const abiArr = abi as AbiItem[]

  const results = await Promise.all(
    calls.map(async (call) => {
      const contract = new web3.eth.Contract(abiArr, call.address)
      const fn = (contract.methods as any)[call.name]
      const args = call.params ?? []
      const raw = await fn(...args).call()

      const fnAbi =
        (abiArr as any[]).find((it) => it && (it as any).type === 'function' && (it as any).name === call.name) ||
        undefined

      return normalizeByAbi(fnAbi, raw)
    }),
  )

  return results
}

export const multicallEth = async (account: string) => {
  const web3 = getWeb3()
  const balance = await web3.eth.getBalance(account)
  return balance
}

export default multicall
