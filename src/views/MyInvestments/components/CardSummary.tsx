import { groupBy } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { Box, CardBody, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import Card from 'uikitV2/components/Card'
// import ListPageHeader from 'components/ListPageHeader'
import VFinixSummary from './VFinixSummary'
import Earned from './Earned'
import { Tab, Tabs } from '@mui/material'
// import NetWorth from './NetWorth'
// import FavEarnd from './FavEarned'
// import { FAVOR_FARMS } from 'config/constants/farms'

function CardSummary({ products }) {
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const tabs = useMemo(() => {
    return [
      {
        id: 'finix_earned',
        name: 'FINIX Earned',
      },
      // {
      //   id: 'favor_earned',
      //   name: t('FAV Earned tab'),
      // },
      // {
      //   id: 'networth',
      //   name: t('Net Worth'),
      // },
    ]
  }, [])
  const [curTab, setCurTab] = useState<string>(tabs[0].id)

  const longTermStake = useMemo(
    () => products.find((product) => product.type.toLowerCase() === 'longtermstake'),
    [products],
  )
  const hasLongTermStake = useMemo(
    () => longTermStake && longTermStake.data && longTermStake.data.grade !== '',
    [longTermStake],
  )

  // const favorProducts = useMemo(() => {
  //   const favorPids = FAVOR_FARMS.map(({ pid }) => pid)
  //   return products.filter(({ type, data }) => {
  //     if (type !== 'farm') return false
  //     return !!favorPids.includes(data.pid)
  //   })
  // }, [products])

  return (
    <>
      {/* <ListPageHeader type="myInvestment" {...(hasLongTermStake ? { grade: longTermStake.data.grade } : {})} /> */}

      {hasLongTermStake && (
        <VFinixSummary grade={longTermStake.data.grade} balance={longTermStake.data.balancevfinix} />
      )}

      <Card>
        <Tabs
          value={curTab}
          onChange={(e, value) => {
            setCurTab(value)
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          {tabs.map(({ id, name }) => (
            <Tab label={name} value={id} style={{ padding: '20px 48px' }} color="#fff" />
          ))}
        </Tabs>
        <CardBody style={{ padding: 0 }}>
          {curTab === tabs[0].id && <Earned isMobile={isMobile} products={groupBy(products, 'type')} />}
          {/* {curTab === tabs[1].id && <FavEarnd isMobile={isMobile} products={groupBy(favorProducts, 'type')} />} */}
        </CardBody>
      </Card>
    </>
  )
}

export default CardSummary
