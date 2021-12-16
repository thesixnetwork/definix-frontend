/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import UsageFacet from '../config/abi/UsageFacet.json'
import { getContract } from '../utils/caver'
import { getFinixAddress, getVFinix } from '../utils/addressHelpers'
import useRefresh from './useRefresh'
/* eslint no-else-return: "error" */

// @ts-ignore
// const useVoting = (tokenAddress: string) => {}

export const useAvailableVotes = () => {
  const [availableVotes, setAvailableVotes] = useState<string>()
  const { account } = useWallet()

  const call = useMemo(() => {
    async function fetchAvailableVotes() {
      if (account) {
        const callContract = getContract(UsageFacet.abi, getVFinix())
        const available = await callContract.methods.getAvailableVotes(account).call({ from: account })
        setAvailableVotes(new BigNumber(available).dividedBy(new BigNumber(10).pow(18)).toString())
      }
    }

    fetchAvailableVotes()
    return availableVotes
  }, [account, availableVotes])

  return call
}

export default useAvailableVotes
