/* eslint-disable no-nested-ternary */
import React from 'react'
import { ArrowBackIcon, Button, Card, Text } from 'uikit-dev'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ReactMarkdown from 'components/ReactMarkdown'
// import useTheme from 'hooks/useTheme'
// import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import coreIcon from 'uikit-dev/images/for-ui-v2/voting/icon-core.png'
import communityIcon from 'uikit-dev/images/for-ui-v2/voting/icon-community.png'

const Description = styled(Card)`
  padding: 24px;
  font-size: 16px;
`

const SpecialOutline = styled.div`
  background-color: unset;
  border-radius: 10px;
  border: 1px solid #1587c9;
  color: #1587c9;
  font-size: 14px;
  font-style: italic;
  cursor: unset;
  padding: 8px 10px;
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

const VotingDescription = ({ id, index }) => {
  const voteNow = index.startEpoch < Date.now() && index.endEpoch > Date.now()
  const soon = index.startEpoch > Date.now() && index.endEpoch > Date.now()
  const closed = index.startEpoch < Date.now() && index.endEpoch < Date.now()

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Button
            variant="text"
            as={Link}
            to="/voting"
            ml="-12px"
            mb="12px"
            padding="0 12px"
            size="sm"
            startIcon={<ArrowBackIcon color="textSubtle" />}
          >
            <Text fontSize="14px" color="textSubtle">
              Back
            </Text>
          </Button>
          <div className="flex align-center">
            {voteNow && <StyledTypes type="vote">Vote Now</StyledTypes>}
            {soon && <StyledTypes type="soon">Soon</StyledTypes>}
            {closed && <StyledTypes type="closed">Closed</StyledTypes>}
            &nbsp;
            {index.proposals_type === 'core' ? (
              <StyledTypes type="core">
                <img src={coreIcon} alt="coreIcon" width={16} />
                &nbsp;
                <span>Core</span>
              </StyledTypes>
            ) : (
              index.proposals_type === 'community' && (
                <StyledTypes type="community">
                  <img src={communityIcon} alt="communityIcon" width={16} />
                  &nbsp;
                  <span>Community</span>
                </StyledTypes>
              )
            )}
          </div>
          <Text fontSize="32px" bold lineHeight="1" marginTop="10px">
            {index.title}
          </Text>
        </div>
        <Description>
          <ReactMarkdown>{index.content}</ReactMarkdown>
        </Description>
      </Card>
    </>
  )
}

export default VotingDescription
