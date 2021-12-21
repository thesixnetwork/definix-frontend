/* eslint-disable no-nested-ternary */
import React from 'react'
import { Route, useRouteMatch, useParams } from 'react-router-dom'
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

  const voting = _.get(indexProposal, 'optionVotingPower')

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Current Results
          </Text>
        </div>
        {voting &&
          voting.map((v) => (
            <div className="ma-5">
              <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
                Yes, agree with you.
              </Text>
              <div className="my-3">
                <BorderLinearProgress variant="determinate" value={100} />
              </div>
              <div className="flex justify-space-between">
                <Text fontSize="12px" lineHeight="1" marginTop="10px">
                  {new BigNumber(v._hex).dividedBy(new BigNumber(10).pow(18)).toNumber()} Votes
                </Text>
                <Text fontSize="12px" lineHeight="1" marginTop="10px">
                  100%
                </Text>
              </div>
            </div>
          ))}
      </Card>
    </>
  )
}

export default VotingResults
