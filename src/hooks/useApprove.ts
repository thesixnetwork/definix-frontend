import { Contract } from 'web3-eth-contract'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useHerodotus, useFinix, useSousChef, useLottery } from './useContract'
import { getAbiERC20ByName } from './hookHelper'
import useWallet from './useWallet'
import useKlipContract, { MAX_UINT_256_KLIP } from './useKlipContract'
import { useGasPrice } from 'state/application/hooks'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const gasPrice = useGasPrice()
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
      tx = await approve(lpContract, herodotusContract, account, gasPrice)
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
  const gasPrice = useGasPrice()
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
      tx = await approve(lpContract, sousChefContract, account, gasPrice)
    }
    dispatch(updateUserAllowance(sousId, account))
    return tx
  }, [account, dispatch, lpContract, sousChefContract, sousId, herodotusContract])

  return { onApprove: handleApprove }
}

// Approve the lottery
export const useLotteryApprove = () => {
  const { account }: { account: string } = useWallet()
  const gasPrice = useGasPrice()
  const finixContract = useFinix()
  const lotteryContract = useLottery()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(finixContract, lotteryContract, account, gasPrice)
      return tx
    } catch (e) {
      return false
    }
  }, [account, finixContract, lotteryContract])

  return { onApprove: handleApprove }
}
