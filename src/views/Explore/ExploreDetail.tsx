import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Card, ArrowBackIcon, Button, Text } from 'uikit-dev'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import CardHeading from './components/CardHeading'
import FullAssetRatio from './components/FullAssetRatio'
import FullChart from './components/FullChart'
import FundDetail from './components/FundDetail'
import SelectTime from './components/SelectTime'
import TradeStrategy from './components/TradeStrategy'
import Transaction from './components/Transaction'
import TwoLineFormat from './components/TwoLineFormat'
import WithDrawalFees from './WithdrawalFees'

const MaxWidth = styled.div`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const ExploreDetail: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanel isShowRightPanel={false}>
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
                  <CardHeading />
                  <TwoLineFormat title="Share price" value="$1,928.03" percent="+0.2%" large />
                </div>

                <div className="flex pl-8">
                  <TwoLineFormat className="col-3" title="Total asset value" value="$2,038,553.12" />
                  <TwoLineFormat className="col-3" title="24H Performance" value="$4,300.76" />
                  <TwoLineFormat className="col-3" title="Investors" value="123" />
                </div>
              </div>

              <div className="pa-4">
                <div className="flex align-center justify-space-between mb-3">
                  <SelectTime />
                  <div className="flex">
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

              <div className="flex justify-space-between pa-4 bd-t">
                <TwoLineFormat
                  title="Current investment"
                  subTitle="1.24 Shares"
                  value="$1,000.23"
                  percent="+0.2%"
                  days="1 D"
                  large
                />

                <div className="col-6 flex">
                  <Button fullWidth radii="small" className="mr-3" variant="success">
                    INVEST
                  </Button>
                  <Button fullWidth radii="small" className="flex flex-column">
                    WITHDRAW
                    <Text fontSize="12px" color="white">
                      0.00%
                    </Text>
                  </Button>
                </div>
              </div>
            </Card>

            <FullAssetRatio className="mb-4" />
            <TradeStrategy className="mb-4" />
            <WithDrawalFees className="mb-4" />
            <FundDetail className="mb-4" />
            <Transaction className="mb-4" />
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout>
    </>
  )
}

export default ExploreDetail
