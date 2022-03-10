/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useSelector, useDispatch } from 'react-redux'
import { getAbiIProposalFacetByName, getAbiIUsageFacetByName, getAbiIVotingFacetByName } from 'hooks/hookHelper'
import * as klipProvider from 'hooks/klipProvider'
import IProposalFacet from '../config/abi/IProposalFacet.json'
import IUsageFacet from '../config/abi/IUsageFacet.json'
import IVotingFacet from '../config/abi/IVotingFacet.json'
import VotingFacet from '../config/abi/VotingFacet.json'
import IServiceInfoFacet from '../config/abi/IServiceInfoFacet.json'
import IProposerFacet from '../config/abi/IProposerFacet.json'
import { getContract } from '../utils/caver'
import { State } from '../state/types'
import { getVFinix, getVFinixVoting } from '../utils/addressHelpers'
import {
  fetchVotesByIndex,
  fetchVotesByIpfs,
  fetchAvailableVotes,
} from '../state/actions'
import useRefresh from './useRefresh'
import useWallet from './useWallet'
import { isKlipConnector } from './useApprove'
import { getEstimateGas } from 'utils/callHelpers'

export const useAvailableVotes = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useWallet()
  const availableVotes = useSelector((state: State) => state.voting.availableVotes)

  useEffect(() => {
    if (account) {
      dispatch(fetchAvailableVotes(account))
    }
  }, [fastRefresh, dispatch, account])

  return { availableVotes }
}

export const useAllProposalOfType = () => {
  const allProposal = useSelector((state: State) => state.voting.allProposal)
  const allProposalMap = useSelector((state: State) => state.voting.allProposalMap)

  return { allProposal, allProposalMap }
}

export const useVotesByIndex = (proposalIndex, pages, limits) => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const allVotesByIndex = useSelector((state: State) => state.voting.allVotesByIndex)
  const totalVote = useSelector((state: State) => state.voting.totalVote)

  useEffect(() => {
    dispatch(fetchVotesByIndex(proposalIndex, pages, limits))
  }, [fastRefresh, dispatch, proposalIndex, pages, limits])

  return { allVotesByIndex, totalVote }
}

export const useVotesByIpfs = (ipfs) => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const allVotesByIpfs = useSelector((state: State) => state.voting.allVotesByIpfs)

  useEffect(() => {
    dispatch(fetchVotesByIpfs(ipfs))
  }, [fastRefresh, dispatch, ipfs])

  return { allVotesByIpfs }
}

export const useAllProposalOfAddress = () => {
  const allProposalOfAddress = useSelector((state: State) => state.voting.allProposalOfAddress)
  return { proposalOfAddress: allProposalOfAddress }
}

export const useProposalIndex = () => {
  const indexProposal = useSelector((state: State) => state.voting.indexProposal)

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
  }, [fastRefresh])

  return { proposables }
}

// Make a proposal
export const usePropose = (
  ipfsHas,
  proposalType,
  startTimestamp,
  endTimestamp,
  optionsCount,
  minimumVotingPower,
  voteLimit,
) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const callPropose = async (ipfsHash) => {
    if (isKlipConnector(connector)) {
      klipProvider.genQRcodeContactInteract(
        getVFinixVoting(),
        JSON.stringify(getAbiIProposalFacetByName('propose')),
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
      return new Promise((resolve) => {
        resolve('')
      })
    }

    const callContract = getContract(IProposalFacet.abi, getVFinixVoting())
    const estimatedGas = await getEstimateGas(callContract.methods.propose, account, ipfsHash, proposalType, startTimestamp, endTimestamp, optionsCount, minimumVotingPower, voteLimit)
    return new Promise((resolve, reject) => {
      callContract.methods
        .propose(ipfsHash, proposalType, startTimestamp, endTimestamp, optionsCount, minimumVotingPower, voteLimit)
        .send({ from: account, gas: estimatedGas })
        .then(resolve)
        .catch(reject)
    })
  }

  return { onPropose: callPropose }
}

export const getIsParticipated = async (index: number, account) => {
  const contract = getContract(VotingFacet.abi, getVFinixVoting())
  return contract.methods.isUserParticipated(index, account).call()
}

export const getIsClaimable = (index: number, account) => {
  const contract = getContract(VotingFacet.abi, getVFinixVoting())

  return contract.methods.isUserClaimable(index, account).call()
}

