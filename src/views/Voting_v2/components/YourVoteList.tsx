/* eslint-disable no-nested-ternary */
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Card, CardBody, Flex, Text, Button } from '@fingerlabs/definixswap-uikit-v2'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAllProposalOfAddress, useIsClaimable, useClaimVote } from 'hooks/useVoting'
import { useToast } from 'state/hooks'
import VoteOptionLabel from './VoteOptionLabel'

const VoteItem = styled(Flex)`
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const YourVoteList = () => {
  const { t } = useTranslation();
  const { proposalIndex }: { id: string; proposalIndex: any } = useParams()
  const { proposalOfAddress } = useAllProposalOfAddress()
  const isClaimable = useIsClaimable(proposalIndex)
  const { callClaimVote } = useClaimVote()
  const { toastSuccess, toastError } = useToast()
  const items = useMemo(() => {
    const itemByIndex = proposalOfAddress.find((item) => item.proposalIndex === Number(proposalIndex))
    return itemByIndex
  }, [proposalIndex, proposalOfAddress])

  const onClaim = useCallback((r) => {
    const claim = callClaimVote(r)
    claim
      .then((b) => {
        toastSuccess(t('{{Action}} Complete', {
          Action: t('actionClaim')
        }));
      })
      .catch((e) => {
        toastError(t('{{Action}} Failed', {
          Action: t('actionClaim')
        }));
      })
  }, [callClaimVote, t, toastError, toastSuccess]);

  return (
    <Card mt="20px">
      {items && <CardBody>
        <Flex flexDirection="column">
          <Text textStyle="R_16M" color="deepgrey">{t('Your Vote')}</Text>
          {
            items.choices.map(({ choiceName, votePower }) => <VoteItem>
              <VoteOptionLabel label={choiceName} />
              <Text textStyle="R_14M">{votePower}</Text>
            </VoteItem>)
          }
        </Flex>
        <Flex justifyContent="center">
          <Button lg width="280px" onClick={onClaim} disabled={Date.now() < + _.get(items, 'endDate') || !isClaimable}>{t('Claim Voting Power')}</Button>
        </Flex>
      </CardBody>}
    </Card>
  )
}

export default YourVoteList
