import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'

import { VaultTopUpFeatureFacetByName } from 'hooks/hookHelper'

import VaultTopUpFeatureFacetAbi from '../config/abi/VaultTopUpFeatureFacet.json'
import IKIP7 from '../config/abi/IKIP7.json'
import { getContract } from '../utils/caver'
import { getFinixAddress, getVFinix } from '../utils/addressHelpers'
import useWallet from './useWallet'
import useKlipContract from './useKlipContract'
import { handleContractExecute } from 'utils/callHelpers'
import { useGasPrice } from 'state/application/hooks'

const useTopUp = () => {
  const [balance] = useState(new BigNumber(0))

  return balance
}

export const useLockPlus = (level, idLastMaxLv, lockFinix) => {
  const [status, setStatus] = useState(false)
  const [loadings, setLoading] = useState('')
  const { account } = useWallet()
  const gasPrice = useGasPrice()
  const { isKlip, request } = useKlipContract()

  const stake = useCallback(async () => {
    setStatus(false)
    setLoading('loading')
    if (lockFinix !== '') {
      if (isKlip()) {
        await request({
          contractAddress: getVFinix(),
          abi: VaultTopUpFeatureFacetByName('lockPlus'),
          input: [level, idLastMaxLv, lockFinix],
        })
        setLoading('success')
        setStatus(true)
        setInterval(() => setLoading(''), 3000)
        setInterval(() => setStatus(false), 3000)
      } else {
        await new Promise((resolve, reject) => {
          const callContract = getContract(VaultTopUpFeatureFacetAbi.abi, getVFinix())
          handleContractExecute(callContract.methods.lockPlus(level, idLastMaxLv, lockFinix), {
            account,
            gasPrice,
          })
            .then(() => {
              setLoading('success')
              setStatus(true)
              resolve(true)
              setInterval(() => setLoading(''), 3000)
              setInterval(() => setStatus(false), 3000)
            })
            .catch(() => {
              setLoading('')
              setStatus(false)
              reject(false)
            })
        })
      }
    } else {
      setStatus(false)
    }

    return status
  }, [account, lockFinix, level, status, idLastMaxLv])

  return { onLockPlus: stake, status, loadings }
}

export const useBalanceTopUp = () => {
  const [balance, setBalanceOf] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchBalance() {
      const callContract = getContract(IKIP7.abi, getFinixAddress())
      try {
        const balanceOf = await callContract.methods.balanceOf(account).call()
        setBalanceOf(new BigNumber(balanceOf).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setBalanceOf(null)
      }
    }

    fetchBalance()
  }, [account])

  return balance
}

export default useTopUp
