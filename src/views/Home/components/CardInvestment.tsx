import React, { useMemo } from 'react'
import { Card, CardBody, ColorStyles, useMatchBreakpoints } from 'definixswap-uikit'
import Earned from 'views/MyInvestments/components/Earned'

const CardInvestment = () => {
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])

  return (
    <Card bg={ColorStyles.DEEPBROWN}>
      <CardBody p="0">
        <Earned isMobile={isMobile} theme="dark" />
        {/* <EarningBoxTemplate
          theme="dark"
          isMobile={isMobile}
          hasAccount={!!account}
          total={{
            title: t('Total Finix Earned'),
            value: earnedList.reduce((result, item) => result + item.value, 0),
            price: earnedList.reduce((result, item) => result + item.price, 0),
          }}
          valueList={earnedList}
        /> */}
      </CardBody>
    </Card>
  )
}

export default CardInvestment
