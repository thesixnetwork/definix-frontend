/* eslint-disable no-nested-ternary */
import React from 'react'
import { Card, Text } from 'uikit-dev'
// import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'
// import useTheme from 'hooks/useTheme'
import LinearProgress from '@material-ui/core/LinearProgress'

const BorderLinearProgress = styled(LinearProgress)(() => ({
  borderRadius: 6,

  '&.MuiLinearProgress-root': {
    height: '10px',
    backgroundColor: '#979797',
  },
}))

const VotingResults = () => {
  // const { account } = useWallet()
  // const { isDark } = useTheme()
  // const { isXl, isLg } = useMatchBreakpoints()
  // const isMobile = !isXl && !isLg

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Current Results
          </Text>
        </div>
        <div className="ma-5">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Yes, agree with you.
          </Text>
          <div className="my-3">
            <BorderLinearProgress variant="determinate" value={100} />
          </div>
          <div className="flex justify-space-between">
            <Text fontSize="12px" lineHeight="1" marginTop="10px">
              24,537 Votes
            </Text>
            <Text fontSize="12px" lineHeight="1" marginTop="10px">
              100%
            </Text>
          </div>
        </div>
        <div className="ma-5">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            No, I’m not agree with you.
          </Text>
          <div className="my-3">
            <BorderLinearProgress variant="determinate" value={0} />
          </div>
          <div className="flex justify-space-between">
            <Text fontSize="12px" lineHeight="1" marginTop="10px">
              0 Votes
            </Text>
            <Text fontSize="12px" lineHeight="1" marginTop="10px">
              0%
            </Text>
          </div>
        </div>
      </Card>
    </>
  )
}

export default VotingResults
