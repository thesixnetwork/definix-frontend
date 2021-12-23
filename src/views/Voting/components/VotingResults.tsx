/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { Card, Text, Skeleton } from 'uikit-dev'
import styled from 'styled-components'
import { useProposalIndex } from 'hooks/useVoting'
import useRefresh from 'hooks/useRefresh'
import LinearProgress from '@material-ui/core/LinearProgress'

const BorderLinearProgress = styled(LinearProgress)(() => ({
  borderRadius: 6,

  '&.MuiLinearProgress-root': {
    height: '10px',
    backgroundColor: '#979797',
  },
}))

const VotingResults = ({ getByIndex }) => {
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { indexProposal } = useProposalIndex(proposalIndex)
  const [isLoading, setIsLoading] = useState(false)
  const [add, setAdd] = useState({})
  const [mapVoting, setMapVoting] = useState([])
  const { fastRefresh } = useRefresh()

  const voting = indexProposal && _.get(indexProposal, 'optionVotingPower')

  useEffect(() => {
    let dataArray = []
    const array = []
    const fetch = async () => {
      const voteIPFS = process.env.REACT_APP_IPFS
      await axios
        .get(`${voteIPFS}/${id}`)
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
        .catch((e) => {
          dataArray = []
        })

      if (voting && dataArray) {
        const sum = voting
          .map((datum) => new BigNumber(datum._hex).dividedBy(new BigNumber(10).pow(18)).toNumber())
          .reduce((a, b) => a + b)

        voting.filter((v, index) => {
          _.get(dataArray, '0.choices').map((i, c) => {
            if (index === c) {
              array.push({
                vote: new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber(),
                value: i,
                percent: Number(
                  (new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber() / sum) * 100,
                ).toFixed(2),
              })
            }
            return array
          })

          return array
        })
      }
      setMapVoting(array)
      await setAdd(dataArray)
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastRefresh])

  useEffect(() => {
    if (mapVoting.length === 0) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastRefresh])

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Current Results
          </Text>
        </div>
        {isLoading ? (
          <>
            <Skeleton animation="pulse" variant="rect" height="40px" width="90%" margin="30px 20px 0px" />
            &nbsp;
            <Skeleton animation="pulse" variant="rect" height="40px" width="90%" margin="0px 20px 30px" />
          </>
        ) : (
          <>
            {add &&
              mapVoting.map((v) => (
                <div className="ma-5">
                  <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
                    {v.value}
                  </Text>
                  <div className="my-3">
                    <BorderLinearProgress variant="determinate" value={v.percent === 'NaN' ? 0 : v.percent} />
                  </div>
                  <div className="flex justify-space-between">
                    <Text fontSize="12px" lineHeight="1" marginTop="10px">
                      {v.vote} Votes
                    </Text>
                    <Text fontSize="12px" lineHeight="1" marginTop="10px">
                      {v.percent === 'NaN' ? <>0%</> : <>{v.percent}%</>}
                    </Text>
                  </div>
                </div>
              ))}
          </>
        )}
      </Card>
    </>
  )
}

export default VotingResults
