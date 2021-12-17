/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Heading, Text, Button, Image } from '../../../uikit-dev'
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
  margin-bottom: 0.5rem !important;
  margin-top: 0.5rem !important;
`

const TabInfos = ({ tab }) => {
  return (
    <>
      <CardTopicList as={Link} to="/voting/detail">
        <div>
          <Heading fontSize="18px !important">
            Proposal Topic Proposal Topic Proposal Topic Proposal Topic Proposal Topic Proposal Topic
        </Heading>
          <TextHorizontal>
            <Text fontSize="14px !important">End Date</Text>&nbsp;
          <Text fontSize="14px !important" bold>12-Nov-21 15:00:00 GMT+9</Text>
          </TextHorizontal>
          <div className="flex">
            {tab === 'vote' ? (
              <>
                <StyledTypes type="vote">
                  <span>Vote Now</span>
                </StyledTypes>
                <StyledTypes type="core" className="ml-2 flex">
                  <img src={coreIcon} alt="coreIcon" width={16} />
                &nbsp;
                <span>Core</span>
                </StyledTypes>
              </>
            ) : tab === 'soon' ? (
              <>
                <StyledTypes type="soon">
                  <span>Soon</span>
                </StyledTypes>
                <StyledTypes type="community" className="ml-2 flex">
                  <img src={communityIcon} alt="communityIcon" width={32} />
                  <span>Community</span>
                </StyledTypes>
              </>
            ) : (
                  tab === 'closed' && (
                    <>
                      <StyledTypes type="closed">
                        <span>Closed</span>
                      </StyledTypes>
                      <StyledTypes type="community" className="ml-2 flex">
                        <img src={communityIcon} alt="communityIcon" width={32} />
                        <span>Community</span>
                      </StyledTypes>
                    </>
                  )
                )}
          &nbsp;
        </div>
        </div>
        <Styled as={Link} to="/voting/detail">
          <Image src={nextIcon} width={28} height={28} />
        </Styled>
      </CardTopicList>
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
