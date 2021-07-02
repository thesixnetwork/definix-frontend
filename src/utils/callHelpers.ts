import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getHerodotusAddress } from 'utils/addressHelpers'
import Caver from 'caver-js'

const caverFeeDelegate = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS

// @ts-ignore
const caver = new Caver(window.caver)

export const approve = async (lpContract, herodotusContract, account) => {
  return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: lpContract._address,
        gas: 300000,
        data: lpContract.methods.approve(herodotusContract.options.address, ethers.constants.MaxUint256).encodeABI(),
      })
      .then(function (userSignTx) {
        // console.log('userSignTx tx = ', userSignTx)
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        // console.log('userSigned tx = ', userSigned)
        userSigned.feePayer = feePayerAddress
        // console.log('userSigned After add feePayer tx = ', userSigned)

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
          // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
          return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (tx) => {
            console.log('approve tx = ', tx)
          })
        })
      })
      .catch(function (tx) {
        console.log('approve error tx = ', tx)
        return tx.transactionHash
      })
  // return lpContract.methods
  //   .approve(herodotusContract.options.address, ethers.constants.MaxUint256)
  //   .send({ from: account, gas: 300000 })
}

export const stake = async (herodotusContract, pid, amount, account) => {
  // const caverFeeDelegate = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
  // const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS

  // // @ts-ignore
  // const caver = new Caver(window.caver)

  if (pid === 0) {
    return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: getHerodotusAddress(),
        gas: 300000,
        data: herodotusContract.methods.enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).encodeABI(),
      })
      .then(function (userSignTx) {
        // console.log('userSignTx tx = ', userSignTx)
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        // console.log('userSigned tx = ', userSigned)
        userSigned.feePayer = feePayerAddress
        // console.log('userSigned After add feePayer tx = ', userSigned)

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
          // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
          return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
            console.log('stake tx = ', sendTx)
            return sendTx.transactionHash
          })
        })
      })
      .catch(function (tx) {
        console.log('stake error tx = ', tx)
        return tx.transactionHash
      })

    // return herodotusContract.methods
    //   .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    //   .send({ from: account, gas: 300000 })
    //   .then(function (tx) {
    //     return tx.transactionHash
    //   })
    //   .catch(function (tx) {
    //     return tx.transactionHash
    //   })
  }

  return caver.klay
    .signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: account,
      to: getHerodotusAddress(),
      gas: 300000,
      data: herodotusContract.methods.deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).encodeABI(),
    })
    .then(function (userSignTx) {
      // console.log('userSignTx tx = ', userSignTx)
      const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
      // console.log('userSigned tx = ', userSigned)
      userSigned.feePayer = feePayerAddress
      // console.log('userSigned After add feePayer tx = ', userSigned)

      return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
        // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
        return caverFeeDelegate.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
          console.log('stake sendTx tx = ', sendTx)
          return sendTx.transactionHash
        })
      })
    })
    .catch(function (tx) {
      console.log('stake error tx = ', tx)
      return tx.transactionHash
    })

  // return herodotusContract.methods
  //   .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  //   .send({ from: account, gas: 300000 })
  //   .then(function (tx) {
  //     return tx.transactionHash
  //   })
  //   .catch(function (tx) {
  //     return tx.transactionHash
  //   })
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
    return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: getHerodotusAddress(),
        gas: 300000,
        data: herodotusContract.methods.leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).encodeABI(),
      })
      .then(function (userSignTx) {
        // console.log('userSignTx tx = ', userSignTx)
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        // console.log('userSigned tx = ', userSigned)
        userSigned.feePayer = feePayerAddress
        // console.log('userSigned After add feePayer tx = ', userSigned)

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
          // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
          return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
            console.log('unstake tx = ', sendTx)
            return sendTx.transactionHash
          })
        })
      })
      .catch(function (tx) {
        console.log('unstake error tx = ', tx)
        return tx.transactionHash
      })
    // return herodotusContract.methods
    //   .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    //   .send({ from: account, gas: 300000 })
    //   .then(function (tx) {
    //     return tx.transactionHash
    //   })
    //   .catch(function (tx) {
    //     return tx.transactionHash
    //   })
  }

  return caver.klay
    .signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: account,
      to: getHerodotusAddress(),
      gas: 300000,
      data: herodotusContract.methods.withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).encodeABI(),
    })
    .then(function (userSignTx) {
      // console.log('userSignTx tx = ', userSignTx)
      const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
      // console.log('userSigned tx = ', userSigned)
      userSigned.feePayer = feePayerAddress
      // console.log('userSigned After add feePayer tx = ', userSigned)

      return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
        // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
        return caverFeeDelegate.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
          console.log('unstake tx = ', sendTx)
          return sendTx.transactionHash
        })
      })
    })
    .catch(function (tx) {
      console.log('unstake error tx = ', tx)
      return tx.transactionHash
    })

  // return herodotusContract.methods
  //   .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  //   .send({ from: account, gas: 300000 })
  //   .then(function (tx) {
  //     return tx.transactionHash
  //   })
  //   .catch(function (tx) {
  //     return tx.transactionHash
  //   })
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
}

export const harvest = async (herodotusContract, pid, account) => {
  // const caverFeeDelegate = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
  // const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS

  // // @ts-ignore
  // const caver = new Caver(window.caver)

  if (pid === 0) {
    return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: getHerodotusAddress(),
        gas: 300000,
        data: herodotusContract.methods.leaveStaking('0').encodeABI(),
      })
      .then(function (userSignTx) {
        // console.log('userSignTx tx = ', userSignTx)
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        // console.log('userSigned tx = ', userSigned)
        userSigned.feePayer = feePayerAddress
        // console.log('userSigned After add feePayer tx = ', userSigned)

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
          // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
          return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
            console.log('harvest tx = ', sendTx)
            return sendTx.transactionHash
          })
        })
      })
      .catch(function (tx) {
        console.log('harvest error tx = ', tx)
        return tx.transactionHash
      })

    // return herodotusContract.methods
    //   .leaveStaking('0')
    //   .send({ from: account, gas: 300000 })
    //   .then(function (tx) {
    //     return tx.transactionHash
    //   })
    //   .catch(function (tx) {
    //     return tx.transactionHash
    //   })
    // .on('transactionHash', (tx) => {
    //   return tx.transactionHash
    // })
  }

  return caver.klay
    .signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: account,
      to: getHerodotusAddress(),
      gas: 300000,
      data: herodotusContract.methods.deposit(pid, '0').encodeABI(),
    })
    .then(function (userSignTx) {
      // console.log('userSignTx tx = ', userSignTx)
      const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
      // console.log('userSigned tx = ', userSigned)
      userSigned.feePayer = feePayerAddress
      // console.log('userSigned After add feePayer tx = ', userSigned)

      return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
        // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
        return caverFeeDelegate.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
          console.log('harvest tx = ', sendTx)
          return sendTx.transactionHash
        })
      })
    })
    .catch(function (tx) {
      console.log('harvest error tx = ', tx)
      return tx.transactionHash
    })

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
