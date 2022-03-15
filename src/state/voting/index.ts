import { createSlice } from '@reduxjs/toolkit'
import { get } from 'lodash-es'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import IProposalFacet from '../../config/abi/IProposalFacet.json'
import IUsageFacet from '../../config/abi/IUsageFacet.json'
import multicall from '../../utils/multicall'
import { getVFinix, getVFinixVoting } from '../../utils/addressHelpers'
import VotingFacet from '../../config/abi/VotingFacet.json'
import { getContract } from 'utils/caver'

const initialState = {
  allProposal: [],
  indexProposal: [],
  proposals: {},
  allProposalMap: [],
  allVotesByIndex: [],
  totalVote: '',
  allVotesByIpfs: [],
  availableVotes: '',
  allProposalOfAddress: null,
}

export const votingSlice = createSlice({
  name: 'Voting',
  initialState,
  reducers: {
    setAllProposal: (state, action) => {
      const { allProposal, allProposalMap } = action.payload
      state.allProposal = allProposal
      state.allProposalMap = allProposalMap
    },
    setProposalIndex: (state, action) => {
      const { indexProposal } = action.payload
      state.indexProposal = indexProposal
    },
    setProposal: (state, action) => {
      const { proposals } = action.payload
      state.proposals = proposals
    },
    setAllVoteByIndex: (state, action) => {
      const { allVotesByIndex, totalVote } = action.payload
      state.allVotesByIndex = allVotesByIndex
      state.totalVote = totalVote
    },
    setAllVoteByIpfs: (state, action) => {
      const { allVotesByIpfs } = action.payload
      state.allVotesByIpfs = allVotesByIpfs
    },
    setAvailableVotes: (state, action) => {
      const { availableVotes } = action.payload
      state.availableVotes = availableVotes
    },
    setAllProposalOfAddress: (state, action) => {
      const { allProposalOfAddress } = action.payload
      state.allProposalOfAddress = allProposalOfAddress
    },
  },
})

// Actions
export const {
  setAllProposal,
  setProposalIndex,
  setProposal,
  setAllVoteByIndex,
  setAllVoteByIpfs,
  setAvailableVotes,
  setAllProposalOfAddress,
} = votingSlice.actions

const getAllProposalOfType = async ({ vFinixVoting }) => {
  let allProposal = []
  let allProposalMap = []
  try {
    const calls = [
      {
        address: vFinixVoting,
        name: 'getAllProposalOfType',
        params: [0],
      },
    ]
    const [[proposalOfType]] = await multicall(IProposalFacet.abi, calls)
    const dataArray = []
    const proposalArray = []
    const voteIPFS = process.env.REACT_APP_IPFS

    await proposalOfType.map(async (item) => {
      let startTimestamp = new Date(new BigNumber(get(item, 'startTimestamp._hex')).toNumber() * 1000)
      startTimestamp.setDate(startTimestamp.getDate())
      startTimestamp = new Date(startTimestamp)

      let endTimestamp = new Date(new BigNumber(get(item, 'endTimestamp._hex')).toNumber() * 1000)
      endTimestamp.setDate(endTimestamp.getDate())
      endTimestamp = new Date(endTimestamp)

      const timeZone = new Date().getTimezoneOffset() / 60
      const offset = timeZone === -7 && 2
      const utcStartTimestamp = startTimestamp.getTime()
      const utcEndTimestamp = endTimestamp.getTime()

      const startTime = new Date(utcStartTimestamp + 3600000 * offset)
      const endTime = new Date(utcEndTimestamp + 3600000 * offset)

      dataArray.push({
        ipfsHash: item.ipfsHash,
        startTimestamp: moment(startTime).format(`DD-MMM-YY HH:mm:ss`),
        endTimestamp: moment(endTime).format(`DD-MMM-YY HH:mm:ss`),
        proposalType: item.proposalType,
        proposer: item.proposer,
        proposalIndex: new BigNumber(get(item, 'proposalIndex._hex')).toNumber(),
        optionsCount: new BigNumber(get(item, 'optionsCount._hex')),
        optionVotingPower: item.optionVotingPower,
      })

      return dataArray
    })

    await Promise.all(
      dataArray.map(async (data) => {
        const response = await axios.get(`${voteIPFS}/${data.ipfsHash}`)
        proposalArray.push({
          ipfsHash: data.ipfsHash,
          startTimestamp: data.startTimestamp,
          endTimestamp: data.endTimestamp,
          proposalType: data.proposalType,
          proposer: data.proposer,
          proposalIndex: data.proposalIndex,
          choice_type: response.data.choice_type,
          choices: response.data.choices,
          content: response.data.content,
          creator: response.data.creator,
          proposals_type: response.data.proposals_type,
          start_unixtimestamp: response.data.start_unixtimestamp,
          end_unixtimestamp: response.data.end_unixtimestamp,
          title: response.data.title,
        })
      }),
    )

    allProposal = dataArray.sort((a, b) => a.proposalIndex - b.proposalIndex)
    allProposalMap = proposalArray.sort((a, b) => a.proposalIndex - b.proposalIndex)
  } catch (error) {
    allProposal = []
    allProposalMap = []
  }
  return [allProposal, allProposalMap]
}

