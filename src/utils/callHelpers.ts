import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getHerodotusAddress } from 'utils/addressHelpers'
import UseDeParam from 'hooks/useDeParam'
import { getCaver, getCaverInstance, getCaverKlay } from './caver'

const caverFeeDelegate = getCaverInstance()
const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS

const caver = getCaver()
const { signTransaction } = getCaverKlay()

export const handleContractExecute = (
  executeFunction,
  params: {
    account: string
    gasPrice: string
    value?: any
  },
) => {
  const { account: from, ...rest } = params
  return new Promise<any>((resolve, reject) => {
    executeFunction
      .estimateGas({
        from,
      })
      .then((estimatedGasLimit) => {
        executeFunction
          .send({ gas: estimatedGasLimit, from, ...rest })
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}

export const getEstimateGas = async (executeFunction, account) => {
  return await executeFunction.estimateGas({ from: account })
}

export const approve = async (lpContract, herodotusContract, account, gasPrice) => {
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  
  if (flagFeeDelegate === 'Y') {
    const estimatedGas = await getEstimateGas(
      lpContract.methods.approve(herodotusContract.options.address, ethers.constants.MaxUint256),
      account
    )
    return signTransaction({
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

  return handleContractExecute(
    lpContract.methods.approve(herodotusContract.options.address, ethers.constants.MaxUint256),
    {
      account,
      gasPrice,
    },
  )
}

export const approveOther = async (lpContract, spender, account, gasPrice) => {
  return handleContractExecute(lpContract.methods.approve(spender, ethers.constants.MaxUint256), {
    account,
    gasPrice,
  })
}

export const stake = async (herodotusContract, pid, amount, account, gasPrice) => {
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    const estimatedGas = await getEstimateGas(
      herodotusContract.methods.enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
      account,
    )

    if (flagFeeDelegate === 'Y') {
      return signTransaction({
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

    return handleContractExecute(
      herodotusContract.methods.enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
      {
        account,
        gasPrice,
      },
    )
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  const estimatedGas = await getEstimateGas(
    herodotusContract.methods.deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),),
    account,
  )

  if (flagFeeDelegate === 'Y') {
    return signTransaction({
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

  return handleContractExecute(
    herodotusContract.methods.deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
    {
      account,
      gasPrice,
    },
  )
    .then((tx: any) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, account, gasPrice) => {
  return handleContractExecute(
    sousChefContract.methods.deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
    {
      account,
      gasPrice,
    },
  )
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account, gasPrice) => {
  return handleContractExecute(sousChefContract.methods.deposit(), {
    account,
    gasPrice,
    value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
  })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (herodotusContract, pid, amount, account, gasPrice) => {
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    const estimatedGas = await getEstimateGas(
      herodotusContract.methods.leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
      account,
    )
    if (flagFeeDelegate === 'Y') {
      return signTransaction({
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

    return handleContractExecute(
      herodotusContract.methods.leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
      {
        account,
        gasPrice,
      },
    )
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  const estimatedGas = await getEstimateGas(
    herodotusContract.methods.withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),),
    account,
  )
  if (flagFeeDelegate === 'Y') {
    return signTransaction({
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

  return handleContractExecute(
    herodotusContract.methods.withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
    {
      account,
      gasPrice,
    },
  )
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, account, gasPrice) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return handleContractExecute(sousChefContract.methods.emergencyWithdraw(), {
      account,
      gasPrice,
    })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return handleContractExecute(sousChefContract.methods.emergencyWithdraw(), {
      account,
      gasPrice,
    })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((tx) => {
        return tx.transactionHash
      })
  }

  return handleContractExecute(
    sousChefContract.methods.withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()),
    {
      account,
      gasPrice,
    },
  )
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account, gasPrice) => {
  return handleContractExecute(sousChefContract.methods.emergencyWithdraw(), {
    account,
    gasPrice,
  })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (herodotusContract, pid, account, gasPrice) => {
  const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    const estimatedGas = await getEstimateGas(herodotusContract.methods.leaveStaking('0'), account)
    if (flagFeeDelegate === 'Y') {
      return signTransaction({
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

    return handleContractExecute(herodotusContract.methods.leaveStaking('0'), {
      account,
      gasPrice,
    })
      .then((tx) => {
        return tx.transactionHash
      })
      .catch((e) => {
        throw e
      })
  }

  const estimatedGas = await getEstimateGas(herodotusContract.methods.deposit(pid, '0'), account)
  if (flagFeeDelegate === 'Y') {
    return signTransaction({
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

  return handleContractExecute(herodotusContract.methods.deposit(pid, '0'), {
    account,
    gasPrice,
  })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((e) => {
      throw e
    })
}

export const soushHarvest = async (sousChefContract, account, gasPrice) => {
  return handleContractExecute(sousChefContract.methods.deposit('0'), {
    account,
    gasPrice,
  })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account, gasPrice) => {
  return handleContractExecute(sousChefContract.methods.deposit(), {
    account,
    gasPrice,
    value: new BigNumber(0),
  })
    .then((tx) => {
      return tx.transactionHash
    })
    .catch((tx) => {
      return tx.transactionHash
    })
}
