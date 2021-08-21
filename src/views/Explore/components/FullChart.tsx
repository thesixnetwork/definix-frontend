import Checkbox from '@material-ui/core/Checkbox'
import _ from 'lodash'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'uikit-dev'
import CircularProgress from '@material-ui/core/CircularProgress'
import useTheme from 'hooks/useTheme'
import { TypeChartName } from './SelectChart'

const rebalanceColor = '#30ADFF'

const Box = styled.div`
  canvas {
    width: 100% !important;
  }
`

const FormControlLabelCustom = styled(FormControlLabel)`
  .MuiCheckbox-root {
    padding: 6px;
  }
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;

  .rebalancing {
    width: 24px;
    height: 6px;
    border-radius: ${({ theme }) => theme.radii.small};
    background: ${rebalanceColor};
    margin-right: 8px;
  }

  img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
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
    <Text>Loading...</Text>
  </div>
)

const Legend = ({ selectedTokens, setSelectedTokens, tokens }) => {
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg

  const onCheck = (token) => (event) => {
    setSelectedTokens({ ...selectedTokens, [token.symbol]: event.target.checked })
  }

  return (
    <FormGroup row className="flex flex-wrap mb-5">
      <LegendItem className={isMobile ? 'col-6' : 'mr-6'}>
        <div className="rebalancing" />
        <Text fontSize="14px" bold>
          Rebalancing
        </Text>
      </LegendItem>

      {tokens.map((c) => {
        const thisName = (() => {
          if (c.symbol === 'WKLAY') return 'KLAY'
          if (c.symbol === 'WBNB') return 'BNB'
          return c.symbol
        })()
        return (
          <FormControlLabelCustom
            className={isMobile ? 'col-6 ma-0' : ' mr-6'}
            control={
              <Checkbox size="small" color="primary" checked={!!selectedTokens[c.symbol]} onChange={onCheck(c)} />
            }
            label={
              <LegendItem>
                <img src={`/images/coins/${c.symbol || ''}.png`} alt="" />
                <Text fontSize="14px" bold>
                  {thisName}
                </Text>
              </LegendItem>
            }
          />
        )
      })}
    </FormGroup>
  )
}

const FullChart = ({ tokens, isLoading, graphData = {}, className = '', height = 320 }) => {
  const { isDark } = useTheme()
  const [selectedTokens, setSelectedTokens] = useState({})
  const data = (canvas) => {
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 320)
    gradient.addColorStop(0, rebalanceColor)
    gradient.addColorStop(0.7, isDark ? 'transparent' : 'white')

    return {
      labels: _.get(graphData, 'labels', []),
      datasets: Object.keys(_.get(graphData, 'graph', {}))
        .filter((key) => selectedTokens[key] || key === 'rebalance')
        .map((key) => {
          const thisData = _.get(graphData, `graph.${key}`, {})
          const thisName = thisData.name || ''
          return {
            label: thisName,
            chartName: _.get(graphData, `chartName`, ''),
            data: thisData.values || [],
            dataPrice: thisData.valuesPrice || [],
            fill: true,
            borderColor: thisData.color,
            tension: 0,
            ...(thisName === 'rebalance'
              ? {
                  borderColor: rebalanceColor,
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
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            autoSkipPadding: 23,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    tooltips: {
      mode: 'x',
      displayColors: false,
      callbacks: {
        label: (tooltipItem, dataTooltip) => {
          const index = tooltipItem.datasetIndex
          // eslint-disable-next-line
          // debugger
          if ((dataTooltip.datasets[index].chartName as TypeChartName) === 'Price') {
            const price = dataTooltip.datasets[index].dataPrice[tooltipItem.index]
            
            if(dataTooltip.datasets[index].label === "rebalance"){
              return `${dataTooltip.datasets[index].label}: ${price.toFixed(2)}`
            }
              return `${dataTooltip.datasets[index].label}: $ ${price.toFixed(2)}`
            
          }
          return `${dataTooltip.datasets[index].label}: ${tooltipItem.value}`
        },
      },
    },
  }

  return (
    <div className={className}>
      <Legend tokens={tokens} selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens} />
      <RelativeDiv>
        <Box>
          <Line data={data} options={options} height={height} legend={{ display: false }} />
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
    </div>
  )
}

export default FullChart
