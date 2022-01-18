import React, { useCallback, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Card, CardBody, Flex, Text, Button } from '@fingerlabs/definixswap-uikit-v2'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAllProposalOfAddress, useIsClaimable, useClaimVote } from 'hooks/useVoting'
import { useToast } from 'state/hooks'
import VoteOptionLabel from './VoteOptionLabel'
import Translate from './Translate'

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
      {items && <WrapCardBody>
        <Flex flexDirection="column">
          <Text textStyle="R_16M" color="deepgrey">{t('Your Vote')}</Text>
          {
            items.choices.map(({ choiceName, votePower }) => <VoteItem>
              <VoteOptionLabel label={<Translate text={choiceName} type="opinion" />} />
              <Flex className="wrap-power">
                <Text textStyle="R_14B" className="power">{votePower}</Text>
                <Text textStyle="R_14R" ml="6px">{t('vFINIX')}</Text>
              </Flex>
            </VoteItem>)
          }
        </Flex>
        <Flex justifyContent="center" mt="8px">
          <Button lg width="280px" onClick={onClaim} disabled={Date.now() < + _.get(items, 'endDate') || !isClaimable}>{t('Claim Voting Power')}</Button>
        </Flex>
      </WrapCardBody>}
    </Card>
  )
}

export default YourVoteList
