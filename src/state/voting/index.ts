/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
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
}

export const votingSlice = createSlice({
  name: 'Voting',
  initialState,
  reducers: {
    setAllProposal: (state, action) => {
      const { allProposal } = action.payload
      state.allProposal = allProposal
    },
  },
})

// Actions
export const { setAllProposal } = votingSlice.actions

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
    const result = proposalOfType.map((item) => {
      return { ipfsHash: item.ipfsHash }
    })
    allProposal = result
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
  const [[[allProposal]]] = await Promise.all(fetchPromise)
  dispatch(setAllProposal({ allProposal }))
}

export default votingSlice.reducer
