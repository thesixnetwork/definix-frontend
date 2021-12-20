/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import _ from 'lodash'
import { Card, Text, useMatchBreakpoints, Skeleton } from 'uikit-dev'
// import styled from 'styled-components'
// import moment from 'moment'
// import numeral from 'numeral'
import { ExternalLink } from 'react-feather'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { useProposalIndex } from '../../../hooks/useVoting'
// import useTheme from 'hooks/useTheme'

const VotingDetails = ({ index }) => {
  const { account } = useWallet()
  // const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const indexProposal = useProposalIndex(index)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Details
          </Text>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="16px" lineHeight="1">
              Identifier
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            <Text fontSize="16px" bold lineHeight="1" color="#30ADFF" mr="6px">
              QmaSFZ3p
            </Text>
            <ExternalLink size={16} color="#30ADFF" />
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="16px" lineHeight="1">
              Creator
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            {isLoading ? (
              <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
            ) : (
              <>
                <Text fontSize="16px" bold lineHeight="1" color="#30ADFF" mr="6px">
                  {index.creator && `${index.creator.substring(0, 6)}...${index.creator.substring(index.creator.length - 4)}`}
                </Text>
                <ExternalLink size={16} color="#30ADFF" />
              </>
            )}
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="16px" lineHeight="1">
              Start Date
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            {isLoading ? (
              <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
            ) : (
              <>
                <Text fontSize="16px" bold color="text" lineHeight="1">
                  {index.start_unixtimestamp} GMT+9
                </Text>
              </>
            )}
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="16px" lineHeight="1">
              End Date
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            {isLoading ? (
              <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
            ) : (
              <>
                <Text fontSize="16px" bold color="text" lineHeight="1">
                {index.end_unixtimestamp} GMT+9
                </Text>
              </>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}

export default VotingDetails
