import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useHerodotus, useSousChef } from './useContract'
import { getAbiERC20ByName } from './hookHelper'
import useWallet from './useWallet'
import useKlipContract, { MAX_UINT_256_KLIP } from './useKlipContract'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const { isKlip, request } = useKlipContract()
  const herodotusContract = useHerodotus()

  const handleApprove = useCallback(async () => {
    let tx
    if (isKlip()) {
      tx = await request({
        contractAddress: lpContract._address,
        abi: getAbiERC20ByName('approve'),
        input: [herodotusContract._address, MAX_UINT_256_KLIP],
      })
    } else {
      tx = await approve(lpContract, herodotusContract, account)
    }
    dispatch(fetchFarmUserDataAsync(account))
    return tx
  }, [account, dispatch, lpContract, herodotusContract])
  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const sousChefContract = useSousChef(sousId)
  const { isKlip, request } = useKlipContract()

  const herodotusContract = useHerodotus()
  const handleApprove = useCallback(async () => {
    let tx
    if (isKlip()) {
      tx = await request({
        contractAddress: lpContract._address,
        abi: getAbiERC20ByName('approve'),
        input: [herodotusContract._address, MAX_UINT_256_KLIP],
      })
    } else {
      tx = await approve(lpContract, sousChefContract, account)
    }
    dispatch(updateUserAllowance(sousId, account))
    return tx
  }, [account, dispatch, lpContract, sousChefContract, sousId, herodotusContract])

  return { onApprove: handleApprove }
}

// Approve an IFO
export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { account } = useWallet()
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account })
      return tx
    } catch {
      return false
    }
  }, [account, spenderAddress, tokenContract])

  return onApprove
}
