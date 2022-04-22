import useWallet from 'hooks/useWallet'
import BigNumber from 'bignumber.js'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { getSwapUrlPathParts } from 'utils/getUrlPathParts'
import {
  Flex,
  Card,
  IconButton,
  Box,
  ArrowBottomGIcon,
  ArrowTopGIcon,
  Divider,
  ColorStyles,
  useMatchBreakpoints,
  Grid,
} from '@fingerlabs/definixswap-uikit-v2'
import CardHeading from './CardHeading'
import { TotalStakedSection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import LinkListSection from './LinkListSection'
import PoolConText from '../../PoolContext'
import { PoolCardProps } from './types'

const CardWrap = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.S_16}px;
  ${({ theme }) => theme.mediaQueries.xl} {
    .card-heading {
      width: 204px;
    }
    .total-staked-section {
      width: 144px;
    }
    .my-balance-section {
      margin: 0 ${({ theme }) => theme.spacing.S_24}px;
      width: 232px;
    }
    .earnings-section {
      width: 200px;
    }
    .link-section {
      width: 166px;
    }
    .harvest-action-section {
      margin: 0 ${({ theme }) => theme.spacing.S_24}px;
      width: 358px;
    }
    .stake-action-section {
      width: 276px;
    }
  }
`
const Wrap = styled(Box)<{ paddingLg: boolean }>`
  padding: ${({ theme, paddingLg }) => (paddingLg ? theme.spacing.S_40 : theme.spacing.S_32)}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: ${({ theme }) => theme.spacing.S_20}px;
  }
