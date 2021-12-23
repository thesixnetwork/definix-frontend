/* eslint-disable no-nested-ternary */
import React from 'react'
import { ExternalLink } from 'react-feather'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'
import { Card, Text, useMatchBreakpoints, Skeleton, Button } from 'uikit-dev'

const LinkView = styled(Button)`
  background-color: unset;
  cursor: pointer;
  padding-left: 6px;
`

const VotingDetails = ({ id, index }) => {
  const { account } = useWallet()
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
            <Text fontSize="16px" lineHeight="1">
              Identifier
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            {id === '' ? (
              <Skeleton animation="pulse" variant="rect" height="20px" width="60%" />
            ) : (
              <>
                <Text fontSize="16px" bold lineHeight="1" color="#30ADFF" mr="4px">
                  {id && `${id.substring(0, 6)}...${id.substring(id.length - 4)}`}
                </Text>
                <LinkView as="a" href={`${process.env.REACT_APP_IPFS}/${id}`} target="_blank">
                  <ExternalLink size={16} color="#30ADFF" />
                </LinkView>   
              </>
            )}
          </div>
        </div>
        <div className={`flex align-stretch ma-4 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-4'}>
            <Text fontSize="16px" lineHeight="1">
              Creator
            </Text>
          </div>
          <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
            {index.creator === undefined ? (
              <Skeleton animation="pulse" variant="rect" height="20px" width="60%" />
            ) : (
              <>
                <Text fontSize="16px" bold lineHeight="1" color="#30ADFF" mr="2px">
                  {index.creator &&
                    `${index.creator.substring(0, 6)}...${index.creator.substring(index.creator.length - 4)}`}
                </Text>
                <LinkView as="a" href={`${process.env.REACT_APP_KLAYTN_URL}/account/${account}`} target="_blank">
                  <ExternalLink size={16} color="#30ADFF" />
                </LinkView>
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
            {index.start_unixtimestamp === undefined ? (
              <Skeleton animation="pulse" variant="rect" height="20px" width="80%" />
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
            {index.end_unixtimestamp === undefined ? (
              <Skeleton animation="pulse" variant="rect" height="20px" width="80%" />
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
