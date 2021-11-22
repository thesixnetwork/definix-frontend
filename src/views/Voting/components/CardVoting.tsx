import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Card, Heading, Text, Button } from 'uikit-dev'
import definixVoting from 'uikit-dev/images/for-ui-v2/voting-banner.png'
import CardProposals from './CardProposals'

const StyledBannerVoting = styled(Card)`
  display: flex;
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 0px 42px 0px 42px;
  align-items: center;

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 32px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }
`

const CardVoting = () => {
  return (
    <>
      <StyledBannerVoting className="mt-5">
        <div>
          <Heading color="primary">DRIVE FORWARD TOGETHER WITH DECENTRALIZED VOTING</Heading>
          <Text>
            Community Proposal is a great way to say your words and to reflects the community feeling about your ideas.
          </Text>
        </div>
        <img style={{ backgroundSize: 'contain' }} alt="" src={definixVoting} width="250" height="250" />
        <Button style={{ width: '26%' }} as={Link} to="/voting/make-proposal" radii="small" color="success">
          Make a Proposals
        </Button>
      </StyledBannerVoting>
      <CardProposals />
    </>
  )
}

export default CardVoting
