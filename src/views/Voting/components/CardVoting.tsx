import React, { useState } from 'react'
import styled from 'styled-components'
// import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Card, Heading, Text, Button } from 'uikit-dev'
import definixVoting from 'uikit-dev/images/for-ui-v2/voting/voting-banner.png'
import CardProposals from './CardProposals'


const BannerVoting = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 28px 24px;
  position: relative;
  overflow: visible;
  display:flex;

  h2 {
    font-size: 22px !important;
    width: 80%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 14%;
    align-items: center;

    h2 {
      font-size: 32px !important;
      width: 80%;
    }
    h3 {
      font-size: 20px !important;
      width: 80%;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 30px 14%;
    align-items: center;

    h2 {
      font-size: 32px !important;
      width: 80%;
    }
    h3 {
      font-size: 20px !important;
      width: 80%;
    }
  }
`

const DetailBanner = styled(Text)`
  width: 80%;
  font-size: 14px !important;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px !important;
  }
`


const CardVoting = () => {
  return (
    <>
      <BannerVoting>
        <div>
          <Heading color="primary">DRIVE FORWARD TOGETHER WITH DECENTRALIZED VOTING</Heading>
          <DetailBanner>
            Community Proposal is a great way to say your words and to reflects the community feeling about your ideas.
          </DetailBanner>
        </div>
        <img src={definixVoting} alt="" width="30%" />
        {/* <Button variant="success" radii="small" as={Link} to="/voting/make-proposal">
          Make a Proposals
        </Button> */}
      </BannerVoting>
      <CardProposals />
    </>
  )
}

export default CardVoting
