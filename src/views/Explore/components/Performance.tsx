import React from 'react'
import numeral from 'numeral'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useMatchBreakpoints } from 'definixswap-uikit'

import { Rebalance } from '../../../state/types'

import SelectChart, { TypeChartName } from './SelectChart'
import FullChart from './FullChart'
import SelectTime from './SelectTime'
import TwoLineFormat from './TwoLineFormat'

interface PerformanceType {
  rebalance: Rebalance | any
  isLoading: boolean
  returnPercent: number
  graphData: any
  timeframe: string
  setTimeframe: (timeframe: string) => void
  maxDrawDown: number
  chartName: TypeChartName
  setChartName: (chartName: TypeChartName) => void
  sharpRatio: number
}

const Performance: React.FC<PerformanceType> = ({
  rebalance,
  isLoading,
  returnPercent,
  graphData,
  timeframe,
  setTimeframe,
  chartName,
  maxDrawDown,
  setChartName,
  sharpRatio,
}) => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl

  return (
    <>
      <div className="pa-4 pt-5">
        <div className="flex flex-wrap align-center justify-space-between mb-3">
          <div className="flex flex-wrap align-center justify-space-between mb-3">
            <div>
              <SelectTime timeframe={timeframe} setTimeframe={setTimeframe} />
            </div>
            <div style={{ marginLeft: isMobile ? '0px' : '20px', marginTop: isMobile ? '10px' : '0px' }}>
              <SelectChart chartName={chartName} setChartName={setChartName} />
            </div>
          </div>
          <div className={`flex ${isMobile ? 'mt-3 justify-end' : ''}`}>
            {false && (
              <TwoLineFormat
                title="24H Performance"
                value={`$${numeral(get(rebalance, 'twentyHperformance', 0)).format('0,0.[00]')}`}
                valueClass={(() => {
                  if (get(rebalance, 'twentyHperformance', 0) < 0) return 'failure'
                  if (get(rebalance, 'twentyHperformance', 0) > 0) return 'success'
                  return ''
                })()}
                className="mr-6"
              />
            )}
          </div>
        </div>

        <FullChart
          fundName={rebalance.title}
          isLoading={isLoading}
          graphData={graphData}
          tokens={[...rebalance.ratio.filter((rt) => rt.value)]}
        />
      </div>

      <div className="flex bd-t">
        <TwoLineFormat
          className="px-4 py-3 col-4 bd-r"
          title={t('Sharpe Ratio')}
          value={`${numeral(sharpRatio).format('0,0.00')}`}
          hint="The average return ratio compares to the risk-taking activities earned per unit rate of the total risk."
        />
        <TwoLineFormat
          className="px-4 py-3 col-4 bd-r"
          title={t('Max Drawdown')}
          value={`${Math.abs(numeral(maxDrawDown).format('0,0.00'))}%`}
          hint="The differentiation between the historical peak and low point through the portfolio."
        />
        <TwoLineFormat
          className="px-4 py-3 col-4"
          title={t('Return')}
          value={`${numeral(returnPercent || 0).format('0,0.[00]')}%`}
          hint="Estimated return on investment measures approximately over a period of time."
        />
      </div>
    </>
  )
}

export default Performance
