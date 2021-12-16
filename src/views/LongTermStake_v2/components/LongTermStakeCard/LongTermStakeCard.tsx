import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useAllLock } from 'hooks/useLongTermStake'
import { Flex, Box, useMatchBreakpoints, Grid } from '@fingerlabs/definixswap-uikit-v2'
import MainInfoSection from './MainInfoSection'
import MyBalanceSection from './DetailsSection'
import HarvestAction from './HarvestAction'

const Wrap = styled(Box)`
  padding: ${({ theme }) => theme.spacing.S_40}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: ${({ theme }) => theme.spacing.S_20}px;
  }
`

const LongTermStakeCard: React.FC<{
  longTermStake: any
}> = ({ longTermStake }) => {
  const { t } = useTranslation()
  const { isMaxXl } = useMatchBreakpoints()

  const { lockAmount, finixEarn } = longTermStake
  useAllLock()

  const hasReward = useMemo(() => finixEarn > 0, [finixEarn])

  // console.groupCollapsed('long term')
  // console.log('long term stake card: ', rest);
  // console.log('my staked: ', numeral(lockAmount).format('0,0.[00]'))
  // console.log('earned: ', numeral(finixEarn).format('0,0.00'))
  // console.groupEnd()

  /**
   * Main info Section
   */
  const renderCardHeading = useCallback(() => {
    return <MainInfoSection apy={longTermStake.apyValue} />
  }, [longTermStake.apyValue])
  /**
   * MyBalance Section
   */
  const renderMyBalanceSection = useCallback(() => {
    return <MyBalanceSection title={t('My Staked')} myBalance={lockAmount} />
  }, [t, lockAmount])
  /**
   * Earnings Section
   */
  const renderEarningsSection = useCallback(
    () => <HarvestAction title={t('Earned')} earnings={finixEarn} hasReward={hasReward}/>,
    [t, finixEarn, hasReward],
  )

  return (
    <>
      <Wrap>
        <Grid gridTemplateColumns={isMaxXl ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMaxXl ? '16px' : '2rem'}>
          <Flex alignItems="center">{renderCardHeading()}</Flex>
          <Box>{renderMyBalanceSection()}</Box>
          <Box>{renderEarningsSection()}</Box>
        </Grid>
      </Wrap>
    </>
  )
}
export default LongTermStakeCard
