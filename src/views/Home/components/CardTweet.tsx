import React from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import { Timeline } from 'react-twitter-widgets'

const Tweet = styled(Card)`
  padding: 16px;
  height: 100%;
  max-height: 461px;
`

const Inner = styled.div`
  overflow: scroll;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  height: 100%;
`

const BorderStyle = styled(Text)`
  border-radius: 6px;
`

const CardTweet = ({ className = '' }) => {
  return (
    <Tweet className={className}>
      <Inner>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'DefinixOfficial',
          }}
          options={{
            id: "profile:TwitterDev",
            chrome: 'noheader, nofooter',
            height: '400',
          }}
        />
      </Inner>
    </Tweet>
  )
}

export default CardTweet
