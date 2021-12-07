/* eslint-disable no-nested-ternary */
import React from 'react'
import { Card, CardBody, Flex, useMatchBreakpoints, VDivider } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import CardHeading from './CardHeading'
import SharePrice from './SharePrice'
import Shares from './Shares'
import TotalValue from './TotalValue'

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
            <Shares balance={currentBalanceNumber} small={isMobile} />
          </Flex>
          <Flex width={isMobile ? '50%' : '33.33%'}>
            {isMobile || <VDivider />}
            <SharePrice price={rebalance.sharedPrice} diff={rebalance.sharedPricePercentDiff} small={isMobile} />
          </Flex>
          <Flex width={isMobile ? '50%' : '33.33%'}>
            {isMobile || <VDivider mr="S_24" />}
            <TotalValue balance={currentBalanceNumber} price={rebalance.sharedPrice} small={isMobile} />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default WithdrawSummaryCard
