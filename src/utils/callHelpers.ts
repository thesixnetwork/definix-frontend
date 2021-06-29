import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import herodotus from 'config/abi/herodotus.json'
import { getHerodotusAddress } from 'utils/addressHelpers'
// import caverFeeDelegate from '../klaytn/caverFeeDelegate'
import Caver from 'caver-js'

export const approve = async (lpContract, herodotusContract, account) => {
  return lpContract.methods
    .approve(herodotusContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gas: 300000 })
}

export const stake = async (herodotusContract, pid, amount, account) => {
  if (pid === 0) {
    return herodotusContract.methods
      .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas: 300000 })
      .then(function (tx) {
        return tx.transactionHash
      })
      .catch(function (tx) {
        return tx.transactionHash
      })
  }

  return herodotusContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const sousStake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gas: 300000, value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString() })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const unstake = async (herodotusContract, pid, amount, account) => {
  if (pid === 0) {
    return herodotusContract.methods
      .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas: 300000 })
      .then(function (tx) {
        return tx.transactionHash
      })
      .catch(function (tx) {
        return tx.transactionHash
      })
    // .on('transactionHash', (tx) => {
    //   return tx.transactionHash
    // })
  }

  return herodotusContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .then(function (tx) {
        return tx.transactionHash
      })
      .catch(function (tx) {
        return tx.transactionHash
      })
    // .on('transactionHash', (tx) => {
    //   return tx.transactionHash
    // })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .then(function (tx) {
        return tx.transactionHash
      })
      .catch(function (tx) {
        return tx.transactionHash
      })
    // .on('transactionHash', (tx) => {
    //   return tx.transactionHash
    // })
  }

  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const harvest = async (herodotusContract, pid, account) => {
  if (pid === 0) {
    return herodotusContract.methods
      .leaveStaking('0')
      .send({ from: account, gas: 400000 })
      .then(function (tx) {
        return tx.transactionHash
      })
      .catch(function (tx) {
        return tx.transactionHash
      })
    // .on('transactionHash', (tx) => {
    //   return tx.transactionHash
    // })
  }

  // @ts-ignore
  const caver = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
  console.log('caver = ', caver)
  const feePayerAddress = '0x3695a6A9ed1f9488e008c20cF3f3e2c3507aea34'
  const herodotusContractWithFeeDelegate = new caver.klay.Contract(herodotus, getHerodotusAddress())

  const input = herodotusContractWithFeeDelegate.methods.deposit(pid, '0').encodeABI()
  console.log('input = ', input)
  console.log('account = ', account)

  const feeTx = caver.transaction.feeDelegatedSmartContractExecution.create({
    from: account,
    to: getHerodotusAddress(),
    input,
    gas: 3000000,
    feePayer: feePayerAddress,
  })

  console.log('feeDelegatedSmartContractExecution tx = ', feeTx)
  const feePayerSigningResult = await caver.rpc.klay.signTransactionAsFeePayer(feeTx)
  console.log('feePayerSigningResult = ', feePayerSigningResult)
  const feePayerSignedTx = caver.transaction.decode(feePayerSigningResult.raw)
  console.log('feePayerSignedTx.getRLPEncoding = ', feePayerSignedTx.getRLPEncoding())

  // @ts-ignore
  return window.caver.klay
    .signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: account,
      to: getHerodotusAddress(),
      gas: 3000000,
      data: feePayerSignedTx.getRLPEncoding(),
      feePayer: feePayerAddress,
    })
    .then(function (tx) {
      console.log('harvest tx = ', tx)
      return caver.rpc.klay.sendRawTransaction(tx.rawTransaction)
    })
    .catch(function (tx) {
      console.log('harvest error tx = ', tx)
      return tx.transactionHash
    })
  // const result = await caver.rpc.klay.sendRawTransaction(senderSigned)

  // return herodotusContract.methods
  //   .deposit(pid, '0')
  //   .send({ from: account, gas: 400000 })
  //   .then(function (tx) {
  //     console.log('harvest tx = ', tx)
  //     return tx.transactionHash
  //   })
  //   .catch(function (tx) {
  //     console.log('harvest error tx = ', tx)
  //     return tx.transactionHash
  //   })
}

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account, gas: 300000 })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gas: 300000, value: new BigNumber(0) })
    .then(function (tx) {
      return tx.transactionHash
    })
    .catch(function (tx) {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}
