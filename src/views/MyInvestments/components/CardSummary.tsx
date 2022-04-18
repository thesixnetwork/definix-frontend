import { groupBy } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, useMatchBreakpoints, Tabs } from '@fingerlabs/definixswap-uikit-v2'
import ListPageHeader from 'components/ListPageHeader'
import VFinixSummary from './VFinixSummary'
import Earned from './Earned'
import NetWorth from './NetWorth'
import FavEarnd from './FavEarned'

function CardSummary({ products }) {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const tabs = useMemo(() => {
    return [
      {
        id: 'finix_earned',
        name: t('FINIX Earned tab'),
      },
      {
        id: 'favor_earned',
        name: t('FAV Earned tab'),
      },
      {
        id: 'networth',
        name: t('Net Worth'),
      },
    ]
  }, [t])
  const [curTab, setCurTab] = useState<string>(tabs[0].id)
  const longTermStake = useMemo(
    () => products.find((product) => product.type.toLowerCase() === 'longtermstake'),
    [products],
  )
  const hasLongTermStake = useMemo(
    () => longTermStake && longTermStake.data && longTermStake.data.grade !== '',
    [longTermStake],
  )

  return (
    <>
      <ListPageHeader type="myInvestment" {...(hasLongTermStake ? { grade: longTermStake.data.grade } : {})} />

      {hasLongTermStake && (
        <VFinixSummary grade={longTermStake.data.grade} balance={longTermStake.data.balancevfinix} />
      )}

      <Card isOverflowHidden>
        <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} small={isMobile} equal={isMobile} />
        {curTab === tabs[0].id && <Earned isMobile={isMobile} products={groupBy(products, 'type')} />}
        {curTab === tabs[1].id && <FavEarnd isMobile={isMobile} products={groupBy(products, 'type')} />}
        {curTab === tabs[2].id && <NetWorth isMobile={isMobile} products={groupBy(products, 'type')} />}
      </Card>
    </>
  )
}

export default CardSummary
