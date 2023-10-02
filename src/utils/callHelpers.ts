import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Web3 from 'web3'

window.web3 = new Web3(window.ethereum)
const web3 = window.web3
const gPrice = web3.eth.getGasPrice()

export const approve = async (lpContract, herodotusContract, account) => {
  return lpContract.methods
    .approve(herodotusContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveOther = async (lpContract, spender, account) => {
  return lpContract.methods.approve(spender, ethers.constants.MaxUint256).send({ from: account, gasPrice: gPrice })
}

export const stake = async (herodotusContract, pid, amount, account) => {
  // const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    return herodotusContract.methods
      .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gasPrice: gPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return herodotusContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gasPrice: gPrice, value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString() })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (herodotusContract, pid, amount, account) => {
  if (pid === 0) {
    return herodotusContract.methods
      .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gasPrice: gPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return herodotusContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstakeVelo = (apolloContract, amount, account) => {
  return apolloContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
export const sousUnstake = async (sousChefContract, amount, account) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (herodotusContract, pid, account) => {
  // const flagFeeDelegate = await UseDeParam('KLAYTN_FEE_DELEGATE', 'N')

  if (pid === 0) {
    return herodotusContract.methods
      .leaveStaking('0')
      .send({ from: account, gasPrice: gPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return herodotusContract.methods
    .deposit(pid, '0')
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gasPrice: gPrice, value: new BigNumber(0) })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const rebalanceHarvest = async (apolloV2Contract, account) => {
  return apolloV2Contract.methods
    .harvest()
    .send({ from: account, gasPrice: gPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
