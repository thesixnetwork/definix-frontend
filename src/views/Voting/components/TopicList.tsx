/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Heading, Text, Button, Image, Skeleton, useMatchBreakpoints } from '../../../uikit-dev'
import nextIcon from '../../../uikit-dev/images/next.png'
import coreIcon from '../../../uikit-dev/images/for-ui-v2/voting/icon-core.png'
import communityIcon from '../../../uikit-dev/images/for-ui-v2/voting/icon-community.png'
import { useAllProposalOfType } from '../../../hooks/useVoting'

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

const CardNotFound = styled.div`
  display: flex !important;
  padding: 1.5rem !important;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  justify-content: center;
`

const TextHorizontal = styled.div`
  display: flex !important;
  align-items: center;
  margin-bottom: 0.5rem !important;
  margin-top: 0.5rem !important;
`

const TabInfos = ({ tab }) => {
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const [isLoading, setIsLoading] = useState(false)
  const allProposalMap = useAllProposalOfType()
  console.log(allProposalMap)
  const listAllProposal = _.get(allProposalMap, 'allProposalMap')
  const [arrayMap, setArrayMap] = useState([])

  useEffect(() => {
    if (tab === 'vote') {
      let votes = listAllProposal.filter((item) => {
        return (
          Number(_.get(item, 'start_unixtimestamp')) * 1000 < Date.now() &&
          Number(_.get(item, 'end_unixtimestamp')) * 1000 > Date.now()
        )
      })

      votes = votes.sort((a, b) => _.get(a, 'end_unixtimestamp') - _.get(b, 'end_unixtimestamp'))
      setArrayMap(votes)
      setIsLoading(false)
    }
    if (tab === 'soon') {
      let votes = listAllProposal.filter((item) => {
        return (
          Number(_.get(item, 'start_unixtimestamp')) * 1000 > Date.now() &&
          Number(_.get(item, 'end_unixtimestamp')) * 1000 > Date.now()
        )
      })
      votes = votes.sort((a, b) => _.get(a, 'end_unixtimestamp') - _.get(b, 'end_unixtimestamp'))
      setArrayMap(votes)
      setIsLoading(false)
    }
    if (tab === 'closed') {
      let votes = listAllProposal.filter((item) => {
        return (
          Number(_.get(item, 'start_unixtimestamp')) * 1000 < Date.now() &&
          Number(_.get(item, 'end_unixtimestamp')) * 1000 < Date.now()
        )
      })
      votes = votes.sort((a, b) => _.get(a, 'end_unixtimestamp') - _.get(b, 'end_unixtimestamp'))
      setArrayMap(votes)
      setIsLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, listAllProposal])

  return (
    <>
      {arrayMap.length <= 0 ? (
        <CardNotFound>
          <Text bold fontSize="20px">
            No proposals found
          </Text>
        </CardNotFound>
      ) : (
        <>
          {arrayMap.map((item) => (
            <CardTopicList as={Link} to={`/voting/detail/${_.get(item, 'ipfsHash')}/${_.get(item, 'proposalIndex')}`}>
              <div>
                <Heading fontSize="18px !important">
                  {isLoading ? (
                    <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
                  ) : (
                    <Text fontSize={isMobile ? '14px !important' : '18px !important'} bold lineHeight="1" mr="6px">
                      {_.get(item, 'title')}
                    </Text>
                  )}
                </Heading>
                <TextHorizontal>
                  {isLoading ? (
                    <>
                      <Skeleton animation="pulse" variant="rect" height="26px" width="60px" /> &nbsp;
                      <Skeleton animation="pulse" variant="rect" height="26px" width="120px" />
                    </>
                  ) : (
                    <>
                      <Text fontSize={isMobile ? '10px !important' : '14px !important'} lineHeight="1">
                        {tab === 'vote' || tab === 'closed' ? 'End Date' : 'Start Date'}
                      </Text>
                      &nbsp;
                      <Text fontSize={isMobile ? '10px !important' : '14px !important'} lineHeight="1" bold>
                        {tab === 'vote' || tab === 'closed' ? (
                          <>
                            {_.get(item, 'endTimestamp')} {_.get(item, 'endTimestamp') !== '-' && 'GMT+9'}
                          </>
                        ) : (
                          <>
                            {_.get(item, 'startTimestamp')} {_.get(item, 'startTimestamp') !== '-' && 'GMT+9'}
                          </>
                        )}
                      </Text>
                    </>
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
                          {_.get(item, 'proposalType') === 0 ? (
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
                          {_.get(item, 'proposalType') === 0 ? (
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
                            {_.get(item, 'proposalType') === 0 ? (
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
              <Styled as={Link} to={`/voting/detail/${_.get(item, 'ipfsHash')}/${_.get(item, 'proposalIndex')}`}>
                <Image src={nextIcon} width={28} height={28} />
              </Styled>
            </CardTopicList>
          ))}
        </>
      )}
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
