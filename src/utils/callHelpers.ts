// src/utils/callHelpers.ts
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getHerodotusAddress } from 'utils/addressHelpers'
import { getCaver, getContract } from './caver'
import { safeSendContractTx, normalizeTxError } from 'utils/tx'

const caver = getCaver()

/** เดิมใช้บ่อย — เก็บไว้ให้ */
export const getEstimateGas = async (method, account, ...args) => {
  const estimateGas = await method(...args).estimateGas({ from: account })
  return estimateGas
}

const toWeiStr = (amount: string | number, decimals = 18) =>
  new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()

const toHex = (v: string | number | bigint) => '0x' + BigInt(v as any).toString(16)

/** ----------------------- Approve ----------------------- */

export const approve = async (lpContract, herodotusContract, account: string) => {
  try {
    const spender = herodotusContract.options.address
    // try estimate both Max and exact ifบาง tokenไม่ยอม max
    let useExact = false
    let estGas: any
    try {
      estGas = await getEstimateGas(lpContract.methods.approve, account, spender, ethers.constants.MaxUint256)
    } catch {
      useExact = true
      // ถ้ายังพัง ให้เดา gas ทีหลังใน helper
      try {
        estGas = await getEstimateGas(lpContract.methods.approve, account, spender, '0')
      } catch {
        estGas = undefined
      }
    }

    const data = lpContract.methods
      .approve(spender, useExact ? '0' : ethers.constants.MaxUint256)
      .encodeABI()

    const gasLimitHint =
      estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined

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
    const gasLimitHint =
      estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined

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
    if (pid === 0) {
      const amountWei = toWeiStr(amount)
      let estGas: any
      try {
        estGas = await getEstimateGas(herodotusContract.methods.enterStaking, account, amountWei)
      } catch {
        estGas = undefined
      }
      const data = herodotusContract.methods.enterStaking(amountWei).encodeABI()
      const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
      const txHash = await safeSendContractTx({
        account,
        to: getHerodotusAddress(),
        data,
        gasLimitHint,
      })
      return txHash
    }

    const amountWei = toWeiStr(amount)
    let estGas: any
    try {
      estGas = await getEstimateGas(herodotusContract.methods.deposit, account, pid, amountWei)
    } catch {
      estGas = undefined
    }
    const data = herodotusContract.methods.deposit(pid, amountWei).encodeABI()
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: getHerodotusAddress(),
      data,
      gasLimitHint,
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const unstake = async (herodotusContract, pid: number, amount: string, account: string) => {
  try {
    if (pid === 0) {
      const amountWei = toWeiStr(amount)
      let estGas: any
      try {
        estGas = await getEstimateGas(herodotusContract.methods.leaveStaking, account, amountWei)
      } catch {
        estGas = undefined
      }
      const data = herodotusContract.methods.leaveStaking(amountWei).encodeABI()
      const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
      const txHash = await safeSendContractTx({
        account,
        to: getHerodotusAddress(),
        data,
        gasLimitHint,
      })
      return txHash
    }

    const amountWei = toWeiStr(amount)
    let estGas: any
    try {
      estGas = await getEstimateGas(herodotusContract.methods.withdraw, account, pid, amountWei)
    } catch {
      estGas = undefined
    }
    const data = herodotusContract.methods.withdraw(pid, amountWei).encodeABI()
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: getHerodotusAddress(),
      data,
      gasLimitHint,
    })
    return txHash
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
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
      gasLimitHint,
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const sousStakeBnb = async (sousChefContract, amount: string, account: string) => {
  try {
    // deposit() payable: value = amountWei
    const amountWei = toWeiStr(amount)
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.deposit, account)
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.deposit().encodeABI()
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
      gasLimitHint,
      valueHex: toHex(amountWei),
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const sousUnstake = async (sousChefContract, amount: string, account: string) => {
  try {
    // hard fix for old CTK / BLK (คง logic เดิม)
    if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
      const data = sousChefContract.methods.emergencyWithdraw().encodeABI()
      const txHash = await safeSendContractTx({
        account,
        to: sousChefContract.options.address,
        data,
      })
      return txHash
    }
    if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
      const data = sousChefContract.methods.emergencyWithdraw().encodeABI()
      const txHash = await safeSendContractTx({
        account,
        to: sousChefContract.options.address,
        data,
      })
      return txHash
    }

    const amountWei = toWeiStr(amount)
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.withdraw, account, amountWei)
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.withdraw(amountWei).encodeABI()
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
      gasLimitHint,
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const sousEmegencyUnstake = async (sousChefContract, _amount: string, account: string) => {
  try {
    const data = sousChefContract.methods.emergencyWithdraw().encodeABI()
    const txHash = await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

/** ----------------------- Harvest ----------------------- */

export const harvest = async (herodotusContract, pid: number, account: string) => {
  try {
    if (pid === 0) {
      // leaveStaking('0')
      let estGas: any
      try {
        estGas = await getEstimateGas(herodotusContract.methods.leaveStaking, account, '0')
      } catch {
        estGas = undefined
      }
      const data = herodotusContract.methods.leaveStaking('0').encodeABI()
      const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
      const txHash = await safeSendContractTx({
        account,
        to: getHerodotusAddress(),
        data,
        gasLimitHint,
      })
      return txHash
    }

    // deposit(pid, '0')
    let estGas: any
    try {
      estGas = await getEstimateGas(herodotusContract.methods.deposit, account, pid, '0')
    } catch {
      estGas = undefined
    }
    const data = herodotusContract.methods.deposit(pid, '0').encodeABI()
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: getHerodotusAddress(),
      data,
      gasLimitHint,
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

export const soushHarvest = async (sousChefContract, account: string) => {
  try {
    // deposit('0')
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.deposit, account, '0')
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.deposit('0').encodeABI()
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
      gasLimitHint,
    })
    return txHash
  } catch (e: any) {
    // อันเดิม return tx.transactionHash เสมอ; ที่นี่ถ้า fail ให้โยน error อ่านง่ายแทน
    throw normalizeTxError(e)
  }
}

export const soushHarvestBnb = async (sousChefContract, account: string) => {
  try {
    // deposit() with value 0
    let estGas: any
    try {
      estGas = await getEstimateGas(sousChefContract.methods.deposit, account)
    } catch {
      estGas = undefined
    }
    const data = sousChefContract.methods.deposit().encodeABI()
    const gasLimitHint = estGas && estGas._isBigNumber ? (estGas as any).toHexString() : undefined
    const txHash = await safeSendContractTx({
      account,
      to: sousChefContract.options.address,
      data,
      gasLimitHint,
      valueHex: toHex('0'),
    })
    return txHash
  } catch (e: any) {
    throw normalizeTxError(e)
  }
}

