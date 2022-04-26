import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
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
import CardHeading from './CardHeading'
import { TotalLiquiditySection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import LinkListSection from './LinkListSection'
import { FarmCardProps } from './types'
import FarmContext from '../../FarmContext'
import { getBalanceNumber } from 'utils/formatBalance'
import { TAG_COLORS } from 'config/constants/farms'
import { QuoteToken } from 'config/constants/types'


const FarmCard: React.FC<FarmCardProps> = ({ componentType = 'farm', farm, myBalancesInWallet, klaytn, account }) => {
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

  const allEarnings = useMemo(() => {
    const result: {
      token: QuoteToken
      earnings: number
    }[] = [];
    if (farm.bundleRewards) {
      farm.bundleRewards.forEach((bundle, bundleId) => {
        const pendingReward = pendingRewards.find((pr) => pr.bundleId === bundleId) || {}
        result.push({
          token: bundle.rewardTokenInfo.name,
          earnings: (getBalanceNumber(pendingReward.reward) || 0)
        })
      })
    }
    result.push({
      token: QuoteToken.FINIX,
      earnings: getBalanceNumber(earnings),
    })
    return result
  }, [earnings, farm.bundleRewards, pendingRewards])

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
        farm={farm}
        lpLabel={lpTokenName}
        size="small"
        addLiquidityUrl={addLiquidityUrl}
        componentType={componentType}
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
   * MyBalance Section
   */
  const renderMyBalanceSection = useMemo(
    () => <MyBalanceSection title={t('Balance')} myBalances={myBalancesInWallet} />,
    [t, myBalancesInWallet],
  )
  /**
   * Earnings Section
   */
  const renderEarningsSection = useMemo(
    () => <EarningsSection allEarnings={allEarnings} />,
    [allEarnings],
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
            myLiquidity={stakedBalance}
            myLiquidityPrice={myLiquidity}
            lpContract={lpContract}
            onPresentDeposit={() => goDeposit(dataForNextState)}
            onPresentWithdraw={() => goWithdraw(dataForNextState)}
          />
        )}
      </FarmContext.Consumer>
    ),
    [componentType, hasAccount, hasUserData, hasAllowance, stakedBalance, myLiquidity, lpContract, dataForNextState],
  )
  /**
   * HarvestAction Section
   */
  const renderHarvestAction = useMemo(
    () => <HarvestActionAirDrop allEarnings={allEarnings} componentType={componentType} pid={pid} lpSymbol={lpTokenName} />,
    [earnings, pid, componentType, lpTokenName, allEarnings],
  )
  /**
   * Link Section
   */
  const renderLinkSection = useMemo(() => <LinkListSection lpAddresses={lpAddresses} />, [lpAddresses])

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
                <Box py="S_24">{renderStakeAction('farm-accordian')}</Box>
                <Divider />
                <Box pt="S_24">{renderTotalLiquiditySection}</Box>
                <Box pt="S_16">{renderMyBalanceSection}</Box>
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
                  <Box className="stake-action-section">{renderStakeAction('farm-accordian')}</Box>
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
      width: 236px;
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
