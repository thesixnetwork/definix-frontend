/* eslint-disable no-nested-ternary */
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components';
import { Card, Tabs, Flex } from '@fingerlabs/definixswap-uikit-v2'
import { Voting } from 'state/types';
import InfoDetail from './InfoDetail';
import InfoVotes from './InfoVotes';

interface Props {
  id: string;
  proposalIndex: string;
  proposal: Voting;
}

const StyledTabs = styled(Tabs)`
  ${({ theme }) => theme.textStyle.R_16B}

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 50%;
    padding: 18px 0;
    ${({ theme }) => theme.textStyle.R_14B}
  }
`

const ContentArea = styled(Flex)`
  width: 100%;
`

const VotingInfo: React.FC<Props> = ({ id, proposal, proposalIndex }) => {
  const { t } = useTranslation();
  const tabs = useMemo(() => [
    {
      name: t('Detail'),
      component: <InfoDetail id={id} proposal={proposal} />,
    },
    {
      name: t('Votes'),
      component: <InfoVotes id={id} proposalIndex={proposalIndex} />,
    },
  ], [t, proposal, proposalIndex, id])
  const tabNames = useRef(tabs.map(({ name }) => name));
  const [curTab, setCurTab] = useState<string>(tabs[0]?.name);

  const onClickTab = (name: string) => {
    setCurTab(name);
  };

  return (
    <Card mt="20px">
      <StyledTabs tabs={tabNames.current} curTab={curTab} setCurTab={onClickTab} />
      <ContentArea>
        {tabs.map(({ name, component }) => (curTab === name ? component : null))}
      </ContentArea>
    </Card>
  )
}

export default VotingInfo
