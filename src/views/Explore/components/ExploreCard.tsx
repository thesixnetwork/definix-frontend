import React, { useEffect, useState, useCallback } from 'react'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import axios from 'axios'
import { getAddress } from 'utils/addressHelpers'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, useMatchBreakpoints, Skeleton, Text } from 'uikit-dev'
import numeral from 'numeral'
import AssetRatio from './AssetRatio'
import CardHeading from './CardHeading'
import MiniChart from './MiniChart'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'
import { usePriceFinixUsd, useRebalanceBalances, useBalances } from '../../../state/hooks'
import RebalanceSash from './RebalanceSash'

interface ExploreCardType {
  isHorizontal: boolean
  rebalance: Rebalance | any
  balance: BigNumber
  onClickViewDetail: () => void
}

const CardStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  flex-direction: column;
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

const ExploreCard: React.FC<ExploreCardType> = ({
  balance,
  isHorizontal = false,
  rebalance = {},
  onClickViewDetail,
}) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { ratio } = rebalance
  const finixPrice = usePriceFinixUsd()
  const themes = useTheme()

  useEffect(() => {
    return () => {
      setIsOpenAccordion(false)
    }
  }, [])

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

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  const renderSash = () => {
    if (isMobile && isHorizontal && rebalance.rebalace === 'New') {
      return <RebalanceSash type="listCard" />
    }

    if (isHorizontal && rebalance.rebalace === 'New') {
      return <RebalanceSash type="list" />
    }

    if (!isHorizontal && rebalance.rebalace === 'New') {
      return <RebalanceSash type="card" />
    }

    return null
  }

  const allCurrentTokens = _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])
  const value = (
    <Skeleton
      animation="pulse"
      variant="rect"
      height="29px"
      width="60%"
      // style={{ background: themes.theme.colors.primary, borderRadius: themes.theme.radii.card }}
    />
  )
  if (isHorizontal) {
    if (isMobile) {
      return (
        <HorizontalMobileStyle className="mb-3">
          {renderSash()}
          <CardHeading
            className="pa-4"
            showAccordion
            isHorizontal
            isOpenAccordion={isOpenAccordion}
            setIsOpenAccordion={setIsOpenAccordion}
            rebalance={rebalance}
          />

          <div style={{ display: isOpenAccordion ? 'block' : 'none' }}>
            <div className="flex justify-space-between pa-4 pt-0">
              {/* <TwoLineFormat
                title="Total asset value"
                value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.00')}`}
              /> */}
              <div>
                <Text fontSize="14px" color="textSubtle">
                  Total asset value
                </Text>
                <Skeleton
                  animation="pulse"
                  variant="rect"
                  height="29px"
                  width="80%"
                  style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
                />
              </div>
              {/* <TwoLineFormat
                title="Share price"
                subTitle="(Since inception)"
                subTitleFontSize="11px"
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
              /> */}
              <div>
                <div className="flex align-baseline" style={{ lineHeight: '0' }}>
                  <Text fontSize="14px" color="textSubtle">
                    Share price
                  </Text>
                  <Text fontSize="11px" className="ml-1">
                    (Since inception)
                  </Text>
                </div>
                <div className="flex align-baseline">
                  <Skeleton
                    animation="pulse"
                    variant="rect"
                    height="29px"
                    width="40%"
                    style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
                  />
                  <Skeleton
                    animation="pulse"
                    variant="rect"
                    height="29px"
                    width="40%"
                    className="ml-2"
                    style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
                  />
                </div>
              </div>
            </div>

            <div className="pa-4 pt-0">
              <Skeleton
                animation="pulse"
                variant="rect"
                height="60px"
                width="100%"
                style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
              />
            </div>
            {/* <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} /> */}

            <div className="pa-4">
              <div className="flex align-end justify-space-between mb-3">
                {/* <TwoLineFormat
                  title="Yield APR"
                  value={`${numeral(
                    finixPrice
                      .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                      .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                      .times(100)
                      .toFixed(2),
                  ).format('0,0.[00]')}%`}
                  hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
                /> */}
                <div>
                  <TwoLineFormat
                    title="Yield APR"
                    value=""
                    hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
                  />
                  <Skeleton
                    animation="pulse"
                    variant="rect"
                    height="29px"
                    width="80%"
                    style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
                  />
                </div>
                <TwoLineFormat
                  title="Current investment"
                  value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
                  currentInvestPercentDiff={`(${
                    percentage > 0
                      ? `+${numeral(percentage).format('0,0.[00]')}`
                      : `${numeral(percentage).format('0,0.[00]')}`
                  }%)`}
                  diffAmounts={`${
                    percentage > 0
                      ? `+${numeral(diffAmount).format('0,0.[000]')}`
                      : `${numeral(diffAmount).format('0,0.[000]')}`
                  }`}
                  percentClass={(() => {
                    if (percentage < 0) return 'failure'
                    if (percentage > 0) return 'success'
                    return ''
                  })()}
                />
              </div>
              <Button fullWidth radii="small" as={Link} to="/rebalancing/detail" onClick={onClickViewDetail}>
                View Details
              </Button>
            </div>

            <AssetRatio ratio={ratio} isHorizontal={false} className="px-4 py-3 bd-t" />
          </div>
        </HorizontalMobileStyle>
      )
    }

    return (
      <HorizontalStyle className="flex align-strench mb-5 pa-5">
        {renderSash()}
        <CardHeading isHorizontal={isHorizontal} rebalance={rebalance} className="col-3 pr-4 bd-r" />

        <div className="col-9 flex">
          <div className="col-6 flex flex-column justify-space-between px-4 bd-r">
            <div className="flex justify-space-between mb-2">
              {/* <TwoLineFormat
                className="col-5"
                title="Total asset value"
                value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
              /> */}
              <div className="col-5">
                <Text fontSize="14px" color="textSubtle">
                  Total asset value
                </Text>
                <Skeleton
                  animation="pulse"
                  variant="rect"
                  height="29px"
                  width="80%"
                  style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
                />
              </div>
              {/* <TwoLineFormat
                className="col-5"
                title="Yield APR"
                value={`${numeral(
                  finixPrice
                    .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                    .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                    .times(100)
                    .toFixed(2),
                ).format('0,0.[00]')}%`}
                hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
              /> */}
              <div className="col-5">
                <TwoLineFormat
                  title="Yield APR"
                  value=""
                  hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
                />
                <Skeleton
                  animation="pulse"
                  variant="rect"
                  height="29px"
                  width="60%"
                  style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
                />
              </div>
            </div>
            <AssetRatio isHorizontal={isHorizontal} ratio={ratio} />
          </div>

          <div className="col-3 pl-4 pr-2 flex flex-column justify-space-between">
            <div className="flex align-baseline" style={{ lineHeight: '0' }}>
              <Text fontSize="14px" color="textSubtle">
                Share price
              </Text>
              <Text fontSize="11px" className="ml-1">
                (Since inception)
              </Text>
            </div>
            <div className="flex align-baseline">
              <Skeleton
                animation="pulse"
                variant="rect"
                height="29px"
                width="40%"
                style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
              />
              <Skeleton
                animation="pulse"
                variant="rect"
                height="29px"
                width="40%"
                className="ml-2"
                style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
              />
            </div>
            <Skeleton
              animation="pulse"
              variant="rect"
              height="60px"
              width="100%"
              className="mt-2"
              style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
            />
            {/* <TwoLineFormat
              title="Share price"
              subTitle="(Since inception)"
              subTitleFontSize="11px"
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
            <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} height={60} /> */}
          </div>

          <div className="col-3 pl-2 flex flex-column justify-space-between">
            <TwoLineFormat
              title="Current investment"
              value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
              currentInvestPercentDiff={`(${
                percentage > 0
                  ? `+${numeral(percentage).format('0,0.[00]')}`
                  : `${numeral(percentage).format('0,0.[00]')}`
              }%)`}
              diffAmounts={`${
                percentage > 0
                  ? `+${numeral(diffAmount).format('0,0.[000]')}`
                  : `${numeral(diffAmount).format('0,0.[000]')}`
              }`}
              percentClass={(() => {
                if (percentage < 0) return 'failure'
                if (percentage > 0) return 'success'
                return ''
              })()}
            />
            <Button fullWidth radii="small" as={Link} to="/rebalancing/detail" onClick={onClickViewDetail}>
              View Details
            </Button>
          </div>
        </div>
      </HorizontalStyle>
    )
  }

  return (
    <VerticalStyle className="mb-7">
      {renderSash()}
      <CardHeading className="pa-4" isSkew isHorizontal={isHorizontal} rebalance={rebalance} />

      <div className="flex justify-space-between pa-4 pt-0">
        {/* <TwoLineFormat
          title="Total asset value"
          value={`$${numeral(_.get(rebalance, 'totalAssetValue', 0)).format('0,0.00')}`}
        /> */}
        <div>
          <Text fontSize="14px" color="textSubtle">
            Total asset value
          </Text>
          <Skeleton
            animation="pulse"
            variant="rect"
            height="29px"
            width="80%"
            style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
          />
        </div>
        {/* <TwoLineFormat
          title="Share price"
          subTitle="(Since inception)"
          subTitleFontSize="11px"
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
        /> */}
        <div>
          <div className="flex align-baseline" style={{ lineHeight: '0' }}>
            <Text fontSize="14px" color="textSubtle">
              Share price
            </Text>
            <Text fontSize="11px" className="ml-1">
              (Since inception)
            </Text>
          </div>
          <div className="flex align-baseline">
            <Skeleton
              animation="pulse"
              variant="rect"
              height="29px"
              width="40%"
              style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
            />
            <Skeleton
              animation="pulse"
              variant="rect"
              height="29px"
              width="40%"
              className="ml-2"
              style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
            />
          </div>
        </div>
      </div>

      {/* <MiniChart tokens={allCurrentTokens} rebalanceAddress={getAddress(rebalance.address)} /> */}
      <div className="px-4">
        <Skeleton
          animation="pulse"
          variant="rect"
          height="60px"
          width="100%"
          className="mt-2"
          style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
        />
      </div>

      <div className="pa-4">
        <div className="flex align-end justify-space-between mb-3">
          {/* <TwoLineFormat
            title="Yield APR"
            value={`${numeral(
              finixPrice
                .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                .times(100)
                .toFixed(2),
            ).format('0,0.[00]')}%`}
            hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
          /> */}
          <div>
            <TwoLineFormat
              title="Yield APR"
              value=""
              hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
            />
            <Skeleton
              animation="pulse"
              variant="rect"
              height="29px"
              width="80%"
              style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
            />
          </div>
          {/* <div>
            <Text fontSize="14px" color="textSubtle">Yield APR</Text>
            <Skeleton
              animation="pulse"
              variant="rect"
              height="29px"
              width="80%"
              style={{ background: themes.theme.colors.grayBlue, borderRadius: themes.theme.radii.card }}
            />
          </div> */}
          <TwoLineFormat
            title="Current investment"
            value={`$${numeral(balance.times(_.get(rebalance, 'sharedPrice', 0))).format('0,0.[00]')}`}
            currentInvestPercentDiff={`(${
              percentage > 0
                ? `+${numeral(percentage).format('0,0.[00]')}`
                : `${numeral(percentage).format('0,0.[00]')}`
            }%)`}
            diffAmounts={`${
              percentage > 0
                ? `+${numeral(diffAmount).format('0,0.[000]')}`
                : `${numeral(diffAmount).format('0,0.[000]')}`
            }`}
            percentClass={(() => {
              if (percentage < 0) return 'failure'
              if (percentage > 0) return 'success'
              return ''
            })()}
          />
        </div>
        <Button fullWidth radii="small" as={Link} to="/rebalancing/detail" onClick={onClickViewDetail}>
          View Details
        </Button>
      </div>

      <AssetRatio isHorizontal={isHorizontal} ratio={ratio} className="px-4 py-3 bd-t" />
    </VerticalStyle>
  )
}

export default ExploreCard
