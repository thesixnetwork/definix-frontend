import React, { useState, useEffect, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import _ from 'lodash'
import { Line } from 'react-chartjs-2'
import Color from 'color'

import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'

const Box = styled.div`
  canvas {
    width: 100% !important;
  }
`

const FullDiv = styled.div`
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`

const FullDivDark = styled.div`
  background: rgba(33, 33, 33, 0.8);
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
  const [graphData, setGraphData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isDisplay, setIsDisplay] = useState(false)
  const fetchGraphData = useCallback(async () => {
    if (rebalanceAddress && _.compact(tokens.map((t) => t.decimals)).length > 0 && isDisplay === false) {
      setIsLoading(true)
      const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
      try {
        const fundGraphResp = await axios.get(`${fundGraphAPI}?rebalance_address=${rebalanceAddress}&timeframe=1D`)
        const fundGraphResult = _.get(fundGraphResp, 'data.result', [])
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
          const dataValues = _.get(data, 'values', [])
          let sumUsd = 0
          for (let i = 0; i <= (dataValues.length - 1) / 2; i++) {
            const currentIndex = i + 1
            const currentLoopToken = tokens[i]
            const currentLoopValue = new BigNumber(dataValues[currentIndex + (dataValues.length - 1) / 2] || '1').times(
              new BigNumber(dataValues[currentIndex]).div(
                new BigNumber(10).pow(_.get(currentLoopToken, 'decimals', 18)),
              ),
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
          // dataValues = dataValues.splice(_.get(rebalance, 'tokens', []).length)
          // _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).forEach(
          //   (token, index) => {
          //     if (!base[token.symbol]) {
          //       base[token.symbol] = dataValues[index]
          //     }
          //     if (!graphTokenData[token.symbol]) {
          //       const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)
          //       graphTokenData[token.symbol] = {
          //         name: token.symbol,
          //         values: [],
          //         color: ratioObject.color,
          //       }
          //     }
          //     graphTokenData[token.symbol].values.push(
          //       new BigNumber(dataValues[index])
          //         .div(base[token.symbol] as number)
          //         .times(100)
          //         .toNumber(),
          //     )
          //   },
          // )
        })
        graphTokenData.rebalance = rebalanceData
        setGraphData({ labels: label, graph: graphTokenData })
        setIsLoading(false)
        setIsDisplay(true)
      } catch (error) {
        setIsLoading(false)
      }
    }
  }, [rebalanceAddress, setGraphData, tokens, isDisplay])
  useEffect(() => {
    fetchGraphData()
  }, [fetchGraphData])

  const data = (canvas) => {
    const graphColor = color || '#30ADFF'
    const colorObj = Color(graphColor)

    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, colorObj.mix(Color(isDark ? 'transparent' : 'white'), 0.7))
    gradient.addColorStop(1, isDark ? 'transparent' : 'white')

    return {
      labels: _.get(graphData, 'labels', []),
      datasets: Object.keys(_.get(graphData, 'graph', {})).map((key) => {
        const thisData = _.get(graphData, `graph.${key}`, {})
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
  }

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

  return (
    <RelativeDiv>
      <Box className={className}>
        <Line data={data} options={options} height={height} />
      </Box>
      {isDark && isLoading && (
        <FullDivDark>
          <LoadingData />
        </FullDivDark>
      )}
      {!isDark && isLoading && (
        <FullDiv>
          <LoadingData />
        </FullDiv>
      )}
    </RelativeDiv>
  )
}

export default MiniChart
