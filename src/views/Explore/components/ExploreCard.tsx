import React, { useEffect, useState, useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import _ from 'lodash'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Link } from 'react-router-dom'
import { getAddress } from 'utils/addressHelpers'
import styled from 'styled-components'
import useConverter from 'hooks/useConverter'
import {
  Box,
  Button,
  Card,
  CardRibbon,
  Flex,
  useMatchBreakpoints,
  Grid,
  ButtonVariants,
  Text,
  ColorStyles,
  Divider,
  VDivider,
} from 'definixswap-uikit'
import AssetRatio from './AssetRatio'
import CardHeading, { CardTitle, CardImage } from './CardHeading'
import MiniChart from './MiniChart'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'
import { useRebalanceBalances, useBalances } from '../../../state/hooks'
import YieldAPR from './YieldAPR'
import SharePrice from './SharePrice'
import TotalAssetValue from './TotalAssetValue'

interface ExploreCardType {
  componentType?: string
  isHorizontal: boolean
  rebalance: Rebalance | any
  balance: BigNumber
  onClickViewDetail: () => void
}

const HorizontalStyle = styled(Card)`
  width: 100%;
`

const HorizontalMobileStyle = styled(Card)`
  .accordion-content {
    &.hide {
      display: none;
    }

    &.show {
      display: block;
    }
  }
`

const BtnViewDetail: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <Button
      minWidth="auto"
      scale="lg"
      variant="lightbrown"
      as={Link}
      to="/rebalancing/detail"
      onClick={onClick}
      className="w-100"
    >
      {t('View Details')}
    </Button>
  )
}

