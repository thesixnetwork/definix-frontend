/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import React from 'react'
import { Card, CardBody, Flex, useMatchBreakpoints, VDivider } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import TwoLineFormat from './TwoLineFormat'
import CardHeading from './CardHeading'

interface WithdrawSummaryCardProp {
  rebalance
  currentBalanceNumber
}

const WithdrawSummaryCard: React.FC<WithdrawSummaryCardProp> = ({ rebalance, currentBalanceNumber }) => {
  const { t } = useTranslation()
  const { isMaxSm } = useMatchBreakpoints()
  const isMobile = isMaxSm

  return (
    <Card mb="S_16">
      <CardBody p={isMobile ? 'S_20' : 'S_40'}>
        <CardHeading
          rebalance={rebalance}
          isHorizontal={isMobile}
          className={`mb-s24 ${isMobile ? 'pb-s28' : 'pb-s24'}`}
          onlyTitle
        />

        <Flex justifyContent="space-between" flexWrap="wrap">
          <Flex width={isMobile ? '50%' : '33.33%'} mb={isMobile ? 'S_20' : ''}>
            <TwoLineFormat
              title={t('Shares')}
              value={`${numeral(currentBalanceNumber).format('0,0.[00]')}`}
              hint={t('A return of investment paid')}
            />
          </Flex>
          <Flex width={isMobile ? '50%' : '33.33%'}>
            {isMobile || <VDivider mr="S_24" />}
            <TwoLineFormat
              title={t('Share Price (Since Inception)')}
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
          </Flex>
          <Flex width={isMobile ? '50%' : '33.33%'}>
            {isMobile || <VDivider mr="S_24" />}
            <TwoLineFormat
              width={isMobile ? '50%' : ''}
              title={t('Total Value')}
              value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
            />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default WithdrawSummaryCard
