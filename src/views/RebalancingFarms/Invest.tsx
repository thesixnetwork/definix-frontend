/* eslint-disable no-nested-ternary */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Redirect, useHistory } from 'react-router-dom'

import { BackIcon, Box, Button, Flex, Text, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'

import PageTitle from 'components/PageTitle'
import { Rebalance } from '../../state/types'
import InvestInputCard from './components/InvestInputCard'
import SummaryCard, { SummaryItem } from './components/SummaryCard'

interface InvestType {
  rebalance: Rebalance | any
}

const Invest: React.FC<InvestType> = ({ rebalance }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { isMaxSm } = useMatchBreakpoints()
  const isMobile = isMaxSm

  if (!rebalance) return <Redirect to="/rebalancing" />

  return (
    <Box maxWidth="630px" mx="auto">
      <Flex className="mb-s20">
        <Button
          variant="text"
          as={Link}
          to="/rebalancing/detail"
          height="24px"
          p="0"
          startIcon={<BackIcon color="textSubtle" />}
        >
          <Text textStyle="R_16R" color="textSubtle">
            {t('Back')}
          </Text>
        </Button>
      </Flex>
      <PageTitle text={t('Invest')} desc={t('Invest in auto rebalancing products.')} small={isMobile} />

      <SummaryCard
        rebalance={rebalance}
        isMobile={isMobile}
        typeB
        items={[SummaryItem.YIELD_APR, SummaryItem.SHARE_PRICE_W_YIELD, SummaryItem.RISK_O_METER]}
      />

      <InvestInputCard
        isMobile={isMobile}
        rebalance={rebalance}
        onNext={() => {
          history.goBack()
        }}
      />
    </Box>
  )
}

export default Invest