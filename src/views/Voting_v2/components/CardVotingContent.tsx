import React from 'react'
import styled from 'styled-components'
import { Card, CardBody } from '@fingerlabs/definixswap-uikit-v2'
import VotingChoice from './VotingChoice'
import VotingContent from './VotingContent'

const WrapCard = styled(Card)`
  margin-top: 40px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 28px;
  }
`

const StyledCardBody = styled(CardBody)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 20px;
  }
`

const CardVotingContent: React.FC = () => {
  return (
    <WrapCard>
      <StyledCardBody>
        <VotingContent />
        <VotingChoice />
      </StyledCardBody>
    </WrapCard>
  )
}

export default CardVotingContent
