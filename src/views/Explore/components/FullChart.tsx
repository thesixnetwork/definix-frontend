import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import React from 'react'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'uikit-dev'
import currency from '../mockCurrency'

const rebalanceColor = '#30ADFF'

interface FullChartType {
  className?: string
  height?: number
}

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

const Legend = () => {
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg

  return (
    <FormGroup row className="flex flex-wrap mb-5">
      <LegendItem className={isMobile ? 'col-6' : 'mr-6'}>
        <div className="rebalancing" />
        <Text fontSize="12px" bold>
          Rebalancing
        </Text>
      </LegendItem>

      {currency.map((c) => (
        <FormControlLabelCustom
          className={isMobile ? 'col-6 ma-0' : ' mr-6'}
          control={<Checkbox size="small" color="primary" />}
          label={
            <LegendItem>
              <img src={c.img} alt="" />
              <Text fontSize="12px" bold>
                {c.name}
              </Text>
            </LegendItem>
          }
        />
      ))}
    </FormGroup>
  )
}

const FullChart: React.FC<FullChartType> = ({ className = '', height = 320 }) => {
  const data = (canvas) => {
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 320)
    gradient.addColorStop(0, rebalanceColor)
    gradient.addColorStop(0.7, 'transparent')

    return {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [
        {
          data: [5, 8, 13, 15, 16, 19],
          fill: true,
          borderColor: rebalanceColor,
          backgroundColor: gradient,
          tension: 0,
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
        },
      ],
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
          gridLines: {
            display: false,
          },
        },
      ],
    },
  }

  return (
    <div className={className}>
      <Legend />
      <Box>
        <Line data={data} options={options} height={height} legend={{ display: false }} />
      </Box>
    </div>
  )
}

export default FullChart
