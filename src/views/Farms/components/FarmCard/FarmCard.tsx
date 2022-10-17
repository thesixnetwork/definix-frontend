import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { QuoteToken } from 'config/constants/types'
import { TAG_COLORS } from 'config/constants/farms'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, useMatchBreakpoints } from 'uikit-dev'
import Card from 'uikitV2/components/Card/Card'
import CardRibbon from 'uikitV2/components/Card/CardRibbon'
import { ColorStyles } from 'uikitV2/colors'
import IconButton from 'uikitV2/components/Button/IconButton'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Flex } from 'uikit-dev'
import { Box } from '@mui/material'
import FarmContext from '../../FarmContext'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import CardHeading from './CardHeading'
import DetailsSection from './DetailsSection'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'
import { FarmCardProps } from './types'
import EarningHarvest from './EarningHarvest'

const CardStyle = styled.div`
  background: ${props => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
`

const HorizontalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
`

const HorizontalMobileStyle = styled(CardStyle)`
  .accordion-content {
    &.hide {
      display: none;
    }

    &.show {
      display: block;
    }
  }
`

const CardWrap = styled(Card)`
  margin-bottom: 26px;
  @media screen and (min-width: 1280px) {
    .card-heading {
      width: 204px;
    }
    .total-staked-section {
      width: 144px;
    }
    .my-balance-section {
      margin: 0 24px;
      width: 232px;
    }
    .earnings-section {
      width: 200px;
    }
    .link-section {
      width: 166px;
    }
    .harvest-action-section {
      margin: 0 24px;
      width: 358px;
    }
    .stake-action-section {
      width: 276px;
    }
  }
`
const Wrap = styled(Box)<{ paddingLg: boolean }>`
  padding: ${({ paddingLg }) => (paddingLg ? '40' : '32')}px;
  @media screen and (min-width: 1280px) {
    padding: 32px;
  }
