import { groupBy } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { Box, Card, CardBody, ColorStyles, Tabs, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import useMyInvestments from 'hooks/useMyInvestments'
import Earned from 'views/MyInvestments/components/Earned'
import { useTranslation } from 'react-i18next'
import FavEarnd from 'views/MyInvestments/components/FavEarned'
import styled from 'styled-components'

const WrapTabs = styled(Box)`
  width: 100%;
  // background-color: ${({ theme }) => theme.colors.black20};

  .tab {

  }
`

const CardInvestment = () => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const myInvestments = useMyInvestments()
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
    ]
  }, [t])
  const [curTab, setCurTab] = useState<string>(tabs[0].id)

  return (
    <Card cardBg={ColorStyles.DEEPBROWN} isOverflowHidden>
      <WrapTabs>
        <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} small={isMobile} equal={isMobile} theme="dark" />
      </WrapTabs>
      <CardBody p="0">
        {curTab === tabs[0].id && <Earned isMain isMobile={isMobile} products={groupBy(myInvestments, 'type')} theme="dark" />}
        {curTab === tabs[1].id && <FavEarnd isMain isMobile={isMobile} products={groupBy(myInvestments, 'type')} theme="dark" />}
      </CardBody>
    </Card>
  )
}

export default CardInvestment
