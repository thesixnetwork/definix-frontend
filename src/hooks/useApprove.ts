
import { useCallback } from 'react'
import { useWallet } from 'klaytn-use-wallet'
import { Contract } from 'web3-eth-contract'
import Caver from 'caver-js'
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import erc20 from 'config/abi/erc20.json'
import { useHerodotus, useFinix, useSousChef, useLottery } from './useContract'
import * as klipProvider from './klipProvider'


const jsonConvert = (data:any)=> JSON.stringify(data)

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const herodotusContract = useHerodotus()

  const handleApprove = useCallback(
    async (connector: string, showKlipModal: (state: boolean) => void) => {
      try {
        console.log("iinfn", lpContract._address, "he ", connector)
        let tx
        switch (connector) {
          case 'klip':
            showKlipModal(true)
            console.log(lpContract, "he ", herodotusContract)
            klipProvider.genQRcodeContactInteract(lpContract._address, 
              jsonConvert(erc20[1]), 
              jsonConvert([herodotusContract._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935"])
              )
            tx = await klipProvider.checkResponse()
            
            showKlipModal(false)
            break
          default:// is inject
            tx = await approve(lpContract, herodotusContract, account)
            break
        }
        dispatch(fetchFarmUserDataAsync(account))
        return tx
      } catch (e) {
        return false
      }
    },
    [account, dispatch, lpContract, herodotusContract],
  )

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const sousChefContract = useSousChef(sousId)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId])

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
