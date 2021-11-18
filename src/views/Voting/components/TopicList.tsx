import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { Card, Heading, Text, Button, Image } from '../../../uikit-dev'
import next from '../../../uikit-dev/images/next.png'

const Proposals = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

const Tabs = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

const TopicList = () => {
  return (
    <div className="bd-t pa-5 flex justify-space-between">
      <div>
        <Heading fontSize="18px !important">
          Proposal Topic Proposal Topic Proposal Topic Proposal Topic Proposal Topic Proposal Topic
        </Heading>
        <div className="flex mb-2 mt-2">
          <Text fontSize="14px !important">Vote Now</Text>&nbsp;
          <Text fontSize="14px !important">12-Nov-21 15:00:00 GMT+9</Text>
        </div>
        <Button
          radii="small"
          color="primary"
          style={{ backgroundColor: 'transparent', border: `1px solid #30ADFF`, color: '#30ADFF' }}
        >
          Vote Now
        </Button>
        <Button
          radii="small"
          color="primary"
          className="ml-2"
          style={{ backgroundColor: 'transparent', border: `1px solid #55BD92`, color: '#55BD92' }}
        >
          Core
        </Button>
      </div>
      <div className="align-self-center">
        <Image src={next} width={28} height={28} />
      </div>
    </div>
  )
}

export default TopicList
