import React, { useState, useEffect, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import _ from 'lodash'
import { Line } from 'react-chartjs-2'
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

const MiniChart = ({ rebalanceAddress, className = '', height = 100 }) => {
  const [graphData, setGraphData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const fetchGraphData = useCallback(async () => {
    if (rebalanceAddress) {
      setIsLoading(true)
      const fundGraphAPI = process.env.REACT_APP_API_FUND_GRAPH
      try {
        const fundGraphResp = await axios.get(`${fundGraphAPI}?rebalance_address=${rebalanceAddress}&timeframe=1D`)
        const fundGraphResult = _.get(fundGraphResp, 'data.result', [])
        const label = []
        const rebalanceData = {
          name: 'rebalance',
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
          if (!base.rebalance) {
            base.rebalance = new BigNumber(dataValues[0]).div(new BigNumber(10).pow(18)).toNumber()
          }
          rebalanceData.values.push(
            new BigNumber(dataValues[0])
              .div(new BigNumber(10).pow(18))
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
      } catch (error) {
        setIsLoading(false)
      }
    }
  }, [rebalanceAddress, setGraphData])
  useEffect(() => {
    fetchGraphData()
  }, [fetchGraphData])

  const data = (canvas) => {
    const color = '#30ADFF'

    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 140)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.7, 'transparent')

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
          tension: 0,
          ...(thisName === 'rebalance'
            ? {
                borderColor: color,
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
      {isLoading && (
        <FullDiv>
          <LoadingData />
        </FullDiv>
      )}
    </RelativeDiv>
  )
}

export default MiniChart
