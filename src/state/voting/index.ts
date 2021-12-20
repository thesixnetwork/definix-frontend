/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import moment from 'moment'
import IProposalFacet from '../../config/abi/IProposalFacet.json'
import IUsageFacet from '../../config/abi/IUsageFacet.json'
import IVotingFacet from '../../config/abi/IVotingFacet.json'
import multicall from '../../utils/multicall'
import { getFinixAddress, getVFinix, getAddress, getVFinixVoting } from '../../utils/addressHelpers'
import { getContract } from '../../utils/caver'

const initialState = {
  allProposal: [],
  indexProposal: [],
  proposals: {},
}

export const votingSlice = createSlice({
  name: 'Voting',
  initialState,
  reducers: {
    setAllProposal: (state, action) => {
      const { allProposal } = action.payload
      state.allProposal = allProposal
    },
    setProposalIndex: (state, action) => {
      const { indexProposal } = action.payload
      state.indexProposal = indexProposal
    },
    setProposal: (state, action) => {
      const { proposals } = action.payload
      state.proposals = proposals
    },
  },
})

// Actions
export const { setAllProposal, setProposalIndex, setProposal } = votingSlice.actions

const getAllProposalOfType = async ({ vFinixVoting }) => {
  let allProposal = []
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

    proposalOfType.map(async (item) => {
      let endTimestamp = new Date(new BigNumber(_.get(item, 'endTimestamp._hex')).toNumber() * 1000)
      endTimestamp.setDate(endTimestamp.getDate())
      endTimestamp = new Date(endTimestamp)

      const timeZone = new Date().getTimezoneOffset() / 60
      const offset = timeZone === -7 && 2
      const utcEndTimestamp = endTimestamp.getTime()

      const endTime = new Date(utcEndTimestamp + 3600000 * offset)
      const voteAPI = process.env.REACT_APP_IPFS

      //   console.log('item', item.ipfsHash)
      //   if (item.ipfsHash.length > 6) {
      //     await axios
      //       .get(`${voteAPI}/${item.ipfsHash}`)
      //       .then(async (resp) => {
      //         console.log('resp', resp.data)
      //         if (resp.status === 200) {
      //           dataArray.push({
      //             ipfsHash: item.ipfsHash,
      //             endTimestamp: moment(endTime).format(`DD-MMM-YY HH:mm:ss`),
      //             proposalType: item.proposalType,
      //             proposer: item.proposer,
      //             choice_type: resp.data.choice_type, // "single"
      //             choices: resp.data.choices, // ['3', '4']
      //             content: resp.data.content, //"test1"
      //             creator: resp.data.creator, // "0x14073ed09cae2694bafc2d8078dc181095a682be"
      //             proposals_type: resp.data.proposals_type, //"core"
      //             start_unixtimestamp: resp.data.start_unixtimestamp, // 1640886300
      //             end_unixtimestamp: resp.data.end_unixtimestamp, // 1643652000
      //             title: resp.data.test1, // "title"
      //           })
      //         }
      //       })
      //       .catch((e) => {
      //         console.log('error', e)
      //         //   setIsLoading(false)
      //       })
      //   }

      dataArray.push({
        ipfsHash: item.ipfsHash,
        endTimestamp: moment(endTime).format(`DD-MMM-YY HH:mm:ss`),
        proposalType: item.proposalType,
        proposer: item.proposer,
        choice_type: 'single',
        choices: ['3', '4'],
        content: 'test1',
        creator: '0x14073ed09cae2694bafc2d8078dc181095a682be',
        proposals_type: 'core',
        start_unixtimestamp: 1640886300,
        end_unixtimestamp: 1643652000,
        title: 'title',
      })

      return dataArray
    })
    allProposal = dataArray
  } catch (error) {
    allProposal = []
  }
  return [allProposal]
}

export const fetchAllProposalOfType = () => async (dispatch) => {
  const fetchPromise = []
  fetchPromise.push(
    getAllProposalOfType({
      vFinixVoting: getVFinixVoting(),
    }),
  )
  const [[allProposal]] = await Promise.all(fetchPromise)
  dispatch(setAllProposal({ allProposal }))
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
      let startTimestamp = new Date(new BigNumber(_.get(item, 'startTimestamp._hex')).toNumber() * 1000)
      startTimestamp.setDate(startTimestamp.getDate())
      startTimestamp = new Date(startTimestamp)

      let endTimestamp = new Date(new BigNumber(_.get(item, 'endTimestamp._hex')).toNumber() * 1000)
      endTimestamp.setDate(endTimestamp.getDate())
      endTimestamp = new Date(endTimestamp)

      const timeZone = new Date().getTimezoneOffset() / 60
      const offset = timeZone === -7 && 2
      const utcStartTimestamp = endTimestamp.getTime()
      const utcEndTimestamp = endTimestamp.getTime()

      const startTime = new Date(utcStartTimestamp + 3600000 * offset)
      const endTime = new Date(utcEndTimestamp + 3600000 * offset)

      return {
        ipfsHash: item.ipfsHash,
        proposer: item.proposer,
        startTimestamp: moment(startTime).format(`DD-MMM-YY HH:mm:ss`),
        endTimestamp: moment(endTime).format(`DD-MMM-YY HH:mm:ss`),
        proposalType: item.proposalType,
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
    const voteAPI = process.env.REACT_APP_IPFS
    await axios
      .get(`${voteAPI}/${id}`)
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
          const utcStartTimestamp = endTimestamp.getTime()
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
            title: resp.data.title,
          })
        }
      })
      .catch((e) => {
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

export default votingSlice.reducer
