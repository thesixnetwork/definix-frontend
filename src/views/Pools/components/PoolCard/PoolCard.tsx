import useWallet from 'hooks/useWallet'
import BigNumber from 'bignumber.js'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { getSwapUrlPathParts } from 'utils/getUrlPathParts'
import useConverter from 'hooks/useConverter'
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
import CardHeading from 'components/FarmAndPool/CardHeading'
import { EarningsSection, TotalStakedSection } from 'components/FarmAndPool/DetailsSection'
import HarvestActionAirDrop from 'components/FarmAndPool/HarvestActionAirDrop'
import StakeAction from 'components/FarmAndPool/StakeAction'
import LinkListSection from 'components/FarmAndPool/LinkListSection'
import PoolConText from '../../PoolContext'
import { PoolCardProps } from './types'
import { getBalanceNumber } from 'utils/formatBalance'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import { useSousHarvest } from 'hooks/useHarvest'

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

const PoolCard: React.FC<PoolCardProps> = ({ componentType = 'pool', pool }) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const { convertToPriceFromSymbol } = useConverter()
  const isInMyInvestment = useMemo(() => componentType === 'myInvestment', [componentType])
  const { account } = useWallet()
  const { sousId, tokenName, totalStaked } = pool
  const stakingTokenContract = useERC20(pool.stakingTokenAddress)
  const { onApprove } = useSousApprove(stakingTokenContract, pool.sousId)
  
  const isBnbPool = useMemo(() => pool.poolCategory === PoolCategory.KLAYTN, [pool.poolCategory])
  const isOldSyrup = useMemo(() => pool.stakingTokenName === QuoteToken.SYRUP, [pool.stakingTokenName])
  
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const allowance = useMemo(() => new BigNumber(pool.userData?.allowance || 0), [pool.userData])
  const earnings = useMemo(() => new BigNumber(pool.userData?.pendingReward || 0), [pool.userData])
  const stakedBalance = useMemo(() => new BigNumber(pool.userData?.stakedBalance || 0), [pool.userData])

  const addSwapUrl = useMemo(() => {
    const swapUrlPathParts = getSwapUrlPathParts({ tokenAddress: pool.stakingTokenAddress })
    return `/swap/${swapUrlPathParts}`
  }, [pool.stakingTokenAddress])

  const tokenApyList = useMemo(() => {
    return [{
      symbol: pool.tokenName,
      apy: pool.apy
    }]
  }, [pool])

  /**
   * CardHeading
   */
  const renderCardHeading = useMemo(
    () => (
      <CardHeading
        tokenNames={pool.tokenName}
        // isOldSyrup={isOldSyrup}
        tokenApyList={tokenApyList}
        size={isInMyInvestment && 'small'}
        componentType={componentType}
        isFarm={false}
      />
    ),
    [tokenApyList, isInMyInvestment, componentType, pool],
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
   * Earnings Section
   */
  const renderEarningsSection = useMemo(
    () => <EarningsSection allEarnings={[{
      symbol: QuoteToken.FINIX,
      earnings: getBalanceNumber(earnings)
    }]} isMobile={isMobile} />,
    [t, earnings, isMobile],
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
  const stakedBalancePrice = useMemo(() => {
    const price = convertToPriceFromSymbol(pool.tokenName)
    return new BigNumber(getBalanceNumber(stakedBalance)).multipliedBy(price).toNumber()
  }, [stakedBalance, convertToPriceFromSymbol, pool.tokenName])

  const isEnableAddStake = useMemo(() => {
    return !isOldSyrup && !pool.isFinished && !isBnbPool
  }, [isOldSyrup, pool.isFinished, isBnbPool])

  const renderStakeAction = useMemo(
    () => (type?: string) => (
      <PoolConText.Consumer>
        {({ goDeposit, goWithdraw }) => (
          <StakeAction
            componentType={type || componentType}
            // isOldSyrup={isOldSyrup}
            // isBnbPool={isBnbPool}
            hasAccount={hasAccount}
            hasUserData={hasUserData}
            hasAllowance={hasAllowance}

            isEnableRemoveStake={stakedBalance.eq(new BigNumber(0))}
            isEnableAddStake={isEnableAddStake}
            stakedBalance={stakedBalance}
            stakedBalancePrice={stakedBalancePrice}
            stakedBalanceUnit={pool.tokenName}
            onApprove={onApprove}

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
        allEarnings={[{
          symbol: QuoteToken.FINIX,
          earnings: getBalanceNumber(earnings)
        }]}
        isEnableHarvest={!account || ((!hasUserData || !hasAllowance || isBnbPool) && !isOldSyrup) || !earnings.toNumber()}
        // farm={pool.farm}
        tokenName={tokenName}
        onReward={onReward}
      />
    ),
    [componentType, account, isBnbPool, isOldSyrup, hasUserData, hasAllowance, sousId, earnings, tokenName, onReward],
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
              <Box py="S_24">{renderStakeAction('accordian')}</Box>
              <Divider />
              <Box pt="S_24">{renderTotalStakedSection}</Box>
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
                <Box className="stake-action-section">{renderStakeAction('accordian')}</Box>
              </Flex>
            </Box>
          )}
        </>
      )}
    </CardWrap>
  )
}

export default PoolCard
