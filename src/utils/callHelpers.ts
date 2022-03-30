import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getHerodotusAddress } from 'utils/addressHelpers'
import UseDeParam from 'hooks/useDeParam'
import Caver from 'caver-js'
import { getCaver } from './caver'
import { getCaverKlay } from './lib'

const caverFeeDelegate = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS

const caver = getCaver()

export const getEstimateGas = async (method, account, ...args) => {
  const estimateGas = await method(...args).estimateGas({ from: account })
  return estimateGas * 2
}

export const approve = async (lpContract, herodotusContract, account) => {
  const gasPrice = await getCaverKlay().getGasPrice()

  return lpContract.methods
    .approve(herodotusContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gasPrice })
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  const estimatedGas = await getEstimateGas(
    lpContract.methods.approve,
    account,
    herodotusContract.options.address,
    ethers.constants.MaxUint256,
  )

  if (flagFeeDelegate === 'Y') {
    return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: lpContract._address,
        gas: estimatedGas,
        data: lpContract.methods.approve(herodotusContract.options.address, ethers.constants.MaxUint256).encodeABI(),
      })
      .then((userSignTx) => {
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        userSigned.feePayer = feePayerAddress

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
          return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw)
        })
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  return lpContract.methods
    .approve(herodotusContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gasPrice })
}

export const approveOther = async (lpContract, spender, account) => {
  return lpContract.methods.approve(spender, ethers.constants.MaxUint256).send({ from: account, gas: 30 * 300000 })
}

export const stake = async (herodotusContract, pid, amount, account) => {
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    const estimatedGas = await getEstimateGas(
      herodotusContract.methods.enterStaking,
      account,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )

    if (flagFeeDelegate === 'Y') {
      return caver.klay
        .signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: account,
          to: getHerodotusAddress(),
          gas: estimatedGas,
          data: herodotusContract.methods
            .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
            .encodeABI(),
        })
        .then((userSignTx) => {
          const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
          userSigned.feePayer = feePayerAddress

          return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
            return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
              return sendTx.transactionHash
            })
          })
        })
        .catch((tx) => {
          return tx.transactionHash
        })
    }

    return herodotusContract.methods
      .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas: estimatedGas })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  const estimatedGas = await getEstimateGas(
    herodotusContract.methods.deposit,
    account,
    pid,
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
  )

  if (flagFeeDelegate === 'Y') {
    return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: getHerodotusAddress(),
        gas: estimatedGas,
        data: herodotusContract.methods
          .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
          .encodeABI(),
      })
      .then((userSignTx) => {
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        userSigned.feePayer = feePayerAddress

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
          return caverFeeDelegate.rpc.klay
            .sendRawTransaction(feePayerSigningResult.raw)
            .on('transactionHash', (sendTx) => {
              return sendTx.transactionHash
            })
        })
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  return herodotusContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: estimatedGas })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, account) => {
  const estimatedGas = await getEstimateGas(
    sousChefContract.methods.deposit,
    account,
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
  )
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: estimatedGas })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  const estimatedGas = await getEstimateGas(sousChefContract.methods.deposit, account)
  return sousChefContract.methods
    .deposit()
    .send({
      from: account,
      gas: estimatedGas,
      value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const unstake = async (herodotusContract, pid, amount, account) => {
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    const estimatedGas = await getEstimateGas(
      herodotusContract.methods.leaveStaking,
      account,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    if (flagFeeDelegate === 'Y') {
      return caver.klay
        .signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: account,
          to: getHerodotusAddress(),
          gas: estimatedGas,
          data: herodotusContract.methods
            .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
            .encodeABI(),
        })
        .then((userSignTx) => {
          const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
          userSigned.feePayer = feePayerAddress

          return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
            return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
              return sendTx.transactionHash
            })
          })
        })
        .catch((tx) => {
          return tx.transactionHash
        })
    }

    return herodotusContract.methods
      .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas: estimatedGas })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  const estimatedGas = await getEstimateGas(
    herodotusContract.methods.withdraw,
    account,
    pid,
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
  )
  if (flagFeeDelegate === 'Y') {
    return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: getHerodotusAddress(),
        gas: estimatedGas,
        data: herodotusContract.methods
          .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
          .encodeABI(),
      })
      .then((userSignTx) => {
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        userSigned.feePayer = feePayerAddress

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
          return caverFeeDelegate.rpc.klay
            .sendRawTransaction(feePayerSigningResult.raw)
            .on('transactionHash', (sendTx) => {
              return sendTx.transactionHash
            })
        })
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  return herodotusContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: estimatedGas })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  const estimatedGas = await getEstimateGas(
    sousChefContract.methods.withdraw,
    account,
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
  )
  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: estimatedGas })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (herodotusContract, pid, account) => {
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    const estimatedGas = await getEstimateGas(herodotusContract.methods.leaveStaking, account, '0')
    if (flagFeeDelegate === 'Y') {
      return caver.klay
        .signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: account,
          to: getHerodotusAddress(),
          gas: estimatedGas,
          data: herodotusContract.methods.leaveStaking('0').encodeABI(),
        })
        .then((userSignTx) => {
          const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
          userSigned.feePayer = feePayerAddress

          return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
            return caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).on('transactionHash', (sendTx) => {
              return sendTx.transactionHash
            })
          })
        })
        .catch((e) => {
          throw e
        })
    }

    return herodotusContract.methods
      .leaveStaking('0')
      .send({ from: account, gas: estimatedGas })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((e) => {
        throw e
      })
    // .on('transactionHash', (tx) => {
    //   return tx.transactionHash
    // })
  }

  const estimatedGas = await getEstimateGas(herodotusContract.methods.deposit, account, pid, '0')
  if (flagFeeDelegate === 'Y') {
    return caver.klay
      .signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: account,
        to: getHerodotusAddress(),
        gas: estimatedGas,
        data: herodotusContract.methods.deposit(pid, '0').encodeABI(),
      })
      .then((userSignTx) => {
        const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
        userSigned.feePayer = feePayerAddress

        return caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then((feePayerSigningResult) => {
          return caverFeeDelegate.rpc.klay
            .sendRawTransaction(feePayerSigningResult.raw)
            .on('transactionHash', (sendTx) => {
              return sendTx.transactionHash
            })
        })
      })
      .catch((e) => {
        throw e
      })
  }

  return herodotusContract.methods
    .deposit(pid, '0')
    .send({ from: account, gas: estimatedGas })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((e) => {
      throw e
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  const estimatedGas = await getEstimateGas(sousChefContract.methods.deposit, account, '0')
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account, gas: estimatedGas })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  const estimatedGas = await getEstimateGas(sousChefContract.methods.deposit, account)
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gas: estimatedGas, value: new BigNumber(0) })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
}
