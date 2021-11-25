import _ from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from 'state/hooks'
import {
  Card,
  useMatchBreakpoints,
  TabBox,
  Flex,
  TitleSet,
  Box,
  ImgMyInvestmentDefaultIcon,
  alertVariants,
} from 'definixswap-uikit'
import Earned from './Earned'
import NetWorth from './NetWorth'

function CardSummary({ products }) {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { toastInfo, toastError, toastSuccess, toastWarning, push } = useToast()

  useEffect(() => {
    setTimeout(() => {
      toastInfo('toast title', 'toast desc4')
    }, 5000)
    setTimeout(() => {
      toastInfo('toast title', 'toast desc3')
    }, 4000)
    setTimeout(() => {
      toastInfo('toast title', 'toast desc2')
    }, 3000)
    setTimeout(() => {
      toastError('toast title', 'toast desc1')
    }, 2000)
  }, [toastInfo, toastError, toastSuccess, toastWarning])
  return (
    <>
      <Flex justifyContent="space-between" className={`mt-s28 ${isMobile ? 'mb-s28' : ''}`}>
        <TitleSet title={t('My Investment')} description={t('Check your investment history and profit')} />
        {!isMobile && (
          <Box className="mr-s16">
            <ImgMyInvestmentDefaultIcon display="block" />
          </Box>
        )}
      </Flex>
      <Card>
        <TabBox
          tabs={[
            {
              name: t('Earned'),
              component: <Earned isMobile={isMobile} />,
            },
            {
              name: t('Net Worth'),
              component: <NetWorth isMobile={isMobile} products={_.groupBy(products, 'type')} />,
            },
          ]}
        />
      </Card>
    </>
  )
}

export default CardSummary
