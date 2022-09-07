import { groupBy } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { Box, Card, CardBody, ColorStyles, Tabs, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
// import useMyInvestments from 'hooks/useMyInvestments'
import Earned from './Earned'
// import FavEarnd from './FavEarned'
import styled from 'styled-components'
// import { FAVOR_FARMS } from 'config/constants/farms'

const WrapTabs = styled(Box)`
  width: 100%;
  .tab {
  }
`

const CardInvestment = () => {
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const myInvestments = null // useMyInvestments()
  const tabs = useMemo(() => {
    return [
      {
        id: 'finix_earned',
        name: 'FINIX Earned',
      },
      {
        id: 'favor_earned',
        name: 'FAV Earned',
      },
    ]
  }, [])

  const [curTab, setCurTab] = useState<string>(tabs[0].id)

  //   const favorProducts = useMemo(() => {
  //     const favorPids = FAVOR_FARMS.map(({ pid }) => pid)
  //     return myInvestments.filter(({ type, data }) => {
  //       if (type !== 'farm') return false
  //       return !!favorPids.includes(data.pid)
  //     })
  //   }, [myInvestments])

  return (
    <Card cardBg={ColorStyles.DEEPBROWN} style={{ backgroundColor: '#413343' }} isOverflowHidden>
      <WrapTabs>
        <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} small={isMobile} equal={isMobile} theme="dark" />
      </WrapTabs>
      <CardBody style={{ padding: 0 }}>
        {curTab === tabs[0].id && (
          <Earned isMain isMobile={isMobile} products={groupBy(myInvestments, 'type')} theme="dark" />
        )}
        {/* {curTab === tabs[1].id && (
          <FavEarnd isMain isMobile={isMobile} products={groupBy(favorProducts, 'type')} theme="dark" />
        )} */}
      </CardBody>
    </Card>
  )
}

export default CardInvestment
