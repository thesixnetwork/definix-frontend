import React from 'react'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowBackIcon, Button, Card, Text, useMatchBreakpoints } from 'uikit-dev'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import numeral from 'numeral'
import CardHeading from './components/CardHeading'
import FullAssetRatio from './components/FullAssetRatio'
import FullChart from './components/FullChart'
import FundAction from './components/FundAction'
import FundDetail from './components/FundDetail'
import SelectTime from './components/SelectTime'
import TradeStrategy from './components/TradeStrategy'
import Transaction from './components/Transaction'
import TwoLineFormat from './components/TwoLineFormat'
import WithDrawalFees from './components/WithdrawalFees'
import { Rebalance } from '../../state/types'

const MaxWidth = styled.div`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const LeftPanelAbsolute = styled(LeftPanel)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
`

interface ExploreDetailType {
  rebalance: Rebalance | any
}

const ExploreDetail: React.FC<ExploreDetailType> = ({ rebalance }) => {
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg
  if (!rebalance) return <Redirect to="/explore" />
  const ratio = rebalance.ratio

  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            <Card className="mb-4">
              <div className="pa-4 pt-2 bd-b">
                <Button
                  variant="text"
                  as={Link}
                  to="/explore"
                  ml="-12px"
                  mb="8px"
                  padding="0 12px"
                  startIcon={<ArrowBackIcon />}
                >
                  <Text fontSize="14px" color="textSubtle">
                    Back
                  </Text>
                </Button>

                <div className="flex justify-space-between align-end mb-2">
                  <CardHeading rebalance={rebalance} />
                  {!isMobile && (
                    <TwoLineFormat
                      title="Share price"
                      value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
                      percent="+0.2%"
                      large
                    />
                  )}
                </div>

                <div className={`flex flex-wrap ${!isMobile ? 'pl-8' : ''}`}>
                  <TwoLineFormat
                    className={isMobile ? 'col-6 my-2' : 'col-3'}
                    title="Total asset value"
                    value={`$${numeral(rebalance.totalAssetValue).format('0,0.00')}`}
                  />
                  {isMobile && (
                    <TwoLineFormat
                      className={isMobile ? 'col-6 my-2' : 'col-3'}
                      title="Share price"
                      value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
                      percent="+0.2%"
                    />
                  )}
                  <TwoLineFormat className={isMobile ? 'col-6' : 'col-3'} title="24H Performance" value="$4,300.76" />
                  <TwoLineFormat
                    className={isMobile ? 'col-6' : 'col-3'}
                    title="Investors"
                    value={numeral(rebalance.activeUserCountNumber).format('0,0')}
                  />
                </div>
              </div>

              <div className="pa-4">
                <div className="flex flex-wrap align-center justify-space-between mb-3">
                  <SelectTime />
                  <div className={`flex ${isMobile ? 'mt-3 justify-end' : ''}`}>
                    <TwoLineFormat title="APY" value="00%" hint="xxx" className="mr-6" />
                    <TwoLineFormat title="Return" value="00%" hint="xxx" />
                  </div>
                </div>

                <FullChart />
              </div>

              <div className="flex bd-t">
                <TwoLineFormat className="px-4 py-3 col-4 bd-r" title="Risk-O-Meter" value="Medium" />
                <TwoLineFormat className="px-4 py-3 col-4 bd-r" title="Sharpe ratio" value="1.00" hint="xxx" />
                <TwoLineFormat className="px-4 py-3 col-4" title="Max Drawdown" value="10.00%" hint="xxx" />
              </div>
            </Card>

            <FullAssetRatio ratio={ratio} className="mb-4" />
            <TradeStrategy className="mb-4" />
            <WithDrawalFees className="mb-4" />
            <FundDetail className="mb-4" />
            <Transaction className="mb-4" />
            <FundAction />
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default ExploreDetail