`

const PoolCard: React.FC<PoolCardProps> = ({ componentType = 'pool', pool, myBalanceInWallet }) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const isInMyInvestment = useMemo(() => componentType === 'myInvestment', [componentType])
  const { account } = useWallet()
  const { sousId, tokenName, totalStaked } = pool

  const isBnbPool = useMemo(() => pool.poolCategory === PoolCategory.KLAYTN, [pool.poolCategory])
  const isOldSyrup = useMemo(() => pool.stakingTokenName === QuoteToken.SYRUP, [pool.stakingTokenName])

  const allowance = useMemo(() => new BigNumber(pool.userData?.allowance || 0), [pool.userData])
  const earnings = useMemo(() => new BigNumber(pool.userData?.pendingReward || 0), [pool.userData])
  const stakedBalance = useMemo(() => new BigNumber(pool.userData?.stakedBalance || 0), [pool.userData])

  const addSwapUrl = useMemo(() => {
    const swapUrlPathParts = getSwapUrlPathParts({ tokenAddress: pool.stakingTokenAddress })
    return `/swap/${swapUrlPathParts}`
  }, [pool.stakingTokenAddress])

  /**
   * CardHeading
   */
  const renderCardHeading = useMemo(
    () => (
      <CardHeading
        isOldSyrup={isOldSyrup}
        pool={pool}
        size={isInMyInvestment && 'small'}
        componentType={componentType}
      />
    ),
    [isOldSyrup, pool, isInMyInvestment, componentType],
  )
  /**
   * IconButton
   */
  const renderToggleButton = useMemo(
    () => (
      <IconButton onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
        {isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
      </IconButton>
    ),
    [isOpenAccordion],
  )
  /**
   * TotalStaked Section
   */
  const renderTotalStakedSection = useMemo(
    () => <TotalStakedSection title={t('Total staked')} tokenName={tokenName} totalStaked={totalStaked} />,
    [t, tokenName, totalStaked],
  )
  /**
   * MyBalance Section
   */
  const renderMyBalanceSection = useMemo(() => {
    return <MyBalanceSection title={t('Balance')} tokenName={tokenName} myBalance={myBalanceInWallet} />
  }, [t, tokenName, myBalanceInWallet])
  /**
   * Earnings Section
   */
  const renderEarningsSection = useMemo(
    () => <EarningsSection title={t('Earned')} earnings={earnings} />,
    [t, earnings],
  )
  /**
   * StakeAction Section
   */
  const hasAccount = useMemo(() => !!account, [account])
  const hasUserData = useMemo(() => !!pool.userData, [pool.userData])
  const hasAllowance = useMemo(() => allowance && allowance.isGreaterThan(0), [allowance])
  const dataForNextState = useMemo(() => {
    return {
      isOldSyrup,
      isBnbPool,
      pool,
      addSwapUrl,
    }
  }, [isOldSyrup, isBnbPool, pool, addSwapUrl])

  const renderStakeAction = useMemo(
    () => (type?: string) => (
      <PoolConText.Consumer>
        {({ goDeposit, goWithdraw }) => (
          <StakeAction
            componentType={type || componentType}
            isOldSyrup={isOldSyrup}
            isBnbPool={isBnbPool}
            hasAccount={hasAccount}
            hasUserData={hasUserData}
            hasAllowance={hasAllowance}
            pool={pool}
            stakedBalance={stakedBalance}
            onPresentDeposit={() => goDeposit(dataForNextState)}
            onPresentWithdraw={() => goWithdraw(dataForNextState)}
          />
        )}
      </PoolConText.Consumer>
    ),
    [
      pool,
      isOldSyrup,
      isBnbPool,
      hasAccount,
      hasUserData,
      hasAllowance,
      stakedBalance,
      componentType,
      dataForNextState,
    ],
  )
  /**
   * HarvestAction Section
   */
  const renderHarvestActionAirDrop = useMemo(
    () => (
      <HarvestActionAirDrop
        componentType={componentType}
        isBnbPool={isBnbPool}
        isOldSyrup={isOldSyrup}
        needsApprovalContract={!hasUserData || !hasAllowance || isBnbPool}
        sousId={sousId}
        earnings={earnings}
        // farm={pool.farm}
        tokenName={tokenName}
      />
    ),
    [componentType, isBnbPool, isOldSyrup, hasUserData, hasAllowance, sousId, earnings, tokenName],
  )
  /**
   * Link Section
   */
  const renderLinkSection = useMemo(
    () => <LinkListSection contractAddress={pool.contractAddress} />,
    [pool.contractAddress],
  )

  if (isInMyInvestment) {
    return (
      <>
        <Wrap paddingLg>
          <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMobile ? '16px' : '2rem'}>
            <Flex alignItems="center">{renderCardHeading}</Flex>
            <Box>{renderStakeAction()}</Box>
            <Box>{renderHarvestActionAirDrop}</Box>
          </Grid>
        </Wrap>
      </>
    )
  }

  return (
    <CardWrap>
      {isMobile ? (
        <>
          <Wrap paddingLg={false}>
            <Flex justifyContent="space-between">
              {renderCardHeading}
              {renderToggleButton}
            </Flex>
            {renderEarningsSection}
          </Wrap>
          {isOpenAccordion && (
            <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_20" py="S_24">
              {renderHarvestActionAirDrop}
              <Box py="S_24">{renderStakeAction()}</Box>
              <Divider />
              <Box pt="S_24">{renderTotalStakedSection}</Box>
              <Box pt="S_16">{renderMyBalanceSection}</Box>
              <Box py="S_28">{renderLinkSection}</Box>
            </Box>
          )}
        </>
      ) : (
        <>
          <Wrap paddingLg={false}>
            <Flex justifyContent="space-between">
              <Flex className="card-heading" alignItems="center">
                {renderCardHeading}
              </Flex>
              <Box className="total-staked-section">{renderTotalStakedSection}</Box>
              <Box className="my-balance-section">{renderStakeAction()}</Box>
              <Box className="earnings-section">{renderEarningsSection}</Box>
              {renderToggleButton}
            </Flex>
          </Wrap>
          {isOpenAccordion && (
            <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_32" py="S_24">
              <Flex justifyContent="space-between">
                <Box className="link-section">{renderLinkSection}</Box>
                <Box className="harvest-action-section">{renderHarvestActionAirDrop}</Box>
                <Box className="stake-action-section">{renderStakeAction('pool-accordian')}</Box>
              </Flex>
            </Box>
          )}
        </>
      )}
    </CardWrap>
  )
}

export default PoolCard
