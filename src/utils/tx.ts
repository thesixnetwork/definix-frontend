// src/utils/tx.ts
import Caver from 'caver-js'
import { ethers } from 'ethers'
import { getCaver } from 'utils/caver'
import KlaytnWallet, { AvailableConnectors } from 'six-kaia-wallet-kit'

type SendOpts = {
  account: string
  to: string
  data: string
  valueHex?: string // '0x0' normally
  gasLimitHint?: string // hex string
  connector?: AvailableConnectors | null
}

/**
 * ปลอดภัยกับ D'Cent/Kaikas:
 * - ถ้าใช้ Kaia (window.klaytn) จะส่ง legacy tx (gas + gasPrice) เท่านั้น
 * - ถ้า Fee-Delegation พร้อมจริง (env ครบ) ค่อยใช้ FEE_DELEGATED_* ไม่งั้น fallback
 * - คืนค่า transactionHash เสมอ (ถ้าส่งสำเร็จ)
 */
export async function safeSendContractTx(opts: SendOpts): Promise<string> {
  const { account, to, data, valueHex = '0x0', gasLimitHint, connector } = opts

  // เช็ค provider Kaia/Kaikas/D'Cent
  const isKaia = typeof (window as any)?.klaytn !== 'undefined'
  const kaiaProv: any = isKaia ? (window as any).klaytn : null

  // เลือกใช้ caver สำหรับ Kaia
  const caver = getCaver()

  // ดึง gas price แบบ legacy
  let gasPriceHex = '0x3b9aca00' // 1 Gwei default safety
  try {
    const gp = await caver.klay.getGasPrice()
    gasPriceHex = '0x' + BigInt(gp).toString(16)
  } catch (_) {
    // keep default
  }

  // gas limit (ถ้า estimate ไม่ได้ ให้ค่าเผื่อ)
  let gasLimit = gasLimitHint
  if (!gasLimit) {
    try {
      const est = await caver.klay.estimateGas({ from: account, to, data, value: valueHex })
      gasLimit = '0x' + BigInt(est).toString(16)
    } catch (_e) {
      gasLimit = '0x5208' // 21000 (กันพัง; contract call ส่วนใหญ่ใช้มากกว่านี้ แต่อย่างน้อยไม่ throw)
    }
  }

  // ตัดสินใจเรื่อง Fee-Delegation
  const enUrl = process.env.REACT_APP_SIX_KLAYTN_EN_URL
  const feePayer = process.env.REACT_APP_FEE_PAYER_ADDRESS
  const canFeeDelegate = Boolean(enUrl && feePayer && false)

  // ถ้าอยู่บน Kaia & ใช้ D'Cent/Kaikas → พยายามส่งให้ผ่านกระเป๋า
  if (isKaia) {
    // 2 เส้นทาง:
    // 2.1 ถ้า fee-delegation พร้อม -> ลองก่อน
    if (canFeeDelegate) {
      try {
        const caverFeeDelegate = new Caver(enUrl as string)
        const userSigned = await caver.klay.signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: account,
          to,
          gas: gasLimit!,
          gasPrice: gasPriceHex,
          value: valueHex,
          data,
        })
        const decoded = caver.transaction.decode((userSigned as any).rawTransaction)
        ;(decoded as any).feePayer = feePayer
        const feePayerSigned = await caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(decoded as any)
        const sent = await caverFeeDelegate.rpc.klay.sendRawTransaction((feePayerSigned as any).raw)
        const hash: string = (sent as any)?.transactionHash || (sent as any)
        if (hash) return hash
      } catch (e) {
        // ถ้า fail ให้ตกไปเส้นทางธรรมดา
      }
    }

    // 2.2 ธรรมดา (legacy) ผ่าน wallet
    try {
      // บางกระเป๋ารับ kaia_requestAccounts / klay_sendTransaction ต่างกัน
      const method = 'klay_sendTransaction'
      const tx = {
        from: account,
        to,
        gas: gasLimit!,
        gasPrice: gasPriceHex,
        value: valueHex,
        data,
      }
      const hash = await kaiaProv.request({ method, params: [tx] })
      if (typeof hash === 'string') return hash
    } catch (e: any) {
      throw normalizeTxError(e)
    }
  }

  // ถ้าไม่ใช่ Kaia (กรณีไปเชน EVM อื่น) → ใช้ ethers legacy override
  try {
    const ethProvider = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = ethProvider.getSigner()
    const txResp = await signer.sendTransaction({
      to,
      data,
      value: valueHex,
      // บังคับ legacy บางราย
      gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined,
      gasPrice: ethers.BigNumber.from(gasPriceHex),
      // ห้ามส่ง maxFeePerGas/maxPriority บน wallet ที่ไม่รองรับ EIP-1559
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