export const getVotingPowersOfAddress = async (_proposalIndex: number, _optionIndex: number, voter: string) => {
  // const { account, connector } = useWallet()
  const contract = getContract(IProposalFacet.abi, getVFinixVoting())

  return contract.methods.getVotingPowersOfAddress(_proposalIndex, _optionIndex, voter).call()
}

export const useGetProposal = () => {
  const proposal = useSelector((state: State) => state.voting.proposals)

  return { proposal }
}

// eslint-disable-next-line
export const useApproveToService = (max) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const onApprove = useCallback(async () => {
    const call = getContract(IServiceInfoFacet.abi, getVFinixVoting())
    const serviceKey = await call.methods.getServiceKey().call()
    if (isKlipConnector(connector)) {
      klipProvider.genQRcodeContactInteract(
        getVFinix(),
        JSON.stringify(getAbiIUsageFacetByName('approveToService')),
        JSON.stringify([serviceKey, max]),
        setShowModal,
      )
      const txHash = await klipProvider.checkResponse()
      setShowModal(false)
      return txHash
    }
    const callContract = getContract(IUsageFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(callContract.methods.approveToService(serviceKey, max), account).then(resolve).catch(reject)
    })
  }, [account, connector, setShowModal, max])

  return { onApprove }
}

export const useServiceAllowance = () => {
  const { account } = useWallet()
  // const { slowRefresh } = useRefresh()
  const [allowances, setServiceAllowance] = useState<number>()

  useMemo(async () => {
    if (account) {
      const call = getContract(IServiceInfoFacet.abi, getVFinixVoting())
      const serviceKey = await call.methods.getServiceKey().call()
      const allowance = getContract(IUsageFacet.abi, getVFinix())
      const serviceAllowance = await allowance.methods.getServiceAllowance(serviceKey, account).call()
      setServiceAllowance(serviceAllowance)
    }
  }, [account])

  return allowances
}

export const useIsClaimable = async (index: number) => {
  const { account } = useWallet()
  const [isClaimable, setIsClaimable] = useState<boolean>()
  useMemo(async () => {
    if (account) {
      const call = getContract(VotingFacet.abi, getVFinixVoting())
      const claim = await call.methods.isUserClaimable(index, account).call()
      setIsClaimable(claim)
    }
  }, [index, account])

  return isClaimable
}

const handleContractExecute = (_executeFunction, _account) => {
  return new Promise((resolve, reject) => {
    _executeFunction.estimateGas({ from: _account }).then((estimatedGasLimit) => {
      _executeFunction.send({ from: _account, gas: estimatedGasLimit }).then(resolve).catch(reject)
    })
  })
}

// Add vote
export const useVote = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())
  const [serviceKey] = useState('')

  const callCastVote = async (proposalIndex, votingPowers) => {
    if (isKlipConnector(connector)) {
      klipProvider.genQRcodeContactInteract(
        getVFinixVoting(),
        JSON.stringify(getAbiIVotingFacetByName('vote')),
        JSON.stringify([proposalIndex, votingPowers]),
        setShowModal,
      )
      await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve) => {
        resolve('')
      })
    }

    const callContract = getContract(IVotingFacet.abi, getVFinixVoting())
    return new Promise(async (resolve, reject) => {
      const estimatedGas = await getEstimateGas(callContract.methods.vote, account, proposalIndex, votingPowers)
      callContract.methods
        .vote(proposalIndex, votingPowers)
        .send({ from: account, gas: estimatedGas })
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

  const callClaimVote = async (proposalIndex) => {
    if (isKlipConnector(connector)) {
      klipProvider.genQRcodeContactInteract(
        getVFinixVoting(),
        JSON.stringify(getAbiIVotingFacetByName('recallVotesFromProposal')),
        JSON.stringify([proposalIndex]),
        setShowModal,
      )
      await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve) => {
        resolve('')
      })
    }

    const callContract = getContract(IVotingFacet.abi, getVFinixVoting())
    return new Promise(async (resolve, reject) => {
      const estimatedGas = await getEstimateGas(callContract.methods.recallVotesFromProposal, account, proposalIndex)
      callContract.methods
        .recallVotesFromProposal(proposalIndex)
        .send({ from: account, gas: estimatedGas })
        .then(resolve)
        .catch(reject)
    })
  }

  return { callClaimVote }
}

export default useAvailableVotes
