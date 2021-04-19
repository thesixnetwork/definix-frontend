import React from 'react'
import styled from 'styled-components'
import CardTitle from './CardTitle'

interface Props {
  hasBalance?: boolean
}

const Title = styled.div`
  color: #d42837;
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
`

const ActionLink = styled.a`
  color: #d42837;
  font-size: 14px;
`

const OldSyrupTitle: React.FC<Props> = ({ hasBalance = false }) => {
  if (hasBalance) {
    return (
      <div>
        <Title>Action Required</Title>
        <ActionLink
          href=" https://definixswap.medium.com/urgent-action-required-changes-to-syrup-pools-70b98d7b2541"
          target="_blank"
        >
          What do I need to do?
        </ActionLink>
      </div>
    )
  }

  return (
    <div>
      <CardTitle isFinished>FINISHED</CardTitle>
    </div>
  )
}

export default OldSyrupTitle
