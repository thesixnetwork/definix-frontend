/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react'
import { AddIcon, MinusIcon, Button, Card, Text, Heading, useMatchBreakpoints, LinkExternal } from 'uikit-dev'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
// import moment from 'moment'
// import numeral from 'numeral'

// import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useTheme from 'hooks/useTheme'
import iconExpore from '../../../uikit-dev/images/for-ui-v2/voting/icon-expore.png'

const ExternalUrl = styled(ExternalLink)`
  cursor: pointer
`

const VotingDetails = () => {
  const { account } = useWallet()
  const { isDark } = useTheme()
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
            <ExternalUrl color="#30ADFF" size={16}/>
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="18px" lineHeight="1">
              Identifier
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            <Text fontSize="18px" bold lineHeight="1" color="#30ADFF" mr="6px">
              {/* {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}&nbsp; */}
              kfkhldf
            </Text>
            <ExternalUrl color="#30ADFF" size={16} />
          </div>
        </div>
      </Card>
    </>
  )
}

export default VotingDetails
