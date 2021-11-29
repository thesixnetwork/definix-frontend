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
  CardBody,
  CardRibbon,
  Flex,
  useMatchBreakpoints,
  Grid,
  ButtonVariants,
  Text,
  ColorStyles,
} from 'definixswap-uikit'
import AssetRatio from './AssetRatio'
import CardHeading, { CardTitle, CardImage } from './CardHeading'
import MiniChart from './MiniChart'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'
import { usePriceFinixUsd, useRebalanceBalances, useBalances } from '../../../state/hooks'

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
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
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
      totalAssetValue: _.get(rebalance, 'totalAssetValue', new BigNumber(0))
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
      <TwoLineFormat
        className="col-6"
        title={t('Total Asset Value')}
        value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.00')}`}
      />
    )
  }, [t, rebalance])

  const renderSharePrice = useCallback(() => {
    return (
      <TwoLineFormat
        title={t('Share Price(Since Inception)')}
        titleMarginBottom={isInMyInvestment ? 4 : 0}
        value={`$${numeral(_.get(rebalance, 'sharedPrice', 0)).format('0,0.00')}`}
        percent={`${
          rebalance.sharedPricePercentDiff >= 0
            ? `+${numeral(_.get(rebalance, 'sharedPricePercentDiff', 0)).format('0,0.[00]')}`
            : `${numeral(_.get(rebalance, 'sharedPricePercentDiff', 0)).format('0,0.[00]')}`
        }%`}
        percentClass={(() => {
          if (_.get(rebalance, 'sharedPricePercentDiff', 0) < 0) return 'failure'
          if (_.get(rebalance, 'sharedPricePercentDiff', 0) > 0) return 'success'
          return ''
        })()}
      />
    )
  }, [t, rebalance, isInMyInvestment])

  const renderCurrentInvestment = useCallback(() => {
    return (
      <TwoLineFormat
        title={t('Current Investment')}
        titleMarginBottom={isInMyInvestment ? 4 : 0}
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
      <TwoLineFormat
        className="col-6"
        title={t('Yield APR')}
        value={`${apr}%`}
        hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
      />
    )
  }, [t, apr])

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  if (isInMyInvestment) {
    return (
      <>
        <Box className="pa-s32">
          <Grid gridTemplateColumns={isMobile ? '1fr' : '3fr 2.5fr 4fr'} gridGap="2rem">
            <Flex alignItems="center">
              <Box width={70} className="mr-s16">
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
            <Flex justifyContent="space-between" alignItems="center">
              {renderCurrentInvestment()}
              <Flex flexDirection="column" justifyContent="center">
                <Button variant={ButtonVariants.BROWN} md minWidth="100px" as={Link} to="/rebalancing/detail">
                  Detail
                </Button>
              </Flex>
            </Flex>
          </Grid>
        </Box>
      </>
    )
  }

  if (isMobile) {
    return (
      <HorizontalMobileStyle className="mb-3" ribbon={renderSash()}>
        <CardHeading className="pa-4 pb-6" isHorizontal rebalance={rebalance} />

        <div>
          <Flex flexWrap="wrap" className="flex px-4 pb-5" justifyContent="space-between">
            {renderTotalAssetValue()}
            {renderYieldAPR()}
          </Flex>
          <Box px="S_20" pb="S_20">
            {renderSharePrice()}
          </Box>
          <Box p="S_20" pb="S_20" className="bd-t">
            {renderCurrentInvestment()}
            {renderViewDetailButton()}
          </Box>
        </div>
      </HorizontalMobileStyle>
    )
  }

  return (
    <HorizontalStyle className="mb-4" ribbon={renderSash()}>
      <CardBody>
        <CardHeading rebalance={rebalance} className="bd-b pb-5" />
        <div className="flex pt-5">
          <div className="flex flex-column justify-space-between px-0 bd-r" style={{ width: '45.7%' }}>
            <div className="flex justify-space-between mb-4">
              {renderTotalAssetValue()}
              {renderYieldAPR()}
            </div>
            <AssetRatio isHorizontal={isHorizontal} ratio={ratio} />
          </div>

          <div className="flex flex-grow">
            <div className="col-6 flex flex-column justify-space-between bd-r px-6">
              {renderSharePrice()}
              <MiniChart
                color={rebalance.sharedPricePercentDiff >= 0 ? '#02a1a1' : '#ff5532'}
                tokens={allCurrentTokens}
                rebalanceAddress={getAddress(rebalance.address)}
                height={60}
              />
            </div>

            <div className="col-6 flex flex-column justify-space-between pl-6">
              {renderCurrentInvestment()}
              {renderViewDetailButton()}
            </div>
          </div>
        </div>
      </CardBody>
    </HorizontalStyle>
  )
}

export default ExploreCard
