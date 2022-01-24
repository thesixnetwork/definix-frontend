import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useHerodotus, useFinix, useSousChef, useLottery } from './useContract'
import * as klipProvider from './klipProvider'
import { getAbiERC20ByName } from './hookHelper'
import useWallet from './useWallet'

const jsonConvert = (data: any) => JSON.stringify(data)
// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())
  const herodotusContract = useHerodotus()

  const handleApprove = useCallback(async () => {
    let tx
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        lpContract._address,
        jsonConvert(getAbiERC20ByName('approve')),
        jsonConvert([herodotusContract._address, klipProvider.MAX_UINT_256_KLIP]),
        setShowModal,
      )
      tx = await klipProvider.checkResponse()

      setShowModal(false)
    } else {
      // is inject
      tx = await approve(lpContract, herodotusContract, account)
    }
    dispatch(fetchFarmUserDataAsync(account))
    return tx
  }, [account, dispatch, lpContract, herodotusContract, setShowModal, connector])
  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account, connector }: { account: string; connector: string } = useWallet()
  const sousChefContract = useSousChef(sousId)
  const { setShowModal } = useContext(KlipModalContext())

  const herodotusContract = useHerodotus()
  const handleApprove = useCallback(async () => {
    let tx
    if (connector === 'klip') {
      // setShowModal(true)
      klipProvider.genQRcodeContactInteract(
        lpContract._address,
        jsonConvert(getAbiERC20ByName('approve')),
        jsonConvert([herodotusContract._address, klipProvider.MAX_UINT_256_KLIP]),
        setShowModal,
      )
      tx = await klipProvider.checkResponse()
      dispatch(updateUserAllowance(sousId, account))
      setShowModal(false)
    } else {
      tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
    }
    return tx
  }, [account, dispatch, lpContract, sousChefContract, sousId, connector, setShowModal, herodotusContract])

  return { onApprove: handleApprove }
}

// Approve the lottery
export const useLotteryApprove = () => {
  const { account }: { account: string } = useWallet()
  const finixContract = useFinix()
  const lotteryContract = useLottery()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(finixContract, lotteryContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, finixContract, lotteryContract])

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
