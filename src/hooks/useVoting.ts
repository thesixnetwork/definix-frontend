/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import moment from 'moment'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { getAbiVaultFacetByName } from 'hooks/hookHelper'
import * as klipProvider from 'hooks/klipProvider'
import UsageFacet from '../config/abi/UsageFacet.json'
import IProposalFacet from '../config/abi/IProposalFacet.json'
import IUsageFacet from '../config/abi/IUsageFacet.json'
import IVotingFacet from '../config/abi/IVotingFacet.json'
import { getContract } from '../utils/caver'
import { State } from '../state/types'
import { getVFinix, getVFinixVoting } from '../utils/addressHelpers'
import { fetchAllProposalOfType } from '../state/actions'
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

export const useAllProposalOfType = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const allProposal = useSelector((state: State) => state.voting.allProposal)

  useEffect(() => {
    dispatch(fetchAllProposalOfType())
  }, [fastRefresh, dispatch])

  return { allProposal }
}

// Make a proposal
export const usePropose = (
  ipfsHash,
  proposalType,
  startTimestamp,
  endTimestamp,
  optionsCount,
  minimumVotingPower,
  voteLimit,
) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const callPropose = async () => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getVFinixVoting(),
        JSON.stringify(getAbiVaultFacetByName('unlock')),
        JSON.stringify([
          ipfsHash,
          proposalType,
          startTimestamp,
          endTimestamp,
          optionsCount,
          minimumVotingPower,
          voteLimit,
        ]),
        setShowModal,
      )
      await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve('')
      })
    }

    const callContract = getContract(IProposalFacet.abi, getVFinixVoting())
    return new Promise((resolve, reject) => {
      callContract.methods
        .propose(ipfsHash, proposalType, startTimestamp, endTimestamp, optionsCount, minimumVotingPower, voteLimit)
        .send({ from: account, gas: 5000000 })
        .then(resolve)
        .catch(reject)
    })
  }

  return { onPropose: callPropose }
}

// const handleContractExecute = (_executeFunction, _account) => {
//   return new Promise((resolve, reject) => {
//     _executeFunction.send({ from: _account, gas: 5000000 }).then(resolve).catch(reject)
//   })
// }

// export const recallVotesFromProposal = () => {
//   const { account, connector } = useWallet()
//   const { setShowModal } = useContext(KlipModalContext())

// Claim Voting Power
//   const onRecallVotesFromProposal = async (proposalIndex) => {
//     if (connector === 'klip') {
//       klipProvider.genQRcodeContactInteract(
//         getVFinixVoting(),
//         JSON.stringify(getAbiVaultFacetByName('recallVotesFromProposal')),
//         JSON.stringify([proposalIndex]),
//         setShowModal,
//       )
//       await klipProvider.checkResponse()
//       setShowModal(false)
//       return new Promise((resolve, reject) => {
//         resolve('')
//       })
//     }
//     const callContract = getContract(VotingFacet.abi, getVFinixVoting())
//     return new Promise((resolve, reject) => {
//       handleContractExecute(callContract.methods.recallVotesFromProposal(proposalIndex), account).then(resolve).catch(reject)
//     })
//   }

//   return { onRecallVotes: onRecallVotesFromProposal }
// }

export default useAvailableVotes
