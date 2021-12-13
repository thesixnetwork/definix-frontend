import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Pocket } from 'react-feather'
import { Heading, Text, Button, Image } from '../../../uikit-dev'
import next from '../../../uikit-dev/images/next.png'

const StyledButton = styled(Button)`
  background-color: transparent;
  border: unset;
  display: unset;
  align-self: center;
`

// const StyledButtonVote = styled(Button)`
//   background-color: transparent;
//   border: 1px solid #30adff;
//   color: #30ADFF;
//   border-radius: 6px;
//   padding: 18px 20px;
//   font-style: italic;
//   font-weight: normal;

//   &:hover {
//     cursor: default;
//     background-color: transparent;
//   }
// `

// const StyledButtonCore = styled(Button)`
//   background-color: transparent;
//   border: 1px solid #55BD92;
//   color: #55BD92;
//   border-radius: 6px;
//   padding: 18px 20px;
//   font-style: italic;
//   font-weight: normal;

//   &:hover {
//       cursor: default;


//       span {
//         color: #e27d3a !important;
//         background-color: unset;
//       }
//   }
// `

const StyledButtonVote = styled.div`
  background-color: transparent;
  border: 1px solid #30adff;
  color: #30ADFF;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-style: italic;
  font-weight: normal;
  display: flex;
  align-items: center;
`

const StyledButtonCore = styled.div`
  background-color: transparent;
  border: 1px solid #55BD92;
  color: #55BD92;
  border-radius: 6px;
  padding: 10px 20px;
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
        <div className="flex">
          <StyledButtonVote>
            <span>Vote Now</span>
          </StyledButtonVote>
          <StyledButtonCore className="ml-2 flex">
            <Pocket width={16} height={16} className="mr-1"/>
            <span>Core</span>
          </StyledButtonCore>
        </div>
      </div>
      <StyledButton as={Link} to="/voting/detail">
        <Image src={next} width={28} height={28} />
      </StyledButton>
    </CardTopicList>
  )
}

export default TopicList
