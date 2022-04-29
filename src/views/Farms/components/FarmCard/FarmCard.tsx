import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useFarmFromSymbol, useFarmUnlockDate, useFarmUser } from 'state/hooks'
import useConverter from 'hooks/useConverter'
import { getContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
import { getLiquidityUrlPathParts } from 'utils/getUrlPathParts'
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
} from '@fingerlabs/definixswap-uikit-v2'
import CardHeading from 'components/FarmAndPool/CardHeading'
import { EarningsSection, TotalLiquiditySection } from 'components/FarmAndPool/DetailsSection'
import HarvestActionAirDrop from 'components/FarmAndPool/HarvestActionAirDrop'
import StakeAction from 'components/FarmAndPool/StakeAction'
import LinkListSection from 'components/FarmAndPool/LinkListSection'
import { FarmCardProps } from './types'
import FarmContext from '../../FarmContext'
import { getBalanceNumber } from 'utils/formatBalance'
import { TAG_COLORS } from 'config/constants/farms'
import { QuoteToken } from 'config/constants/types'
import { useApprove } from 'hooks/useApprove'
import { useHarvest } from 'hooks/useHarvest'


const FarmCard: React.FC<FarmCardProps> = ({ componentType = 'farm', farm, klaytn, account }) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const { convertToPriceFromToken } = useConverter()
  const lpTokenName = useMemo(() => farm.lpSymbols.map((lpSymbol) => lpSymbol.symbol).join('-'), [farm.lpSymbols])
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, stakedBalance, allowance, pendingRewards } = useFarmUser(pid)
  const lpContract = useMemo(() => getContract(klaytn as provider, getAddress(lpAddresses)), [klaytn, lpAddresses])
  const isInMyInvestment = useMemo(() => componentType === 'myInvestment', [componentType])
  const { onApprove } = useApprove(lpContract)
  const { onReward } = useHarvest(pid)

  const farmUnlockDate = useFarmUnlockDate()
  const isEnableAddStake = useMemo(() => {
    return (
      typeof farmUnlockDate === 'undefined' ||
      (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())
    )
  }, [farmUnlockDate])

  const addLiquidityUrl = useMemo(() => {
    const liquidityUrlPathParts = getLiquidityUrlPathParts({
      quoteTokenAdresses: farm.quoteTokenAdresses,
      quoteTokenSymbol: farm.quoteTokenSymbol,
      tokenAddresses: farm.tokenAddresses,
    })
    return `/liquidity/add/${liquidityUrlPathParts}`
  }, [farm.quoteTokenAdresses, farm.quoteTokenSymbol, farm.tokenAddresses])
  /**
   * total liquidity
   */
  const totalLiquidity: number = useMemo(() => farm.totalLiquidityValue, [farm.totalLiquidityValue])
  /**
   * my liquidity
   */
  const myLiquidity: BigNumber = useMemo(() => {
    const { lpTotalInQuoteToken, lpTotalSupply, quoteTokenBlanceLP, quoteTokenDecimals } = farm
    if (!lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    const ratio = new BigNumber(stakedBalance).div(new BigNumber(lpTotalSupply))
    const stakedTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(ratio)
      .times(new BigNumber(2))
    return convertToPriceFromToken(stakedTotalInQuoteToken, farm.quoteTokenSymbol)
  }, [farm, stakedBalance, convertToPriceFromToken])

  const apyList = useMemo(() => {
    return {
      [QuoteToken.FAVOR]: farm.favorApy,
      [QuoteToken.FINIX]: farm.apy,
    }
  }, [farm])

  const allEarnings = useMemo(() => {
    const result: {
      symbol: QuoteToken
      earnings: number
      apy: BigNumber
    }[] = [];
    if (farm.bundleRewards) {
      farm.bundleRewards.forEach((bundle, bundleId) => {
        const pendingReward = pendingRewards.find((pr) => pr.bundleId === bundleId) || {}
        result.push({
          symbol: bundle.rewardTokenInfo.name,
          earnings: (getBalanceNumber(pendingReward.reward) || 0),
          apy: apyList[bundle.rewardTokenInfo.name]
        })
      })
    }
    result.push({
      symbol: QuoteToken.FINIX,
      earnings: getBalanceNumber(earnings),
      apy: apyList[QuoteToken.FINIX],
    })
    return result
  }, [earnings, farm, pendingRewards, apyList])


  /**
   * Card Ribbon
   */
  const ribbonProps = useMemo(() => {
    if (typeof farm.tag === 'string') {
      return {
        ribbon: <CardRibbon variantColor={TAG_COLORS[farm.tag] || ColorStyles.RED} text={farm.tag} upperCase />,
      }
    }
    return null
  }, [farm.tag])

  /**
   * CardHeading
   */
  const renderCardHeading = useMemo(
    () => (
      <CardHeading
        tokenApyList={allEarnings}
        size="small"
        componentType={componentType}
        addLiquidityUrl={addLiquidityUrl}
      />
    ),
    [farm, lpTokenName, addLiquidityUrl, componentType],
  )
  /**
   * IconButton
   */
  const renderIconButton = useMemo(
    () => (
      <IconButton onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
        {isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
      </IconButton>
    ),
    [isOpenAccordion],
  )
  /**
   * TotalLiquidity Section
   */
  const renderTotalLiquiditySection = useMemo(
    () => <TotalLiquiditySection title={t('Total Liquidity')} totalLiquidity={totalLiquidity} />,
    [t, totalLiquidity],
  )
  /**
   * Earnings Section
   */
  const renderEarningsSection = useMemo(
    () => <EarningsSection allEarnings={allEarnings} isMobile={isMobile} />,
    [allEarnings, isMobile],
  )
  /**
   * StakeAction Section
   */
  const hasAccount = useMemo(() => !!account, [account])
  const hasUserData = useMemo(() => !!farm.userData, [farm.userData])
  const hasAllowance = useMemo(() => allowance && allowance.isGreaterThan(0), [allowance])
  const dataForNextState = useMemo(() => {
    return {
      farm,
      lpTokenName,
      myLiquidityPrice: myLiquidity,
      addLiquidityUrl,
    }
  }, [farm, lpTokenName, myLiquidity, addLiquidityUrl])

  console.log(getBalanceNumber(myLiquidity))
  
  const renderStakeAction = useMemo(
    () => (
      (type?: string) => 
      <FarmContext.Consumer>
        {({ goDeposit, goWithdraw }) => (
          <StakeAction
            componentType={type || componentType}
            hasAccount={hasAccount}
            hasUserData={hasUserData}
            hasAllowance={hasAllowance}

            isEnableRemoveStake={stakedBalance.eq(new BigNumber(0))}
            isEnableAddStake={isEnableAddStake}
            onApprove={onApprove}
            stakedBalance={myLiquidity}
            stakedBalancePrice={myLiquidity.toNumber()}
            stakedBalanceUnit="LP"

            onPresentDeposit={() => goDeposit(dataForNextState)}
            onPresentWithdraw={() => goWithdraw(dataForNextState)}
          />
        )}
      </FarmContext.Consumer>
    ),
    [componentType, hasAccount, hasUserData, hasAllowance, stakedBalance, myLiquidity, lpContract, dataForNextState, onApprove],
  )
  /**
   * HarvestAction Section
   */
  const renderHarvestAction = useMemo(
    () => <HarvestActionAirDrop allEarnings={allEarnings} isEnableHarvest={allEarnings.reduce((sum, { earnings }) => sum + earnings, 0) === 0} onReward={onReward} componentType={componentType} tokenName={lpTokenName} />,
    [earnings, componentType, lpTokenName, allEarnings, onReward],
  )
  /**
   * Link Section
   */
  const renderLinkSection = useMemo(() => <LinkListSection contractAddress={lpAddresses} />, [lpAddresses])

  if (isInMyInvestment) {
    return (
      <Wrap paddingLg>
        <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap={isMobile ? '16px' : '2rem'}>
          <Flex alignItems="center">{renderCardHeading}</Flex>
          <Box>{renderStakeAction()}</Box>
          <Box>{renderHarvestAction}</Box>
        </Grid>
      </Wrap>
    )
  }

  return (
    <>
      <CardWrap {...ribbonProps}>
        {isMobile ? (
          <>
            <Wrap paddingLg={false}>
              <Flex justifyContent="space-between">
                {renderCardHeading}
                {renderIconButton}
              </Flex>
              {renderEarningsSection}
            </Wrap>
            {isOpenAccordion && (
              <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_20" pt="S_24" pb="S_28">
                {renderHarvestAction}
                <Box py="S_24">{renderStakeAction('accordian')}</Box>
                <Divider />
                <Box pt="S_24">{renderTotalLiquiditySection}</Box>
                <Box pt="S_28">{renderLinkSection}</Box>
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
                <Box className="total-liquidity-section">{renderTotalLiquiditySection}</Box>
                <Box className="my-balance-section">{renderStakeAction()}</Box>
                <Box className="earnings-section">{renderEarningsSection}</Box>
                {renderIconButton}
              </Flex>
            </Wrap>
            {isOpenAccordion && (
              <Box backgroundColor={ColorStyles.LIGHTGREY_20} px="S_32" py="S_24">
                <Flex justifyContent="space-between">
                  <Box className="link-section">{renderLinkSection}</Box>
                  <Box className="harvest-action-section">{renderHarvestAction}</Box>
                  <Box className="stake-action-section">{renderStakeAction('accordian')}</Box>
                </Flex>
              </Box>
            )}
          </>
        )}
      </CardWrap>
    </>
  )
}

export default FarmCard

const CardWrap = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.S_16}px;
  ${({ theme }) => theme.mediaQueries.xl} {
    .card-heading {
      width: auto;
      min-width: 236px;
    }
    .total-liquidity-section {
      width: 112px;
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
