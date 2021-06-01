import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit-dev'

const Tweet = styled(Card)`
  padding: 24px;
  height: 100%;
`

const CardTweet = ({ className = '' }) => {
  return <Tweet className={className} />
}

export default CardTweet
