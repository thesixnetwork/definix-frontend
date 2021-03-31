import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getProfileContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'
import { useToast } from 'state/hooks'

const useGetProfileCosts = () => {
  const [costs, setCosts] = useState({
    numberFinixToReactivate: new BigNumber(0),
    numberFinixToRegister: new BigNumber(0),
    numberFinixToUpdate: new BigNumber(0),
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const profileContract = getProfileContract()
        const [numberFinixToReactivate, numberFinixToRegister, numberFinixToUpdate] = await makeBatchRequest([
          profileContract.methods.numberFinixToReactivate().call,
          profileContract.methods.numberFinixToRegister().call,
          profileContract.methods.numberFinixToUpdate().call,
        ])

        setCosts({
          numberFinixToReactivate: new BigNumber(numberFinixToReactivate as string),
          numberFinixToRegister: new BigNumber(numberFinixToRegister as string),
          numberFinixToUpdate: new BigNumber(numberFinixToUpdate as string),
        })
      } catch (error) {
        toastError('Error', 'Could not retrieve FINIX costs for profile')
      }
    }

    fetchCosts()
  }, [setCosts, toastError])

  return costs
}

export default useGetProfileCosts
