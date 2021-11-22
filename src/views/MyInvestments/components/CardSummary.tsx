import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, useMatchBreakpoints, TabBox } from 'definixswap-uikit'
import Earned from './Earned'
import NetWorth from './NetWorth'

function CardSummary() {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  return (
    <Card className="mt-s16">
      <TabBox
        tabs={[
          {
            name: t('Earned'),
            component: <Earned isMobile={isMobile} />,
          },
          {
            name: t('Net Worth'),
            component: <NetWorth />,
          },
        ]}
      />
    </Card>
  )
}

export default CardSummary
