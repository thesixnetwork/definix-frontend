/* eslint-disable no-shadow */
import { useState, useCallback, useContext } from 'react'
import BigNumber from 'bignumber.js'

import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { VaultTopUpFeatureFacetByName } from 'hooks/hookHelper'
import * as klipProvider from 'hooks/klipProvider'
import VaultTopUpFeatureFacetAbi from '../config/abi/VaultTopUpFeatureFacet.json'
import { getContract } from '../utils/caver'
import { getVFinix } from '../utils/addressHelpers'
/* eslint no-else-return: "error" */

// @ts-ignore
const useTopUp = () => {
  const [balance] = useState(new BigNumber(0))

  return balance
}

export const useLockPlus = (level, idLastMaxLv, lockFinix) => {
  const [status, setStatus] = useState(false)
  const [loadings, setLoading] = useState('')
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const stake = useCallback(async () => {
    setStatus(false)
    setLoading('loading')
    if (lockFinix !== '') {
      try {
        if (connector === 'klip') {
          klipProvider.genQRcodeContactInteract(
            getVFinix(),
            JSON.stringify(VaultTopUpFeatureFacetByName('lockPlus')),
            JSON.stringify([level, idLastMaxLv, lockFinix]),
            setShowModal,
          )
          await klipProvider.checkResponse()
          setShowModal(false)
          setLoading('success')
          setStatus(true)
          setInterval(() => setLoading(''), 3000)
          setInterval(() => setStatus(false), 3000)
        } else {
          const callContract = getContract(VaultTopUpFeatureFacetAbi.abi, getVFinix())
          await callContract.methods
            .lockPlus(level, idLastMaxLv, lockFinix)
            .estimateGas({ from: account })
            .then((estimatedGasLimit) => {
              callContract.methods
                .lockPlus(level, idLastMaxLv, lockFinix)
                .send({ from: account, gas: estimatedGasLimit })
                .then(() => {
                  setLoading('success')
                  setStatus(true)
                  setInterval(() => setLoading(''), 3000)
                  setInterval(() => setStatus(false), 3000)
                })
                .catch(() => {
                  setLoading('')
                  setStatus(false)
                })
            })
        }
      } catch (e) {
        setStatus(false)
      }
    } else {
      setStatus(false)
    }

    return status
  }, [account, connector, lockFinix, setShowModal, level, status, idLastMaxLv])

  return { onLockPlus: stake, status, loadings }
}

export default useTopUp
