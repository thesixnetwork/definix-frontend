/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { getAbiVaultFacetByName } from 'hooks/hookHelper'
import * as klipProvider from 'hooks/klipProvider'
import UsageFacet from '../config/abi/UsageFacet.json'
// import VotingFacet from '../config/abi/VotingFacet.json'
import IProposalFacet from '../config/abi/IProposalFacet.json'
import IUsageFacet from '../config/abi/IUsageFacet.json'
import IVotingFacet from '../config/abi/IVotingFacet.json'
import IServiceInfoFacet from '../config/abi/IServiceInfoFacet.json'
import IProposerFacet from '../config/abi/IProposerFacet.json'
import { getContract } from '../utils/caver'
import { State } from '../state/types'
import { getFinixAddress, getVFinix, getVFinixVoting } from '../utils/addressHelpers'
import { fetchAllProposalOfType, fetchProposalIndex, fetchProposal } from '../state/actions'
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

export const useProposalIndex = (index) => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  const indexProposal = useSelector((state: State) => state.voting.indexProposal)

  useEffect(() => {
    dispatch(fetchProposalIndex(index))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slowRefresh, dispatch])

  return { indexProposal }
}

export const useIsProposable = () => {
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()
  const [proposables, setProposables] = useState<string>()

  useEffect(() => {
    async function fetchIsProposable() {
      if (account) {
        const callContract = getContract(IProposerFacet.abi, getVFinixVoting())
        const isProposable = await callContract.methods.isProposable(account, 0).call()
        setProposables(isProposable)
      }
    }

    fetchIsProposable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastRefresh])

  return { proposables }
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

export const getIsParticipated = async (index: number) => {
  // const { account, connector } = useWallet()
  const contract = getContract(IVotingFacet.abi, getVFinixVoting())

  return contract.methods.isParticipated(index).call()
}

export const getVotingPowersOfAddress = async (_proposalIndex: number, _optionIndex: number, voter: string) => {
  // const { account, connector } = useWallet()
  const contract = getContract(IProposalFacet.abi, getVFinixVoting())

  return contract.methods.getVotingPowersOfAddress(_proposalIndex, _optionIndex, voter).call()
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

// export const useGetProposal = (proposalId: string) => {
//   const proposal = useSelector((state: State) => state.voting.proposals[proposalId])
//   return proposal
// }

export const useGetProposal = (proposalId: string) => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const proposal = useSelector((state: State) => state.voting.proposals)

  useEffect(() => {
    dispatch(fetchProposal(proposalId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastRefresh, dispatch])

  return { proposal }
}

export const useApproveToService = (max) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const onApprove = useCallback(async () => {
    const call = getContract(IServiceInfoFacet.abi, getVFinixVoting())
    const serviceKey = await call.methods.getServiceKey().call()
    // if (connector === 'klip') {
    //   klipProvider.genQRcodeContactInteract(
    //     getFinixAddress(),
    //     JSON.stringify(getAbiERC20ByName('approve')),
    //     JSON.stringify([getVFinix(), klipProvider.MAX_UINT_256_KLIP]),
    //     setShowModal,
    //   )
    //   const txHash = await klipProvider.checkResponse()
    //   setShowModal(false)
    //   return new Promise((resolve, reject) => {
    //     resolve(txHash)
    //   })
    // }
    const callContract = getContract(IUsageFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(
        callContract.methods.approveToService(
          serviceKey,
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        ),
        account,
      )
        .then(resolve)
        .catch(reject)
    })
  }, [account])

  return { onApprove }
}

export const useServiceAllowance = () => {
  const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const [allowances, setServiceAllowance] = useState<number>()

  useMemo(async () => {
    const call = getContract(IServiceInfoFacet.abi, getVFinixVoting())
    const serviceKey = await call.methods.getServiceKey().call()
    const allowance = getContract(IUsageFacet.abi, getVFinix())
    const serviceAllowance = await allowance.methods.getServiceAllowance(serviceKey, account).call()
    setServiceAllowance(serviceAllowance)
  }, [account])

  return allowances
}

const handleContractExecute = (_executeFunction, _account) => {
  return new Promise((resolve, reject) => {
    _executeFunction.estimateGas({ from: _account }).then((estimatedGasLimit) => {
      _executeFunction.send({ from: _account, gas: estimatedGasLimit }).then(resolve).catch(reject)
    })
  })
}

// Add vote
export const useVote = (proposalIndex, votingPowers) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())
  const [serviceKey, setServiceKey] = useState('')

  const callCastVote = async () => {
    // console.log('proposalIndex2', votingPowers)
    // setServiceKey(service)
    // if (connector === 'klip') {
    //   klipProvider.genQRcodeContactInteract(
    //     getVFinixVoting(),
    //     JSON.stringify(getAbiVaultFacetByName('unlock')),
    //     JSON.stringify([
    //       ipfsHash,
    //       proposalType,
    //       startTimestamp,
    //       endTimestamp,
    //       optionsCount,
    //       minimumVotingPower,
    //       voteLimit,
    //     ]),
    //     setShowModal,
    //   )
    //   await klipProvider.checkResponse()
    //   setShowModal(false)
    //   return new Promise((resolve, reject) => {
    //     resolve('')
    //   })
    // }

    const callContract = getContract(IVotingFacet.abi, getVFinixVoting())
    return new Promise((resolve, reject) => {
      callContract.methods
        .vote(proposalIndex, votingPowers)
        .send({ from: account, gas: 5000000 })
        .then(resolve)
        .catch(reject)
    })
  }

  return { onCastVote: callCastVote, serviceKey }
}

// Claim vote
export const useClaimVote = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())
  const [serviceKey, setServiceKey] = useState('')

  const callClaimVote = async (proposalIndex) => {
    // console.log('proposalIndex2', votingPowers)
    // setServiceKey(service)
    // if (connector === 'klip') {
    //   klipProvider.genQRcodeContactInteract(
    //     getVFinixVoting(),
    //     JSON.stringify(getAbiVaultFacetByName('unlock')),
    //     JSON.stringify([
    //       ipfsHash,
    //       proposalType,
    //       startTimestamp,
    //       endTimestamp,
    //       optionsCount,
    //       minimumVotingPower,
    //       voteLimit,
    //     ]),
    //     setShowModal,
    //   )
    //   await klipProvider.checkResponse()
    //   setShowModal(false)
    //   return new Promise((resolve, reject) => {
    //     resolve('')
    //   })
    // }

    const callContract = getContract(IVotingFacet.abi, getVFinixVoting())
    return new Promise((resolve, reject) => {
      callContract.methods
        .recallVotesFromProposal(proposalIndex)
        .send({ from: account, gas: 5000000 })
        .then(resolve)
        .catch(reject)
    })
  }

  return { callClaimVote }
}

export default useAvailableVotes
