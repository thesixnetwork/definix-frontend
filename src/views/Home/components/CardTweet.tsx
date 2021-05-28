import React from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import { Timeline } from 'react-twitter-widgets'

const Tweet = styled(Card)`
  padding: 14px;
  height: 100%;
`

const BorderStyle = styled(Text)`
  // border: 1px solid #ececec;
  border-radius: 6px;
`

const CardTweet = ({ className = '' }) => {
  return (
    <>
      <Tweet className={className}>
        <BorderStyle>
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: 'DefinixOfficial',
            }}
            options={{
              chrome: 'noheader, nofooter',
              height: '400',
            }}
          />
        </BorderStyle>
      </Tweet>
    </>
  )
}

export default CardTweet
