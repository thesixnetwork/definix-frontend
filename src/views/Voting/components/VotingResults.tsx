/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react'
import { Route, useRouteMatch, useParams } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { Card, Text } from 'uikit-dev'
// import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'
// import useTheme from 'hooks/useTheme'
import { useProposalIndex } from 'hooks/useVoting'
import LinearProgress from '@material-ui/core/LinearProgress'

const BorderLinearProgress = styled(LinearProgress)(() => ({
  borderRadius: 6,

  '&.MuiLinearProgress-root': {
    height: '10px',
    backgroundColor: '#979797',
  },
}))

const VotingResults = ({ getByIndex }) => {
  // const { account } = useWallet()
  // const { isDark } = useTheme()
  // const { isXl, isLg } = useMatchBreakpoints()
  // const isMobile = !isXl && !isLg
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { indexProposal } = useProposalIndex(proposalIndex)

  const [add, setAdd] = useState({})

  const voting = _.get(indexProposal, 'optionVotingPower')
  useEffect(() => {
    const dataArray = []
    const fetch = async () => {
      const voteAPI = process.env.REACT_APP_IPFS
      await axios
        .get(`${voteAPI}/${id}`)
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
          setAdd(dataArray)
        })
        .catch((e) => {
          console.log('error', e)
        })
    }

    if (voting) {
      const arrayVote = []
      voting.filter((v, index) => {
        _.get(add, '0.choices').filter((i, c) => {
          if (index === c) {
            arrayVote.push({
              vote: new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber(),
              value: i,
            })
          }
          return arrayVote
        })

        return v
      })
    }
    fetch()
  }, [id, voting, add])

  const mapVoting = useMemo(() => {
    const test = []
    if (voting) {
      const sum = voting
        .map((datum) => new BigNumber(datum._hex).dividedBy(new BigNumber(10).pow(18)).toNumber())
        .reduce((a, b) => a + b)

      voting.filter((v, index) => {
        _.get(add, '0.choices').filter((i, c) => {
          if (index === c) {
            test.push({
              vote: new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber(),
              value: i,
              percent: (new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber() / sum) * 100,
            })
          }
          return test
        })
        return test
      })
    }
    return test
  }, [add, voting])

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Current Results
          </Text>
        </div>
        {mapVoting &&
          mapVoting.map((v) => (
            <div className="ma-5">
              <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
                {v.value}
              </Text>
              <div className="my-3">
                <BorderLinearProgress variant="determinate" value={v.percent} />
              </div>
              <div className="flex justify-space-between">
                <Text fontSize="12px" lineHeight="1" marginTop="10px">
                  {v.vote} Votes
                </Text>
                <Text fontSize="12px" lineHeight="1" marginTop="10px">
                  {v.percent}%
                </Text>
              </div>
            </div>
          ))}
      </Card>
    </>
  )
}

export default VotingResults
