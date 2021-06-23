import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
// import caver from '../klaytn/caver'

export const approve = async (lpContract, herodotusContract, account) => {
  return lpContract.methods
    .approve(herodotusContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gas: 300000 })
}

export const stake = async (herodotusContract, pid, amount, account) => {
  if (pid === 0) {
    // const data = caver.klay.abi.encodeFunctionCall(
    //   {
    //     name: 'enterStaking',
    //     type: 'function',
    //     inputs: [
    //       {
    //         type: 'uint256',
    //         name: '_amount',
    //       }
    //     ]
    //   },
    //   [
    //     new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    //   ]
    // )
    // return caver.klay
    //   .sendTransaction({
    //     type: 'SMART_CONTRACT_EXECUTION',
    //     from: account,
    //     to: herodotusContract.options.address,
    //     data,
    //     gas: 300000
    //   })
    //   .on('transactionHash', (tx) => {
    //     return tx.transactionHash
    //   })
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
      .send({ from: account, gas: 500000 })
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
    .deposit(pid, '0')
    .send({ from: account, gas: 300000 })
    .then(function (tx) {
      console.log('harvest tx = ', tx)
      return tx.transactionHash
    })
    .catch(function (tx) {
      console.log('harvest error tx = ', tx)
      return tx.transactionHash
    })
  // .on('transactionHash', (tx) => {
  //   return tx.transactionHash
  // })
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
