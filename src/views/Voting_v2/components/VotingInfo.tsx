/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, TabBox } from '@fingerlabs/definixswap-uikit-v2'
import InfoDetail from './InfoDetail';
import InfoVotes from './InfoVotes';

const VotingInfo = () => {
  const { t } = useTranslation();
  const tabs = useMemo(() => [
    {
      name: t('Detail'),
      component: <InfoDetail />,
    },
    {
      name: t('Votes'),
      component: <InfoVotes />,
    },
  ], [t])

  return (
    <Card mt="20px">
      <TabBox tabs={tabs} />
    </Card>
  )
}

export default VotingInfo
