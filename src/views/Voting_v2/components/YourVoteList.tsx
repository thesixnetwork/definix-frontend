import React, { useCallback } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Card, CardBody, Flex, Text, Button } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { useIsClaimable, useClaimVote } from 'hooks/useVoting'
import { useToast } from 'state/hooks'
import { ParticipatedVoting } from 'state/types'
import VoteOptionLabel from './VoteOptionLabel'
import Translate from './Translate'

interface Props {
  proposalIndex: string;
  participatedProposal: ParticipatedVoting;
}

const VoteItem = styled(Flex)`
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    padding: 16px 0;

    .wrap-power {
      margin-top: 8px;
      margin-left: 24px;
    }
  }
`

const WrapCardBody = styled(CardBody)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 20px;
  }
`

const YourVoteList: React.FC<Props> = ({ participatedProposal, proposalIndex }) => {
  const { t } = useTranslation();
  const isClaimable = useIsClaimable(+proposalIndex)
  const { callClaimVote } = useClaimVote()
  const { toastSuccess, toastError } = useToast()

  const onClaim = useCallback((r) => {
    const claim = callClaimVote(r)
    claim
      .then(() => {
        toastSuccess(t('{{Action}} Complete', {
          Action: t('actionClaim')
        }));
      })
      .catch(() => {
        toastError(t('{{Action}} Failed', {
          Action: t('actionClaim')
        }));
      })
  }, [callClaimVote, t, toastError, toastSuccess]);

  return (
    <Card mt="20px">
      {participatedProposal && <WrapCardBody>
        <Flex flexDirection="column">
          <Text textStyle="R_16M" color="deepgrey">{t('Your Vote')}</Text>
          {
            participatedProposal.choices.map(({ choiceName, votePower }) => <VoteItem key={choiceName}>
              <VoteOptionLabel label={<Translate text={choiceName} type="opinion" />} />
              <Flex className="wrap-power">
                <Text textStyle="R_14B" className="power">{votePower}</Text>
                <Text textStyle="R_14R" ml="6px">{t('vFINIX')}</Text>
              </Flex>
            </VoteItem>)
          }
        </Flex>
        <Flex justifyContent="center" mt="8px">
          <Button lg width="280px" onClick={onClaim} disabled={Date.now() < + _.get(participatedProposal, 'endDate') || !isClaimable}>{t('Claim Voting Power')}</Button>
        </Flex>
      </WrapCardBody>}
    </Card>
  )
}

export default YourVoteList