`

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  removed,
  sixPrice,
  finixPrice,
  bnbPrice,
  ethPrice,
  ethereum,
  account,
  isHorizontal = false,
}) => {
  const { onPresent } = useContext(FarmContext)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [sixPrice, bnbPrice, finixPrice, ethPrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('DEFINIX', '').replace(' LP', '')
  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, tokenBalance, stakedBalance } = useFarmUser(pid)

  const ratio = new BigNumber(stakedBalance).div(new BigNumber(farm.lpTotalSupply))
  const stakedTotalInQuoteToken = new BigNumber(farm.quoteTokenBlanceLP)
    .div(new BigNumber(10).pow(farm.quoteTokenDecimals))
    .times(ratio)
    .times(new BigNumber(2))
  const stakedBalanceValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(stakedTotalInQuoteToken)
    }
    return stakedTotalInQuoteToken
  }, [
    sixPrice,
    finixPrice,
    farm.lpTotalInQuoteToken,
    farm.quoteTokenSymbol,
    stakedTotalInQuoteToken,
    bnbPrice,
    ethPrice,
  ])

  const stakedBalanceValueFormated = stakedBalanceValue
    ? `$${Number(stakedBalanceValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const renderCardHeading = useCallback(
    (className?: string, inlineMultiplier?: boolean) => (
      <CardHeading
        farm={farm}
        lpLabel={lpLabel}
        removed={removed}
        addLiquidityUrl={addLiquidityUrl}
        finixPrice={finixPrice}
        isHorizontal={isHorizontal}
        className={className}
        inlineMultiplier={inlineMultiplier || false}
      />
    ),
    [addLiquidityUrl, farm, finixPrice, isHorizontal, lpLabel, removed],
  )

  const renderDepositModal = useCallback(() => {
    onPresent(
      <DepositModal
        max={tokenBalance}
        onConfirm={onStake}
        tokenName={lpLabel}
        addLiquidityUrl={addLiquidityUrl}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [addLiquidityUrl, lpLabel, onPresent, onStake, renderCardHeading, tokenBalance])

  const renderWithdrawModal = useCallback(() => {
    onPresent(
      <WithdrawModal
        max={stakedBalance}
        onConfirm={onUnstake}
        tokenName={lpLabel}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [lpLabel, onPresent, onUnstake, renderCardHeading, stakedBalance])

  const dataForNextState = useMemo(() => {
    return {
      farm,
      renderCardHeading,
    }
  }, [farm, renderCardHeading])

  const renderStakeAction = useMemo(
    () => (className?: string, type?: string) =>
      (
        <FarmContext.Consumer>
          {({ goDeposit, goWithdraw }) => (
            <StakeAction
              farm={farm}
              ethereum={ethereum}
              account={account}
              className={className}
              onPresentDeposit={() => goDeposit(dataForNextState)}
              onPresentWithdraw={() => goWithdraw(dataForNextState)}
            />
          )}
        </FarmContext.Consumer>
      ),
    [account, ethereum, farm, renderDepositModal, renderWithdrawModal],
  )

  const renderHarvestAction = useCallback(
    (className?: string) => <HarvestAction earnings={earnings} pid={pid} className={className} />,
    [earnings, pid],
  )

  // const renderHarvestActionAirDrop = useCallback(
  //   (className?: string, isHor?: boolean) => (
  //     <HarvestActionAirDrop earnings={earnings} pid={pid} className={className} isHorizontal={isHor} />
  //   ),
  //   [earnings, pid],
  // )

  const renderDetailsSection = useCallback(
    (className?: string, isHor?: boolean) => (
      <DetailsSection
        removed={removed}
        bscScanAddress={`https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
        totalValueFormated={totalValueFormated}
        stakedBalanceValueFormated={stakedBalanceValueFormated}
        lpLabel={lpLabel}
        addLiquidityUrl={addLiquidityUrl}
        isHorizontal={isHor}
        className={className}
      />
    ),
    [addLiquidityUrl, farm.lpAddresses, lpLabel, removed, totalValueFormated, stakedBalanceValueFormated],
  )

  const renderMyStake = useCallback(
    (className?: string, isHor?: boolean) => (
      <DetailsSection
        removed={removed}
        bscScanAddress={`https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
        customText="My Staked"
        totalValueFormated={stakedBalanceValueFormated}
        stakedBalanceValueFormated={stakedBalanceValueFormated}
        lpLabel={lpLabel}
        addLiquidityUrl={addLiquidityUrl}
        isHorizontal={isHor}
        className={className}
      />
    ),
    [addLiquidityUrl, farm.lpAddresses, lpLabel, removed, totalValueFormated, stakedBalanceValueFormated],
  )

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

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
   * IconButton
   */
  const renderIconButton = useMemo(
    () => (
      <IconButton onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
        {isOpenAccordion ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </IconButton>
    ),
    [isOpenAccordion],
  )

  /**
   * Earnings Section
   */
  const renderEarningsSection = useMemo(
    () => <div>None</div>, //<EarningsSection allEarnings={allEarnings} isMobile={isMobile} />,
    [earnings, isMobile],
  )

  const renderEarningHarvest = useCallback(
    (className?: string) => <EarningHarvest pid={pid} earnings={earnings} className={className} />,
    [earnings, pid],
  )
  return (
    <>
      <CardWrap {...ribbonProps}>
        {isMobile ? (
          <>
            <Wrap paddingLg={false}>
              <Flex justifyContent="space-between">
                {renderCardHeading('')}
                {renderIconButton}
              </Flex>
              {renderEarningHarvest('')}
            </Wrap>
            {isOpenAccordion && (
              <Box style={{ backgroundColor: 'rgba(224, 224, 224, 0.2)' }} className="px-4 py-5">
                {renderHarvestAction('')}
                <Box className="py-5">{renderStakeAction('accordian')}</Box>
                <div style={{ backgroundColor: 'rgba(224, 224, 224, 0.5)', height: 1 }} />
                <Box className="pt-5" style={{}}>
                  {renderDetailsSection('', true)}
                </Box>
              </Box>
            )}
          </>
        ) : (
          <>
            <Wrap paddingLg={false}>
              <Flex justifyContent="space-between">
                <Flex className="card-heading" alignItems="center">
                  {renderCardHeading('')}
                </Flex>
                <Box className="total-liquidity-section">{renderDetailsSection('', true)}</Box>
                <Box className="my-balance-section">{renderMyStake('', true)}</Box>
                <Box className="earnings-section">{renderEarningHarvest('')}</Box>
                {renderIconButton}
              </Flex>
            </Wrap>
            {isOpenAccordion && (
              <Box style={{ backgroundColor: 'rgba(224, 224, 224, 0.2)' }} className="px-5 py-4">
                <Flex justifyContent="space-between">
                  <Box className="link-section" />
                  {renderHarvestAction('flex align-center justify-space-between')}
                  <Box className="stake-action-section">{renderStakeAction('')}</Box>
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
