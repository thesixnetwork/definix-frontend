import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit-dev'

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

const CardTweet = ({ className = '' }) => {
  return (
    <Tweet className={className}>
      <Inner>{/* For Tweet */}</Inner>
    </Tweet>
  )
}

export default CardTweet
