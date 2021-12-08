import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import {
  Flex,
  Card,
  CardRibbon,
  IconButton,
  Box,
  ArrowBottomGIcon,
  ArrowTopGIcon,
  Divider,
  ColorStyles,
  useMatchBreakpoints,
  Grid,
} from 'definixswap-uikit'
// import PoolSash from '../PoolSash'
import CardHeading from './CardHeading'
import { TotalStakedSection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import PoolConText from '../../PoolContext'
import { PoolCardProps } from './types'

const CardWrap = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.S_16}px;
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
const Wrap = styled(Box)`
  padding: ${({ theme }) => theme.spacing.S_32}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: ${({ theme }) => theme.spacing.S_20}px;
  }
`

const PoolCard: React.FC<PoolCardProps> = ({ componentType = 'pool', pool, myBalanceInWallet }) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const isInMyInvestment = useMemo(() => componentType === 'myInvestment', [componentType])
  const { sousId, tokenName, totalStaked } = pool

  const isBnbPool = useMemo(() => pool.poolCategory === PoolCategory.KLAYTN, [pool.poolCategory])
  const isOldSyrup = useMemo(() => pool.stakingTokenName === QuoteToken.SYRUP, [pool.stakingTokenName])

  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const allowance = useMemo(() => new BigNumber(pool.userData?.allowance || 0), [pool.userData])
  const earnings = useMemo(() => new BigNumber(pool.userData?.pendingReward || 0), [pool.userData])
  const stakedBalance = useMemo(() => new BigNumber(pool.userData?.stakedBalance || 0), [pool.userData])

  const needsApprovalContract = useMemo(() => {
    return stakedBalance?.toNumber() <= 0 && !allowance.toNumber() && !isBnbPool
  }, [stakedBalance, allowance, isBnbPool])

  // const renderSash = () => {
  //   if (tokenName === 'FINIX-SIX' && !isFinished) {
  //     return <PoolSash type="special" />
  //   }
  //   if (isFinished && sousId !== 0 && sousId !== 1) {
  //     return <PoolSash type="finish" />
  //   }

  //   return null
  // }

  const renderCardHeading = useCallback(
    () => <CardHeading isOldSyrup={isOldSyrup} pool={pool} size={isInMyInvestment && 'small'} />,
    [isOldSyrup, pool, isInMyInvestment],
  )
  const renderToggleButton = useCallback(
    () => (
      <IconButton onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
        {isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
      </IconButton>
    ),
    [isOpenAccordion],
  )
  const renderTotalStakedSection = useCallback(
    () => <TotalStakedSection title={t('Total staked')} tokenName={tokenName} totalStaked={totalStaked} />,
    [t, tokenName, totalStaked],
  )

  const renderMyBalanceSection = useCallback(() => {
    if (!myBalanceInWallet || myBalanceInWallet === null) return null
    return <MyBalanceSection title={t('Balance')} tokenName={tokenName} myBalance={myBalanceInWallet} />
  }, [t, tokenName, myBalanceInWallet])
  const renderEarningsSection = useCallback(
    () => <EarningsSection title={t('Earned')} earnings={earnings} />,
    [t, earnings],
  )

  const renderStakeAction = useCallback(
    () => (
      <PoolConText.Consumer>
        {({ goDeposit, goWithdraw }) => (
          <StakeAction
            componentType={componentType}
            isOldSyrup={isOldSyrup}
            pool={pool}
            stakedBalance={stakedBalance}
            needsApprovalContract={needsApprovalContract}
            onPresentDeposit={() =>
              goDeposit({
                isOldSyrup,
                isBnbPool,
                pool,
              })
            }
            onPresentWithdraw={() =>
              goWithdraw({
                isOldSyrup,
                pool,
              })
            }
          />
        )}
      </PoolConText.Consumer>
    ),
    [pool, isOldSyrup, needsApprovalContract, stakedBalance, componentType, isBnbPool],
  )
  const renderHarvestActionAirDrop = useCallback(
    () => (
      <HarvestActionAirDrop
        componentType={componentType}
        isBnbPool={isBnbPool}
        isOldSyrup={isOldSyrup}
        needsApprovalContract={needsApprovalContract}
        sousId={sousId}
        earnings={earnings}
        farm={pool.farm}
      />
    ),
    [componentType, isBnbPool, isOldSyrup, needsApprovalContract, sousId, earnings, pool.farm],
  )
  // const renderLinkSection = useCallback(() => <LinkListSection isMobile={isMobile} klaytnScopeAddress="" />, [isMobile])

  if (isInMyInvestment) {
    return (
      <>
        <Wrap>
          <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMobile ? '16px' : '2rem'}>
            <Box>{renderCardHeading()}</Box>
            <Box>{renderStakeAction()}</Box>
            <Box>{renderHarvestActionAirDrop()}</Box>
          </Grid>
        </Wrap>
      </>
    )
  }

  return (
    <CardWrap ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />}>
      {isMobile ? (
        <>
          <Wrap>
            <Flex justifyContent="space-between">
              {renderCardHeading()}
              {renderToggleButton()}
            </Flex>
            {renderEarningsSection()}
          </Wrap>
          {isOpenAccordion && (
            <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_20" py="S_24">
              {renderHarvestActionAirDrop()}
              <Box py="S_24">{renderStakeAction()}</Box>
              <Divider />
              <Box pt="S_24">{renderTotalStakedSection()}</Box>
              <Box pt="S_16" py="S_28">
                {renderMyBalanceSection()}
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          <Wrap>
            <Flex justifyContent="space-between">
              <Box className="card-heading">{renderCardHeading()}</Box>
              <Box className="total-staked-section">{renderTotalStakedSection()}</Box>
              <Box className="my-balance-section">{renderMyBalanceSection()}</Box>
              <Box className="earnings-section">{renderEarningsSection()}</Box>
              {renderToggleButton()}
            </Flex>
          </Wrap>
          {isOpenAccordion && (
            <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_32" py="S_24">
              <Flex justifyContent="space-between">
                <Box className="link-section" />
                <Box className="harvest-action-section">{renderHarvestActionAirDrop()}</Box>
                <Box className="stake-action-section">{renderStakeAction()}</Box>
              </Flex>
            </Box>
          )}
        </>
      )}
    </CardWrap>
  )
}

export default PoolCard
