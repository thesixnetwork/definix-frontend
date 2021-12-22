import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, useMatchBreakpoints, Tabs } from '@fingerlabs/definixswap-uikit-v2'
import ListPageHeader from 'components/ListPageHeader'
import VFinixSummary from './VFinixSummary'
import Earned from './Earned'
import NetWorth from './NetWorth'

function CardSummary({ products }) {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const tabs = useMemo(() => [t('Earned'), t('Net Worth')], [t])
  const [curTab, setCurTab] = useState<string>(tabs[0])
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
        {curTab === tabs[1] ? (
          <NetWorth isMobile={isMobile} products={_.groupBy(products, 'type')} />
        ) : (
          <Earned isMobile={isMobile} products={_.groupBy(products, 'type')} />
        )}
      </Card>
    </>
  )
}

export default CardSummary
