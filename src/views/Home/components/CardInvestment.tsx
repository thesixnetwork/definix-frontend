import { groupBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { Card, CardBody, ColorStyles, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import useMyInvestments from 'hooks/useMyInvestments'
import Earned from 'views/MyInvestments/components/Earned'

const CardInvestment = () => {
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const myInvestments = useMyInvestments()

  return (
    <Card cardBg={ColorStyles.DEEPBROWN} isOverflowHidden>
      <CardBody p="0">
        <Earned isMain isMobile={isMobile} products={groupBy(myInvestments, 'type')} theme="dark" />
      </CardBody>
    </Card>
  )
}

export default CardInvestment
