/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import React from 'react'
import { Card, CardBody, Flex, useMatchBreakpoints } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import TwoLineFormat from './TwoLineFormat'
import CardHeading from './CardHeading'

interface WithdrawSummaryCardProp {
  rebalance
  currentBalanceNumber
}

const WithdrawSummaryCard: React.FC<WithdrawSummaryCardProp> = ({ rebalance, currentBalanceNumber }) => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl

  return (
    <Card mb="S_16">
      <CardBody>
        <CardHeading
          rebalance={rebalance}
          isHorizontal={isMobile}
          className={`mb-s24 ${isMobile ? 'pb-s28' : 'pb-s24 bd-b'}`}
        />

        <Flex justifyContent="space-between" flexWrap="wrap">
          <TwoLineFormat
            className={isMobile ? 'col-6 mb-s20' : 'col-4'}
            title={t('Shares')}
            value={`${numeral(currentBalanceNumber).format('0,0.[00]')}`}
            hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
          />

          <TwoLineFormat
            className={isMobile ? 'col-6' : 'col-4 bd-l pl-s32'}
            title={t('Share Price(Since Inception)')}
            value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
            percent={`${
              rebalance.sharedPricePercentDiff >= 0
                ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
            }%`}
            percentClass={(() => {
              if (rebalance.sharedPricePercentDiff < 0) return 'failure'
              if (rebalance.sharedPricePercentDiff > 0) return 'success'
              return ''
            })()}
          />
          <TwoLineFormat
            className={isMobile ? 'col-6' : 'col-4 bd-l pl-s32'}
            title={t('Risk-0-Meter')}
            value="Medium"
          />
        </Flex>
      </CardBody>
    </Card>
  )
}

export default WithdrawSummaryCard
