import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useHarvest, useAllLock } from 'hooks/useLongTermStake'
import { Flex, Box, useMatchBreakpoints, Grid, Button, ButtonVariants } from 'definixswap-uikit-v2'
import MainInfoSection from './MainInfoSection'
import { MyBalanceSection, EarningsSection } from './DetailsSection'

const Wrap = styled(Box)`
  padding: ${({ theme }) => theme.spacing.S_32}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: ${({ theme }) => theme.spacing.S_20}px;
  }
`
const HarvestSection = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    width: 100%;
  }
`
const ButtonSection = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  width: 100px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: row;
    margin-top: ${({ theme }) => theme.spacing.S_28}px;
    width: 100%;
  }
`
const DetailButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.S_8}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 0;
    margin-left: ${({ theme }) => theme.spacing.S_16}px;
  }
`

const LongTermStakeCard: React.FC<{
  longTermStake: any
}> = ({ longTermStake }) => {
  const { t } = useTranslation()
  const { isMaxXl } = useMatchBreakpoints()
  const navigate = useHistory()

  const { lockAmount, finixEarn } = longTermStake
  const { handleHarvest } = useHarvest()
  useAllLock()

  const [isLoadingHarvest, setIsLoadingHarvest] = useState(false)
  const valueReward = useMemo(() => finixEarn > 0, [finixEarn])

  // console.groupCollapsed('long term')
  // console.log('long term stake card: ', rest);
  // console.log('my staked: ', numeral(lockAmount).format('0,0.[00]'))
  // console.log('earned: ', numeral(finixEarn).format('0,0.00'))
  // console.groupEnd()

  const handleGoToDetail = useCallback(() => navigate.push('/pool'), [navigate])

  const harvest = useCallback(async () => {
    try {
      setIsLoadingHarvest(true)
      const res = await handleHarvest()
      if (!res) {
        // setStatus(!status)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingHarvest(false)
    }
  }, [handleHarvest])

  /**
   * Main info Section
   */
  const renderCardHeading = useCallback(() => {
    return <MainInfoSection />
  }, [])
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
    () => <EarningsSection title={t('Earned')} earnings={finixEarn} />,
    [t, finixEarn],
  )

  return (
    <>
      <Wrap>
        <Grid gridTemplateColumns={isMaxXl ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMaxXl ? '16px' : '2rem'}>
          <Box>{renderCardHeading()}</Box>
          <Box>{renderMyBalanceSection()}</Box>
          <HarvestSection>
            {renderEarningsSection()}
            <ButtonSection mt={isMaxXl ? 'S_24' : ''}>
              <Button
                variant={ButtonVariants.RED}
                width="100%"
                disabled={!valueReward}
                isLoading={isLoadingHarvest}
                onClick={harvest}
              >
                {t('Harvest')}
              </Button>
              <DetailButton variant={ButtonVariants.BROWN} width="100%" onClick={handleGoToDetail}>
                {t('Detail')}
              </DetailButton>
            </ButtonSection>
          </HarvestSection>
        </Grid>
      </Wrap>
    </>
  )
}
export default LongTermStakeCard
