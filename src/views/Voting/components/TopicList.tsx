import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Heading, Text, Button, Image } from '../../../uikit-dev'
import next from '../../../uikit-dev/images/next.png'

const StyledButton = styled(Button)`
  background-color: transparent;
  border: unset;
  display: unset;
  align-self: center;
`

const StyledButtonVote = styled(Button)`
  background-color: transparent;
  border: 1px solid #30adff;
  color: #30adff;
`

const StyledButoonCore = styled(Button)`
  background-color: transparent;
  border: 1px solid #55bd92;
  color: #55bd92;
`

const CardTopicList = styled.div`
  display: flex !important;
  padding: 1.5rem !important;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  justify-content: space-between;
`

const TextHorizontal = styled.div`
  display: flex !important;
  margin-bottom: 0.5rem !important;
  margin-top: 0.5rem !important;
`

const TopicList = () => {
  return (
    <CardTopicList>
      <div>
        <Heading fontSize="18px !important">
          Proposal Topic Proposal Topic Proposal Topic Proposal Topic Proposal Topic Proposal Topic
        </Heading>
        <TextHorizontal>
          <Text fontSize="14px !important">Vote Now</Text>&nbsp;
          <Text fontSize="14px !important">12-Nov-21 15:00:00 GMT+9</Text>
        </TextHorizontal>
        <StyledButtonVote radii="small" color="primary">
          Vote Now
        </StyledButtonVote>
        <StyledButoonCore radii="small" color="primary" className="ml-2">
          Core
        </StyledButoonCore>
      </div>
      <StyledButton as={Link} to="/voting/detail">
        <Image src={next} width={28} height={28} />
      </StyledButton>
    </CardTopicList>
  )
}

export default TopicList
