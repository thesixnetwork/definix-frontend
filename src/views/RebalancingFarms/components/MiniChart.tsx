import React, { memo, useEffect, useMemo, useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { compact, get } from 'lodash-es'
import { Line } from 'react-chartjs-2'
import Color from 'color'

import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import useGetRequest from 'hooks/useGetRequest'

const Box = styled.div`
  canvas {
    width: 100% !important;
  }
`

const FullDiv = styled.div<{ isDark?: boolean }>`
  background: ${(isDark) => (isDark ? 'rgba(33, 33, 33, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`

const RelativeDiv = styled.div`
  position: relative;
`

const LoadingData = () => (
  <div className="flex align-center justify-center" style={{ height: '100%' }}>
    <CircularProgress size={16} color="inherit" className="mr-2" />
  </div>
)

const modder = {
  '1D': 300000,
}

const formatter = {
  '1D': 'HH:mm',
}

const MiniChart = ({ rebalanceAddress, tokens, className = '', color, height = 100 }) => {
  const { isDark } = useTheme()
  const { data: fundGraphResp, request, cancel, loading } = useGetRequest()
  const [isDisplay, setIsDisplay] = useState(false)

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    layout: {
      padding: {
        left: -10,
        bottom: -10,
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
    },
  }

  const graphData = useMemo(() => {
    const fundGraphResult = fundGraphResp?.result || []
    const label = []
    const rebalanceData = {
      name: 'Rebalance',
      values: [],
    }
    const graphTokenData: Record<string, any> = {}
    const base: Record<string, any> = {}
    fundGraphResult.forEach((data) => {
      const timestampLabel = moment(data.timestamp * 1000 - ((data.timestamp * 1000) % modder['1D'])).format(
        formatter['1D'],
      )
      label.push(timestampLabel)
      const dataValues = get(data, 'values', [])
      let sumUsd = 0
      for (let i = 0; i <= (dataValues.length - 1) / 2; i++) {
        const currentIndex = i + 1
        const currentLoopToken = tokens[i]
        const currentLoopValue = new BigNumber(dataValues[currentIndex + (dataValues.length - 1) / 2] || '1').times(
          new BigNumber(dataValues[currentIndex]).div(new BigNumber(10).pow(get(currentLoopToken, 'decimals', 18))),
        )
        sumUsd += currentLoopValue.toNumber()
      }
      if (!base.rebalance) {
        base.rebalance = sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber()
      }
      rebalanceData.values.push(
        new BigNumber(sumUsd / new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber())
          .div(new BigNumber(base.rebalance as number))
          .times(100)
          .toNumber(),
      )
    })
    graphTokenData.rebalance = rebalanceData
    return { labels: label, graph: graphTokenData }
  }, [fundGraphResp, tokens])

  const data = useCallback(
    (canvas) => {
      const graphColor = color || '#30ADFF'
      const colorObj = Color(graphColor)

      const ctx = canvas.getContext('2d')

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, colorObj.mix(Color(isDark ? 'transparent' : 'white'), 0.7))
      gradient.addColorStop(1, isDark ? 'transparent' : 'white')

      return {
        labels: get(graphData, 'labels', []),
        datasets: Object.keys(get(graphData, 'graph', {})).map((key) => {
          const thisData = get(graphData, `graph.${key}`, {})
          const thisName = thisData.name || ''
          return {
            label: thisName,
            data: thisData.values || [],
            fill: true,
            borderColor: thisData.color,
            borderWidth: 2,
            tension: 0,
            ...(thisName === 'Rebalance'
              ? {
                  borderColor: graphColor,
                  backgroundColor: gradient,
                  pointBackgroundColor: 'transparent',
                  pointBorderColor: 'transparent',
                }
              : {}),
          }
        }),
      }
    },
    [color, graphData, height, isDark],
  )

  useEffect(() => {
    const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
    if (rebalanceAddress && compact(tokens.map((t) => t.decimals)).length > 0 && !isDisplay) {
      request(fundGraphAPI, {
        rebalance_address: rebalanceAddress,
        timeframe: '1D',
      })
    }
    return cancel
  }, [isDisplay, rebalanceAddress, tokens])

  useEffect(() => {
    if (fundGraphResp) {
      setIsDisplay(true)
    }
  }, [fundGraphResp, isDisplay])

  return (
    <RelativeDiv>
      {loading ? (
        <FullDiv isDark={isDark}>
          <LoadingData />
        </FullDiv>
      ) : (
        <Box className={className}>
          <Line data={data} options={options} height={height} />
        </Box>
      )}
    </RelativeDiv>
  )
}

export default memo(MiniChart)
