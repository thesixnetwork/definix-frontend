/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
// import _ from 'lodash'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { getAbiIProposalFacetByName, getAbiIUsageFacetByName, getAbiIVotingFacetByName } from 'hooks/hookHelper'
import * as klipProvider from 'hooks/klipProvider'
// import UsageFacet from '../config/abi/UsageFacet.json'
import IProposalFacet from '../config/abi/IProposalFacet.json'
import IUsageFacet from '../config/abi/IUsageFacet.json'
import IVotingFacet from '../config/abi/IVotingFacet.json'
import IServiceInfoFacet from '../config/abi/IServiceInfoFacet.json'
import IProposerFacet from '../config/abi/IProposerFacet.json'
import { getContract } from '../utils/caver'
import { State } from '../state/types'
import { getFinixAddress, getVFinix, getVFinixVoting } from '../utils/addressHelpers'
import {
  fetchAllProposalOfType,
  fetchProposalIndex,
  fetchProposal,
  fetchVotesByIndex,
  fetchVotesByIpfs,
  fetchAvailableVotes,
} from '../state/actions'
import useRefresh from './useRefresh'

/* eslint no-else-return: "error" */

// @ts-ignore
// const useVoting = (tokenAddress: string) => {}

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
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const allProposal = useSelector((state: State) => state.voting.allProposal)
  const allProposalMap = useSelector((state: State) => state.voting.allProposalMap)

  useEffect(() => {
    dispatch(fetchAllProposalOfType())
  }, [fastRefresh, dispatch])

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
  const { fastRefresh } = useRefresh()
  // const dispatch = useDispatch()
  const { account } = useWallet()
  const [proposalOfAddress, setUserProposals] = useState([])
  const proposal = useSelector((state: State) => state.voting.allProposal)

  useEffect(() => {
    const fetch = async () => {
      if (account) {
        let userProposalsFilter: any[] = JSON.parse(JSON.stringify(proposal))
        const isParticipateds = []
        for (let i = 0; i < userProposalsFilter.length; i++) {
          userProposalsFilter[i].choices = []
          // eslint-disable-next-line
          const [isParticipated, IsClaimable] = await Promise.all([
            getIsParticipated(userProposalsFilter[i].proposalIndex),
            getIsClaimable(userProposalsFilter[i].proposalIndex),
          ])
          // const [IsClaimable] = await Promise.all([getIsClaimable(userProposalsFilter[i].proposalIndex)])
          isParticipateds.push(isParticipated)
          userProposalsFilter[i].IsParticipated = isParticipated // await getIsParticipated(listAllProposal[i].proposalIndex.toNumber())
          userProposalsFilter[i].IsClaimable = IsClaimable
        }

        userProposalsFilter = userProposalsFilter.filter((item, index) => isParticipateds[index])

        for (let i = 0; i < userProposalsFilter.length; i++) {
          // eslint-disable-next-line
          const metaData = (await axios.get(`${process.env.REACT_APP_IPFS}/${userProposalsFilter[i].ipfsHash}`)).data

          userProposalsFilter[i].choices = []
          userProposalsFilter[i].title = metaData.title
          userProposalsFilter[i].endDate = +metaData.end_unixtimestamp * 1000

          for (let j = 0; j < userProposalsFilter[i].optionsCount; j++) {
            // eslint-disable-next-line
            const votingPower = new BigNumber(
              // eslint-disable-next-line
              await getVotingPowersOfAddress(userProposalsFilter[i].proposalIndex, j, account),
            )
              .div(1e18)
              .toNumber()
            if (votingPower > 0) {
              userProposalsFilter[i].choices.push({ choiceName: metaData.choices[j], votePower: votingPower })
            }
          }
        }

        setUserProposals(userProposalsFilter)
      }
    }
    fetch()
  }, [fastRefresh, proposal, account])

  return { proposalOfAddress }
}

export const useProposalIndex = (index) => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  const indexProposal = useSelector((state: State) => state.voting.indexProposal)

  useEffect(() => {
    if (index) {
      dispatch(fetchProposalIndex(index))
    }
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
    if (connector === 'klip') {
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

export const getIsClaimable = (index: number) => {
  const contract = getContract(IVotingFacet.abi, getVFinixVoting())

  return contract.methods.isClaimable(index).call()
}

export const getVotingPowersOfAddress = async (_proposalIndex: number, _optionIndex: number, voter: string) => {
  // const { account, connector } = useWallet()
  const contract = getContract(IProposalFacet.abi, getVFinixVoting())

  return contract.methods.getVotingPowersOfAddress(_proposalIndex, _optionIndex, voter).call()
}

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

// eslint-disable-next-line
export const useApproveToService = (max) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const onApprove = useCallback(async () => {
    const call = getContract(IServiceInfoFacet.abi, getVFinixVoting())
    const serviceKey = await call.methods.getServiceKey().call()
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getFinixAddress(),
        JSON.stringify(getAbiIUsageFacetByName('approveToService')),
        JSON.stringify([serviceKey, max]),
        setShowModal,
      )
      const txHash = await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve) => {
        resolve(txHash)
      })
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
  const [isClaimable, setIsClaimable] = useState<boolean>()
  useMemo(async () => {
    const call = getContract(IVotingFacet.abi, getVFinixVoting())
    const claim = await call.methods.isClaimable(index).call()
    setIsClaimable(claim)
  }, [index])

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
    if (connector === 'klip') {
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

  const callClaimVote = async (proposalIndex) => {
    if (connector === 'klip') {
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
