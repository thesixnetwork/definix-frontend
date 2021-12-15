/* eslint-disable no-nested-ternary */
import React from 'react'
import { Card, Text, useMatchBreakpoints } from 'uikit-dev'
// import styled from 'styled-components'
// import moment from 'moment'
// import numeral from 'numeral'
// import { useWallet } from '@sixnetwork/klaytn-use-wallet'
// import useTheme from 'hooks/useTheme'
import exploreIcon from '../../../uikit-dev/images/for-ui-v2/voting/icon-explore.png'

const VotingDetails = () => {
  // const { account } = useWallet()
  // const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

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
            <Text fontSize="18px" lineHeight="1">
              Identifier
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            <Text fontSize="18px" bold lineHeight="1" color="#30ADFF" mr="6px">
              QmaSFZ3p
            </Text>
            <img src={exploreIcon} alt="exploreIcon" width={16} />
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="18px" lineHeight="1">
              Creator
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            <Text fontSize="18px" bold lineHeight="1" color="#30ADFF" mr="6px">
              {/* {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}&nbsp; */}
              kfkhldf
            </Text>
            <img src={exploreIcon} alt="exploreIcon" width={16} />
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="18px" lineHeight="1">
              Start Date
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            <Text fontSize="16px" bold>
              12-Nov-21 15:00:00 GMT+9
            </Text>
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="18px" lineHeight="1">
              End Date
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            <Text fontSize="16px" bold>
              12-Nov-21 15:00:00 GMT+9
            </Text>
          </div>
        </div>
      </Card>
    </>
  )
}

export default VotingDetails
