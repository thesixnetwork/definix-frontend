import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getHerodotusAddress } from 'utils/addressHelpers'
import { getCaver } from './caver'
import { safeSendContractTx, normalizeTxError } from 'utils/tx'

const caver = getCaver()

export const getEstimateGas = async (method, account, ...args) => {
  const estimateGas = await method(...args).estimateGas({ from: account })
  return estimateGas
}

const toWeiStr = (amount: string | number, decimals = 18) =>
  new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()

const toHexAny = (v: any) => {
  try {
    if (v == null) return undefined
    if (typeof v === 'string') return v.startsWith('0x') ? v : '0x' + BigInt(v).toString(16)
    if (typeof v === 'number') return '0x' + BigInt(Math.trunc(v)).toString(16)
    if (typeof v === 'object' && typeof v.toString === 'function') {
      const s = v.toString()
      return s.startsWith('0x') ? s : '0x' + BigInt(s).toString(16)
    }
    return undefined
  } catch {
    return undefined
  }
}

const toHex = (v: string | number | bigint) => '0x' + BigInt(v as any).toString(16)

const bumpHex = (hex: string | undefined, multiplier = 1.25) => {
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

const buildGasLimitHint = (estGas: any) => bumpHex(toHexAny(estGas), 1.25) || toHexAny(estGas)

/** ----------------------- Approve ----------------------- */

export const approve = async (lpContract, herodotusContract, account: string) => {
  try {
    const spender = herodotusContract.options.address
    let useExact = false
    let estGas: any
    try {
      estGas = await getEstimateGas(lpContract.methods.approve, account, spender, ethers.constants.MaxUint256)
    } catch {
      useExact = true
      try {
        estGas = await getEstimateGas(lpContract.methods.approve, account, spender, '0')
      } catch {
        estGas = undefined
      }
    }

    const data = lpContract.methods.approve(spender, useExact ? '0' : ethers.constants.MaxUint256).encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)

    const txHash = await safeSendContractTx({
      account,
      to: lpContract._address,
      data,
      gasLimitHint,
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const approveOther = async (lpContract, spender: string, account: string) => {
  try {
    let estGas: any
    try {
      estGas = await getEstimateGas(lpContract.methods.approve, account, spender, ethers.constants.MaxUint256)
    } catch {
      estGas = undefined
    }
    const data = lpContract.methods.approve(spender, ethers.constants.MaxUint256).encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)

    const txHash = await safeSendContractTx({
      account,
      to: lpContract._address,
      data,
      gasLimitHint,
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

/** ----------------------- Stake / Unstake (Herodotus) ----------------------- */

export const stake = async (herodotusContract, pid: number, amount: string, account: string) => {
  try {
    const amountWei = toWeiStr(amount)
    if (pid === 0) {
      let estGas: any
      try {
        estGas = await getEstimateGas(herodotusContract.methods.enterStaking, account, amountWei)
      } catch {
        estGas = undefined
      }
      const data = herodotusContract.methods.enterStaking(amountWei).encodeABI()
      const gasLimitHint = buildGasLimitHint(estGas)
      return await safeSendContractTx({ account, to: getHerodotusAddress(), data, gasLimitHint })
    }

    let estGas: any
    try {
      estGas = await getEstimateGas(herodotusContract.methods.deposit, account, pid, amountWei)
    } catch {
      estGas = undefined
    }
    const data = herodotusContract.methods.deposit(pid, amountWei).encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({ account, to: getHerodotusAddress(), data, gasLimitHint })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const unstake = async (herodotusContract, pid: number, amount: string, account: string) => {
  try {
    const amountWei = toWeiStr(amount)
    if (pid === 0) {
      let estGas: any
      try {
        estGas = await getEstimateGas(herodotusContract.methods.leaveStaking, account, amountWei)
      } catch {
        estGas = undefined
      }
      const data = herodotusContract.methods.leaveStaking(amountWei).encodeABI()
      const gasLimitHint = buildGasLimitHint(estGas)
      return await safeSendContractTx({ account, to: getHerodotusAddress(), data, gasLimitHint })
    }

    let estGas: any
    try {
      estGas = await getEstimateGas(herodotusContract.methods.withdraw, account, pid, amountWei)
    } catch {
      estGas = undefined
    }
    const data = herodotusContract.methods.withdraw(pid, amountWei).encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({ account, to: getHerodotusAddress(), data, gasLimitHint })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

/** ----------------------- Sous Stake/Unstake ----------------------- */

export const sousStake = async (sousChefContract, amount: string, account: string) => {
  try {
    const amountWei = toWeiStr(amount)
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.deposit, account, amountWei)
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.deposit(amountWei).encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({ account, to: sousChefContract.options.address, data, gasLimitHint })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const sousStakeBnb = async (sousChefContract, amount: string, account: string) => {
  try {
    const amountWei = toWeiStr(amount)
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.deposit, account)
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.deposit().encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
      gasLimitHint,
      valueHex: toHex(amountWei),
    })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const sousUnstake = async (sousChefContract, amount: string, account: string) => {
  try {
    if (
      sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC' ||
      sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831'
    ) {
      const data = sousChefContract.methods.emergencyWithdraw().encodeABI()
      return await safeSendContractTx({ account, to: sousChefContract.options.address, data })
    }

    const amountWei = toWeiStr(amount)
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.withdraw, account, amountWei)
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.withdraw(amountWei).encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({ account, to: sousChefContract.options.address, data, gasLimitHint })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const sousEmegencyUnstake = async (sousChefContract, _amount: string, account: string) => {
  try {
    const data = sousChefContract.methods.emergencyWithdraw().encodeABI()
    return await safeSendContractTx({ account, to: sousChefContract.options.address, data })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

/** ----------------------- Harvest ----------------------- */

export const harvest = async (herodotusContract, pid: number, account: string) => {
  try {
    if (pid === 0) {
      let estGas: any
      try {
        estGas = await getEstimateGas(herodotusContract.methods.leaveStaking, account, '0')
      } catch {
        estGas = undefined
      }
      const data = herodotusContract.methods.leaveStaking('0').encodeABI()
      const gasLimitHint = buildGasLimitHint(estGas)
      return await safeSendContractTx({ account, to: getHerodotusAddress(), data, gasLimitHint })
    }

    let estGas: any
    try {
      estGas = await getEstimateGas(herodotusContract.methods.deposit, account, pid, '0')
    } catch {
      estGas = undefined
    }
    const data = herodotusContract.methods.deposit(pid, '0').encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({ account, to: getHerodotusAddress(), data, gasLimitHint })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const soushHarvest = async (sousChefContract, account: string) => {
  try {
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.deposit, account, '0')
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.deposit('0').encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({ account, to: sousChefContract.options.address, data, gasLimitHint })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const soushHarvestBnb = async (sousChefContract, account: string) => {
  try {
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.deposit, account)
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.deposit().encodeABI()
    const gasLimitHint = buildGasLimitHint(estGas)
    return await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
      gasLimitHint,
      valueHex: toHex('0'),
    })
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}
