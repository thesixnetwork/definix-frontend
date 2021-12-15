import { get } from 'lodash'
import React, { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { Checkbox, CheckboxLabel, Flex, Text, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import CircularProgress from '@material-ui/core/CircularProgress'
import useTheme from 'hooks/useTheme'
import { getTokenName } from 'utils/getTokenSymbol'
import { getTokenImageUrl } from 'utils/getTokenImage'

const rebalanceColor = '#ff6828'

const Box = styled.div`
  canvas {
    width: 100% !important;
    max-height: 500px;
  }
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 106px;

  .rebalancing {
    width: 20px;
    height: 4px;
    background: ${rebalanceColor};
    margin-right: 10px;
  }

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 6px;
  }
`

const FullDiv = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(33, 33, 33, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
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

const Legend = ({ fundName, selectedTokens, setSelectedTokens, tokens }) => {
  const onCheck = (token) => (event) => {
    setSelectedTokens({ ...selectedTokens, [token.symbol]: event.target.checked })
  }
  const onCheckAll = () => (event) => {
    const selectAllToken = {}
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      selectAllToken[token.symbol] = event.target.checked
    }
    setSelectedTokens(selectAllToken)
  }
  const AllChecked = useMemo(() => tokens.every(({ symbol }) => selectedTokens[symbol]), [tokens, selectedTokens])

  return (
    <Flex mt="S_42" mb="S_20">
      <div>
        <LegendItem className="mr-s24" style={{ minWidth: '160px' }}>
          <div className="rebalancing" />
          <Text textStyle="R_14R">{fundName}</Text>
        </LegendItem>
      </div>
      <Flex flexWrap="wrap">
        {tokens.map((c) => {
          const thisName = getTokenName(c?.symbol)
          return (
            <CheckboxLabel
              key={c.symbol}
              className="mr-s24 mb-s16 flex align-center"
              control={
                <Checkbox scale="sm" variantColor="brown" checked={!!selectedTokens[c.symbol]} onChange={onCheck(c)} />
              }
            >
              <LegendItem>
                <img src={getTokenImageUrl(c.symbol)} alt="" />
                <Text textStyle="R_14R">{thisName}</Text>
              </LegendItem>
            </CheckboxLabel>
          )
        })}
        <CheckboxLabel
          className="mx-r24 mb-s16 flex align-center"
          control={<Checkbox scale="sm" variantColor="brown" checked={AllChecked} onChange={onCheckAll()} />}
        >
          <LegendItem>
            {/* <img src={getTokenImageUrl(c.symbol)} alt="" /> */}
            <Text textStyle="R_14R">ALL</Text>
          </LegendItem>
        </CheckboxLabel>
      </Flex>
    </Flex>
  )
}

const FullChart = ({ fundName, tokens, isLoading, graphData = {}, className = '', height = 320 }) => {
  const { isDark } = useTheme()
  const { isSm, isMd } = useMatchBreakpoints()
  const isMobile = isSm || isMd
  const [selectedTokens, setSelectedTokens] = useState({})
  const data = () => {
    return {
      labels: get(graphData, 'labels', []),
      datasets: Object.keys(get(graphData, 'graph', {}))
        .filter((key) => selectedTokens[key] || key === 'rebalance')
        .map((key) => {
          const thisData = get(graphData, `graph.${key}`, {})
          const thisName = thisData.name || ''

          return {
            label: thisName,
            chartName: get(graphData, `chartName`, ''),
            data: thisData.values || [],
            dataPrice: thisData.valuesPrice || [],
            fill: true,
            borderColor: thisData.color,
            pointBackgroundColor: thisData.color,
            pointBorderColor: thisData.color,
            borderWidth: 3,
            pointRadius: 1,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 3,
            pointHoverBackgroundColor: 'white',
            tension: 0,
            backgroundColor: 'transparent',
            ...(thisName === 'Rebalance'
              ? {
                  borderColor: rebalanceColor,
                  pointBackgroundColor: rebalanceColor,
                  pointBorderColor: rebalanceColor,
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
      mode: 'nearest',
      displayColors: false,
      interaction: {
        intersect: true,
      },
      callbacks: {
        title: (tooltipItem, dataTooltip) => {
          const index = tooltipItem[0].datasetIndex
          const curGraph = dataTooltip.datasets[index]
          return curGraph?.label
        },
        beforeLabel: (tooltipItem) => {
          return tooltipItem.xLabel
        },
        label: (tooltipItem, dataTooltip) => {
          const index = tooltipItem.datasetIndex
          const curGraph = dataTooltip.datasets[index]
          return `Price: $${Number(curGraph.dataPrice[tooltipItem.index].toFixed(2)).toLocaleString()}`
        },
        afterLabel: (tooltipItem, dataTooltip) => {
          const index = tooltipItem.datasetIndex
          const curGraph = dataTooltip.datasets[index]
          const diff = tooltipItem.value - curGraph.data[0]
          const same = diff === 0
          const sign = diff < 0 ? '' : '+'
          return `Change: ${same ? '' : sign}${diff.toFixed(2)}%`
        },
      },
    },
  }

  return (
    <div className={className}>
      <RelativeDiv>
        <Box>
          <Line data={data} options={options} height={height} legend={{ display: false }} />
        </Box>
        {isLoading && (
          <FullDiv isDark={isDark}>
            <LoadingData />
          </FullDiv>
        )}
      </RelativeDiv>

      {isMobile || (
        <Legend
          fundName={fundName}
          tokens={tokens}
          selectedTokens={selectedTokens}
          setSelectedTokens={setSelectedTokens}
        />
      )}
    </div>
  )
}

export default FullChart
