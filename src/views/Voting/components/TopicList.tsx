/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useAllProposalOfType } from '../../../hooks/useVoting'
import { Heading, Text, Button, Image, Skeleton } from '../../../uikit-dev'
import nextIcon from '../../../uikit-dev/images/next.png'
import coreIcon from '../../../uikit-dev/images/for-ui-v2/voting/icon-core.png'
import communityIcon from '../../../uikit-dev/images/for-ui-v2/voting/icon-community.png'

const Styled = styled(Button)`
  background-color: transparent;
  border: unset;
  display: unset;
  align-self: center;
`

const StyledTypes = styled.div<{ type: string }>`
  background-color: transparent;
  border: 1px solid
    ${({ type }) =>
      type === 'vote'
        ? '#30adff'
        : type === 'core'
        ? '#55bd92'
        : type === 'soon'
        ? '#F5C858'
        : type === 'community'
        ? '#DA7DC1'
        : type === 'closed' && '#6E6E6E'};
  color: ${({ type }) =>
    type === 'vote'
      ? '#30adff'
      : type === 'core'
      ? '#55bd92'
      : type === 'soon'
      ? '#F5C858'
      : type === 'community'
      ? '#DA7DC1'
      : type === 'closed' && '#6E6E6E'};
  border-radius: 10px;
  padding: ${({ type }) => (type === 'community' ? '2px 16px' : type === 'soon' ? '10px 22px' : '10px 16px')};
  font-size: 14px;
  font-style: italic;
  font-weight: normal;
  display: flex;
  align-items: center;
  height: 32px;
`

const CardTopicList = styled.div`
  display: flex !important;
  padding: 1.5rem !important;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`

const TextHorizontal = styled.div`
  display: flex !important;
  align-items: center;
  margin-bottom: 0.5rem !important;
  margin-top: 0.5rem !important;
`

const TabInfos = ({ tab }) => {
  const [isLoading, setIsLoading] = useState(false)
  const allProposal = useAllProposalOfType()
  const listAllProposal = _.get(allProposal, 'allProposal')

  return (
    <>
      {listAllProposal.map((item) => (
        <CardTopicList as={Link} to={`/voting/detail/${item.ipfsHash}/${item.proposalIndex}`}>
          {/* <CardTopicList as={Link} to={`/voting/detail/${item.ipfsHash}`}> */}
          <div>
            <Heading fontSize="18px !important">
              {isLoading ? (
                <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
              ) : (
                <Text fontSize="18px !important" bold lineHeight="1" mr="6px">
                  {_.get(item, 'title')}
                </Text>
              )}
            </Heading>
            <TextHorizontal>
              <Text fontSize="14px !important">End Date</Text>&nbsp;
              {isLoading ? (
                <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
              ) : (
                <Text fontSize="14px !important" bold lineHeight="1" mr="6px">
                  {item.endTimestamp} {item.endTimestamp !== '-' && 'GMT+9'}
                </Text>
              )}
            </TextHorizontal>
            <div className="flex">
              {tab === 'vote' ? (
                <>
                  {isLoading ? (
                    <>
                      <Skeleton animation="pulse" variant="rect" height="28px" width="34%" />
                      &nbsp;
                      <Skeleton animation="pulse" variant="rect" height="28px" width="34%" />
                    </>
                  ) : (
                    <>
                      <StyledTypes type="vote">
                        <span>Vote Now</span>
                      </StyledTypes>
                      {item.proposalType === 0 ? (
                        <StyledTypes type="core" className="ml-2 flex">
                          <img src={coreIcon} alt="coreIcon" width={16} />
                          &nbsp;
                          <span>Core</span>
                        </StyledTypes>
                      ) : (
                        <StyledTypes type="community" className="ml-2 flex">
                          <img src={communityIcon} alt="communityIcon" width={32} />
                          <span>Community</span>
                        </StyledTypes>
                      )}
                    </>
                  )}
                </>
              ) : tab === 'soon' ? (
                <>
                  {isLoading ? (
                    <>
                      <Skeleton animation="pulse" variant="rect" height="28px" width="34%" />
                      &nbsp;
                      <Skeleton animation="pulse" variant="rect" height="28px" width="34%" />
                    </>
                  ) : (
                    <>
                      <StyledTypes type="soon">
                        <span>Soon</span>
                      </StyledTypes>
                      {item.proposalType === 1 ? (
                        <StyledTypes type="core" className="ml-2 flex">
                          <img src={coreIcon} alt="coreIcon" width={16} />
                          &nbsp;
                          <span>Core</span>
                        </StyledTypes>
                      ) : (
                        <StyledTypes type="community" className="ml-2 flex">
                          <img src={communityIcon} alt="communityIcon" width={32} />
                          <span>Community</span>
                        </StyledTypes>
                      )}
                    </>
                  )}
                </>
              ) : (
                tab === 'closed' && (
                  <>
                    {isLoading ? (
                      <>
                        <Skeleton animation="pulse" variant="rect" height="28px" width="34%" />
                        &nbsp;
                        <Skeleton animation="pulse" variant="rect" height="28px" width="34%" />
                      </>
                    ) : (
                      <>
                        <StyledTypes type="closed">
                          <span>Closed</span>
                        </StyledTypes>
                        {item.proposalType === 1 ? (
                          <StyledTypes type="core" className="ml-2 flex">
                            <img src={coreIcon} alt="coreIcon" width={16} />
                            &nbsp;
                            <span>Core</span>
                          </StyledTypes>
                        ) : (
                          <StyledTypes type="community" className="ml-2 flex">
                            <img src={communityIcon} alt="communityIcon" width={32} />
                            <span>Community</span>
                          </StyledTypes>
                        )}
                      </>
                    )}
                  </>
                )
              )}
              &nbsp;
            </div>
          </div>
          <Styled as={Link} to={`/voting/detail/${item.ipfsHash}`}>
            <Image src={nextIcon} width={28} height={28} />
          </Styled>
        </CardTopicList>
      ))}
    </>
  )
}

const TopicList = ({ isActive }) => {
  return (
    <>
      {isActive === 'vote' ? (
        <TabInfos tab="vote" />
      ) : isActive === 'soon' ? (
        <TabInfos tab="soon" />
      ) : (
        <TabInfos tab="closed" />
      )}
    </>
  )
}

export default TopicList