const ExploreCard: React.FC<ExploreCardType> = ({
  componentType = 'rebalance',
  balance,
  isHorizontal = true,
  rebalance = {},
  onClickViewDetail,
}) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = !isXxl
  const isInMyInvestment = useMemo(() => componentType === 'myInvestment', [componentType])
  const { ratio } = rebalance
  const { convertToRebalanceAPRFormat } = useConverter()

  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  const api = process.env.REACT_APP_DEFINIX_TOTAL_TXN_AMOUNT_API

  const [diffAmount, setDiffAmount] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const sharedprice = +(currentBalanceNumber * rebalance.sharedPrice)

  const allCurrentTokens = _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])

  const apr = useMemo(() => {
    return convertToRebalanceAPRFormat({
      finixRewardPerYear: _.get(rebalance, 'finixRewardPerYear', new BigNumber(0)),
      totalAssetValue: _.get(rebalance, 'totalAssetValue', new BigNumber(0)),
    })
  }, [convertToRebalanceAPRFormat, rebalance])

  const combinedAmount = useCallback(async () => {
    if (account) {
      const rebalanceAddress = getAddress(_.get(rebalance, 'address'))

      const myInvestTxnLocalStorage = JSON.parse(
        localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
      )

      const myInvestTxns = myInvestTxnLocalStorage[rebalanceAddress] ? myInvestTxnLocalStorage[rebalanceAddress] : []
      const resTotalTxn = await axios.get(`${api}/total_txn_amount?pool=${rebalanceAddress}&address=${account}`)

      const latestTxns = _.get(resTotalTxn.data, 'latest_txn')
      const totalUsds = _.get(resTotalTxn.data, 'total_usd_amount')
      const totalLps = _.get(resTotalTxn.data, 'total_lp_amount')

      const indexTx = _.findIndex(myInvestTxns, (investTxs) => investTxs === latestTxns)
      const transactionsSlice = myInvestTxns.slice(indexTx + 1)
      myInvestTxnLocalStorage[rebalanceAddress] = transactionsSlice
      localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxnLocalStorage))

      const txHash = {
        txns: transactionsSlice,
      }
      let lastTotalAmt = 0
      let lastTotalLp = 0
      if (transactionsSlice.length > 0) {
        const datas = (await axios.post(`${api}/txns_usd_amount`, txHash)).data
        lastTotalAmt = _.get(datas, 'total_usd_amount')
        lastTotalLp = _.get(datas, 'total_lp_amount')
      }

      const totalUsd = totalUsds
      const totalLpAmount = totalLps + lastTotalLp

      if (sharedprice > 0 && totalUsd > 0 && totalLpAmount > 0) {
        const totalUsdAmount = lastTotalAmt + totalUsd
        const diff = sharedprice - totalUsdAmount
        setDiffAmount(diff)
        const diffNewAmount = ((sharedprice - totalUsdAmount) / totalUsdAmount) * 100
        setPercentage(diffNewAmount)
      }
    }
  }, [sharedprice, rebalance, account, api])

  const renderSash = () => {
    if (rebalance.rebalace?.toUpperCase() === 'NEW') {
      return <CardRibbon text={rebalance.rebalace} />
    }

    return null
  }

  const renderTotalAssetValue = useCallback(() => {
    return (
      <Flex width="60%">
        <TotalAssetValue value={rebalance?.totalAssetValue} />
      </Flex>
    )
  }, [rebalance])

  const renderSharePrice = useCallback(() => {
    return (
      <SharePrice
        price={rebalance.sharedPrice}
        diff={rebalance.sharedPricePercentDiff}
        titleMarginBottom={isInMyInvestment ? 4 : null}
        small
      />
    )
  }, [isInMyInvestment, rebalance.sharedPrice, rebalance.sharedPricePercentDiff])

  const renderCurrentInvestment = useCallback(() => {
    return (
      <TwoLineFormat
        title={t('Current Investment')}
        titleMarginBottom={isInMyInvestment ? 4 : null}
        value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
        currentInvestPercentDiff={`(${
          percentage > 0 ? `+${numeral(percentage).format('0,0.[00]')}` : `${numeral(percentage).format('0,0.[00]')}`
        }%)`}
        diffAmounts={`${
          percentage > 0 ? `+${numeral(diffAmount).format('0,0.[000]')}` : `${numeral(diffAmount).format('0,0.[000]')}`
        }`}
        percentClass={(() => {
          if (percentage < 0) return 'failure'
          if (percentage > 0) return 'success'
          return ''
        })()}
      />
    )
  }, [t, rebalance, balance, percentage, diffAmount, isInMyInvestment])

  const renderViewDetailButton = useCallback(() => {
    return (
      <Box className="mt-6">
        <BtnViewDetail onClick={onClickViewDetail} />
      </Box>
    )
  }, [onClickViewDetail])

  const renderYieldAPR = useCallback(() => {
    return (
      <Flex width="40%">
        <YieldAPR
          finixRewardPerYear={rebalance?.finixRewardPerYear}
          totalAssetValue={rebalance?.totalAssetValue}
          small
        />
      </Flex>
    )
  }, [rebalance?.finixRewardPerYear, rebalance?.totalAssetValue])

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  const BottomInMyInvestment = styled(Flex)`
    flex-direction: row;
    justify-content: space-between;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: column;
      width: 100%;
    }
  `

  const HarvestButtonInMyInvestment = styled(Flex)`
    justify-content: center;
    width: 100px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: column;
      width: 100%;
    }
  `

  if (isInMyInvestment) {
    return (
      <>
        <Box p={isMobile ? 'S_20' : 'S_32'}>
          <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap="2rem">
            <Flex alignItems="center">
              <Box width={70} mr="S_16">
                <CardImage isMediumSize={false} imageUrl={rebalance.icon[0]} title={rebalance.title} />
              </Box>
              <Box>
                <CardTitle title={rebalance.title} textStyle="R_18M" />
                <Flex alignItems="end">
                  <Text textStyle="R_14M" color={ColorStyles.ORANGE} style={{ paddingBottom: '2px' }}>
                    APR
                  </Text>
                  <Text textStyle="R_18B" color={ColorStyles.ORANGE} style={{ marginLeft: '4px' }}>
                    {`${apr}%`}
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Flex alignItems="center">{renderSharePrice()}</Flex>
            <BottomInMyInvestment>
              {renderCurrentInvestment()}
              <HarvestButtonInMyInvestment mt={isMobile ? 'S_24' : ''}>
                <Button variant={ButtonVariants.BROWN} width="100%" as={Link} to="/rebalancing/detail">
                  {t('Detail')}
                </Button>
              </HarvestButtonInMyInvestment>
            </BottomInMyInvestment>
          </Grid>
        </Box>
      </>
    )
  }

  if (isMobile) {
    return (
      <HorizontalMobileStyle mb="S_16" ribbon={renderSash()}>
        <CardHeading p="S_20" pb="S_28" isHorizontal rebalance={rebalance} />

        <div>
          <Flex flexWrap="wrap" px="S_20" pb="S_20" justifyContent="space-between">
            {renderTotalAssetValue()}
            {renderYieldAPR()}
          </Flex>
          <Box px="S_20" pb="S_20">
            {renderSharePrice()}
          </Box>
          <Divider />
          <Box p="S_20">
            {renderCurrentInvestment()}
            {renderViewDetailButton()}
          </Box>
        </div>
      </HorizontalMobileStyle>
    )
  }

  return (
    <HorizontalStyle mb="S_16" ribbon={renderSash()}>
      <CardHeading p="S_32" rebalance={rebalance} />
      <Divider mx="S_32" />
      <Flex py="S_32">
        <Flex justifyContent="space-between" flexDirection="column" style={{ width: '45.9%' }} px="S_32">
          <Flex justifyContent="space-between" mb="S_20">
            {renderTotalAssetValue()}
            {renderYieldAPR()}
          </Flex>
          <AssetRatio isHorizontal={isHorizontal} ratio={ratio} />
        </Flex>
        <VDivider />
        <Flex flexGrow={1}>
          <Flex flexDirection="column" width="50%" justifyContent="space-between" px="S_32">
            {renderSharePrice()}
            <MiniChart
              color={rebalance.sharedPricePercentDiff >= 0 ? '#02a1a1' : '#ff5532'}
              tokens={allCurrentTokens}
              rebalanceAddress={getAddress(rebalance.address)}
              height={60}
            />
          </Flex>
          <VDivider />
          <Flex flexDirection="column" width="50%" justifyContent="space-between" px="S_32">
            {renderCurrentInvestment()}
            {renderViewDetailButton()}
          </Flex>
        </Flex>
      </Flex>
    </HorizontalStyle>
  )
}

export default ExploreCard