export const fetchAllProposalOfType = () => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getAllProposalOfType({
      vFinixVoting: getVFinixVoting(),
    }),
  )
  const [[allProposal, allProposalMap]] = await Promise.all(fetchPromise)
  dispatch(setAllProposal({ allProposal, allProposalMap }))
}

const getProposalByIndex = async ({ vFinixVoting, index }) => {
  let indexProposal = []
  try {
    const calls = [
      {
        address: vFinixVoting,
        name: 'getProposal',
        params: [index],
      },
    ]

    const [proposalByIndex] = await multicall(IProposalFacet.abi, calls)
    const resultByIndex = proposalByIndex.map((item) => {
      let startTimestamp = new Date(new BigNumber(get(item, 'startTimestamp._hex')).toNumber() * 1000)
      startTimestamp.setDate(startTimestamp.getDate())
      startTimestamp = new Date(startTimestamp)

      let endTimestamp = new Date(new BigNumber(get(item, 'endTimestamp._hex')).toNumber() * 1000)
      endTimestamp.setDate(endTimestamp.getDate())
      endTimestamp = new Date(endTimestamp)

      const timeZone = new Date().getTimezoneOffset() / 60
      const offset = timeZone === -7 && 2
      const utcStartTimestamp = startTimestamp.getTime()
      const utcEndTimestamp = endTimestamp.getTime()

      const startTime = new Date(utcStartTimestamp + 3600000 * offset)
      const endTime = new Date(utcEndTimestamp + 3600000 * offset)

      return {
        ipfsHash: item.ipfsHash,
        proposer: item.proposer,
        startTimestamp: moment(startTime).format(`DD-MMM-YY HH:mm:ss`),
        endTimestamp: moment(endTime).format(`DD-MMM-YY HH:mm:ss`),
        startEpoch: new BigNumber(get(item, 'startTimestamp._hex')).toNumber() * 1000,
        endEpoch: new BigNumber(get(item, 'endTimestamp._hex')).toNumber() * 1000,
        proposalType: item.proposalType,
        proposalIndex: new BigNumber(get(item, 'proposalIndex._hex')).toNumber(),
        optionVotingPower: item.optionVotingPower,
        totalVotingPower: item.totalVotingPower,
      }
    })
    indexProposal = resultByIndex
  } catch (error) {
    indexProposal = []
  }
  return [indexProposal]
}

const getProposal = async ({ id }) => {
  let proposal = []
  try {
    const voteIPFS = process.env.REACT_APP_IPFS
    await axios
      .get(`${voteIPFS}/${id}`)
      .then(async (resp) => {
        if (resp.status === 200) {
          let startTimestamp = new Date(resp.data.start_unixtimestamp * 1000)
          startTimestamp.setDate(startTimestamp.getDate())
          startTimestamp = new Date(startTimestamp)

          let endTimestamp = new Date(resp.data.end_unixtimestamp * 1000)
          endTimestamp.setDate(endTimestamp.getDate())
          endTimestamp = new Date(endTimestamp)

          const timeZone = new Date().getTimezoneOffset() / 60
          const offset = timeZone === -7 && 2
          const utcStartTimestamp = startTimestamp.getTime()
          const utcEndTimestamp = endTimestamp.getTime()

          const startTime = new Date(utcStartTimestamp + 3600000 * offset)
          const endTime = new Date(utcEndTimestamp + 3600000 * offset)

          proposal.push({
            choice_type: resp.data.choice_type,
            choices: resp.data.choices,
            content: resp.data.content,
            creator: resp.data.creator,
            proposals_type: resp.data.proposals_type,
            start_unixtimestamp: moment(startTime).format(`DD-MMM-YY HH:mm:ss`),
            end_unixtimestamp: moment(endTime).format(`DD-MMM-YY HH:mm:ss`),
            startEpoch: resp.data.start_unixtimestamp * 1000,
            endEpoch: resp.data.end_unixtimestamp * 1000,
            title: resp.data.title,
          })
        }
      })
      .catch(() => {
        proposal = []
      })
  } catch (error) {
    proposal = []
  }
  return [proposal]
}

export const fetchProposalIndex = (index) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getProposalByIndex({
      vFinixVoting: getVFinixVoting(),
      index,
    }),
  )
  const [[[indexProposal]]] = await Promise.all(fetchPromise)
  dispatch(setProposalIndex({ indexProposal }))
}

export const fetchProposal = (id) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getProposal({
      id,
    }),
  )
  const [[[proposal]]] = await Promise.all(fetchPromise)
  dispatch(setProposal({ proposals: proposal }))
}

