import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Card, Heading, Text, Button } from 'uikit-dev'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import definixVoting from 'uikit-dev/images/for-ui-v2/voting/voting-banner.png'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import CardProposals from './CardProposals'
import {
  useAllProposalOfType,
  getIsParticipated,
  getVotingPowersOfAddress,
  useIsProposable,
} from '../../../hooks/useVoting'
import VotingPartProposal from './VotingPartProposal'
import { Voting } from '../../../state/types'

// import { useIsProposable } from '../../../hooks/useVoting'
// import CardProposals from './CardProposals'
// import VotingPartProposal from './VotingPartProposal'

const BannerVoting = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 28px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 50%;
    height: 100%;
    background: url(${definixVoting});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    margin-right: 4%;
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 20px !important;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 50px 0px 50px 5%;
    align-items: center;

    &:before {
      opacity: 0.2;
      width: 40%;
    }

    h2 {
      font-size: 32px !important;
      width: 80%;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;

    &:before {
      opacity: 0.2;
    }

    h2 {
      font-size: 32px !important;
      width: 80%;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 50px 2% 50px 12%;
    align-items: center;

    &:before {
      opacity: 1;
      width: 20%;
      margin-right: 14%;
      background-position: center;
    }

    h2 {
      font-size: 32px !important;
      width: 70%;
    }
  }
`

const DetailBanner = styled(Text)`
  width: 80%;
  font-size: 14px !important;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px !important;
    width: 60%;
  }
`

const CardVoting = () => {
  const { account } = useWallet()
  const allProposal = useAllProposalOfType()
  const listAllProposal = _.get(allProposal, 'allProposal')
  const [userProposals, setUserProposals] = useState([])
  useEffect(() => {
    const fetch = async () => {
      let userProposalsFilter: any[] = JSON.parse(JSON.stringify(listAllProposal))
      const isParticipateds = []
      for (let i = 0; i < userProposalsFilter.length; i++) {
        userProposalsFilter[i].choices = []
        // eslint-disable-next-line
        const [isParticipated] = await Promise.all([getIsParticipated(userProposalsFilter[i].proposalIndex)])
        isParticipateds.push(isParticipated)
        userProposalsFilter[i].IsParticipated = isParticipated // await getIsParticipated(listAllProposal[i].proposalIndex.toNumber())
      }

      userProposalsFilter = userProposalsFilter.filter((item, index) => isParticipateds[index])

      for (let i = 0; i < userProposalsFilter.length; i++) {
        // eslint-disable-next-line
        const metaData = (await axios.get(`https://gateway.pinata.cloud/ipfs/${userProposalsFilter[i].ipfsHash}`)).data

        userProposalsFilter[i].choices = []
        userProposalsFilter[i].title = metaData.title
        userProposalsFilter[i].endDate = +metaData.end_unixtimestamp * 1000

        for (let j = 0; j < userProposalsFilter[i].optionsCount; j++) {
          // eslint-disable-next-line
          const votingPower = new BigNumber(
            // eslint-disable-next-line
            await getVotingPowersOfAddress(userProposalsFilter[i].proposalIndex, j, account),
          )
            .div(1e18)
            .toNumber()
          if (votingPower > 0) {
            userProposalsFilter[i].choices.push({ choiceName: metaData.choices[j], votePower: votingPower })
          }
        }
      }

      setUserProposals(userProposalsFilter)
    }
    fetch()
  }, [listAllProposal, account])

  const proposable = useIsProposable()
  const isProposable = _.get(proposable, 'proposables')

  return (
    <>
      <BannerVoting>
        <div>
          <Heading color="primary">DRIVE FORWARD TOGETHER WITH DECENTRALIZED VOTING</Heading>
          <DetailBanner>
            Community Proposal is a great way to say your words and to reflects the community feeling about your ideas.
          </DetailBanner>
        </div>
        {isProposable && (
          <Button variant="success" radii="small" size="sm" marginTop="10px" as={Link} to="/voting/make-proposal">
            Make a Proposals
          </Button>
        )}
      </BannerVoting>
      <CardProposals />

      {account && userProposals.length > 0 ? <VotingPartProposal rbAddress userProposals={userProposals} /> : ''}
    </>
  )
}

export default CardVoting
