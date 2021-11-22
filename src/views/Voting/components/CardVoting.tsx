import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Card, Heading, Text, Button } from 'uikit-dev'
import definixVoting from 'uikit-dev/images/for-ui-v2/voting-banner.png'
import CardProposals from './CardProposals'

const StyledBannerVoting = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: url(${definixVoting});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    // border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 48px 42% 42px 66px;
    // height: 214px;

    &:before {
      width: 26%;
      opacity: 1;
    }

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
        <Heading color="primary">DRIVE FORWARD TOGETHER WITH DECENTRALIZED VOTING</Heading>
        <Text>
          Community Proposal is a great way to say your words and to reflects the community feeling about your ideas.
        </Text>
        <Button as={Link} to="/voting/make-proposal" radii="small" color="success">
          Make a Proposals
        </Button>
      </StyledBannerVoting>
      <CardProposals />
    </>
  )
}

export default CardVoting