const getVotesByIndex = async ({ proposalIndex, pages, limits }) => {
  let allVotesByIndex = []
  let totalVote = ''
  try {
    const dataArray = []
    const voteIPFS = process.env.REACT_APP_VOTE
    await axios
      .get(`${voteIPFS}/list_votes?proposalIndex=${proposalIndex}&page=${pages}&limit=${limits}`)
      .then(async (resp) => {
        if (resp.data.success) {
          const data = get(resp, 'data.result')
          const total = get(resp, 'data.total')
          totalVote = total
          await data.map((v) =>
            dataArray.push({
              voter_addr: v.voter_addr,
              voting_opt: v.voting_opt,
              voting_power: v.voting_power,
              transaction_hash: v.transaction_hash,
            }),
          )
        }
      })
      .catch(() => {
        // console.log('error', e)
      })

    allVotesByIndex = dataArray
  } catch (error) {
    allVotesByIndex = []
  }
  return [allVotesByIndex, totalVote]
}

const getVotesByIpfs = async (ipfs) => {
  let allVotesByIpfs = []
  try {
    const dataArray = []
    const voteIPFS = process.env.REACT_APP_IPFS
    await axios
      .get(`${voteIPFS}/${ipfs}`)
      .then((resp) => {
        dataArray.push({
          choice_type: resp.data.choice_type,
          choices: resp.data.choices,
          content: resp.data.content,
          creator: resp.data.creator,
          proposals_type: resp.data.proposals_type,
          start_unixtimestamp: resp.data.start_unixtimestamp,
          end_unixtimestamp: resp.data.end_unixtimestamp,
          title: resp.data.title,
        })
      })
      .catch(() => {
        // console.log('error', e)
      })

    allVotesByIpfs = dataArray
  } catch (error) {
    allVotesByIpfs = []
  }
  return [allVotesByIpfs]
}

export const fetchVotesByIndex = (proposalIndex, pages, limits) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getVotesByIndex({
      proposalIndex,
      pages,
      limits,
    }),
  )
  const [[allVotesByIndex, totalVote]] = await Promise.all(fetchPromise)
  dispatch(setAllVoteByIndex({ allVotesByIndex, totalVote }))
}

export const fetchVotesByIpfs = (ipfs) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(getVotesByIpfs(ipfs))
  const [[allVotesByIpfs]] = await Promise.all(fetchPromise)
  dispatch(setAllVoteByIpfs({ allVotesByIpfs }))
}

const getAvailableVotes = async (account) => {
  let vote = 0
  try {
    const calls = [
      {
        address: getVFinix(),
        name: 'getAvailableVotes',
        params: [account],
      },
    ]

    const [available] = await multicall(IUsageFacet.abi, calls)
    vote = new BigNumber(available).dividedBy(new BigNumber(10).pow(18)).toNumber()
  } catch (error) {
    vote = 0
  }
  return [vote]
}

export const fetchAvailableVotes = (account) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(getAvailableVotes(account))
  const [[availableVotes]] = await Promise.all(fetchPromise)
  dispatch(setAvailableVotes({ availableVotes }))
}

export const getIsParticipated = async (index: number, account) => {
  const contract = getContract(VotingFacet.abi, getVFinixVoting())
  return process.env.REACT_APP_CHAIN_ID === process.env.REACT_APP_MAINNET_ID
    ? contract.methods.isUserParticipated(index, account).call()
    : contract.methods.isParticipated(index).call()
}

export const getIsClaimable = (index: number, account) => {
  const contract = getContract(VotingFacet.abi, getVFinixVoting())
  return process.env.REACT_APP_CHAIN_ID === process.env.REACT_APP_MAINNET_ID
    ? contract.methods.isUserClaimable(index, account).call()
    : contract.methods.isClaimable(index).call()
}

export const getVotingPowersOfAddress = async (_proposalIndex: number, _optionIndex: number, voter: string) => {
  // const { account, connector } = useWallet()
  const contract = getContract(IProposalFacet.abi, getVFinixVoting())

  return contract.methods.getVotingPowersOfAddress(_proposalIndex, _optionIndex, voter).call()
}

export const getAllProposalOfAddress = async (account, proposal) => {
  if (!account) return []
  let userProposalsFilter = JSON.parse(JSON.stringify(proposal))
  const isParticipateds = []
  for (let i = 0; i < userProposalsFilter.length; i++) {
    userProposalsFilter[i].choices = []
    const [isParticipated, IsClaimable] = await Promise.all([
      // Promise.resolve(true),
      // Promise.resolve(true),
      getIsParticipated(userProposalsFilter[i].proposalIndex, account),
      getIsClaimable(userProposalsFilter[i].proposalIndex, account),
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
  return [userProposalsFilter]
  // setUserProposals(userProposalsFilter as ParticipatedVoting[])
}

export const fetchAllProposalOfAddress = (account, proposal) => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(getAllProposalOfAddress(account, proposal))
  const [[allProposalOfAddress]] = await Promise.all(fetchPromise)
  dispatch(setAllProposalOfAddress({ allProposalOfAddress }))
}

export default votingSlice.reducer
