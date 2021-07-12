import React from 'react'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'

interface MiniChartType {
  className?: string
  height?: number
}

const Box = styled.div`
  canvas {
    width: 100% !important;
  }
`

const MiniChart: React.FC<MiniChartType> = ({ className = '', height = 100 }) => {
  const data = (canvas) => {
    const color = '#30ADFF'

    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 140)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.7, 'transparent')

    return {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [
        {
          data: [5, 8, 13, 15, 16, 19],
          fill: true,
          borderColor: color,
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
            beginAtZero: true,
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
    <Box className={className}>
      <Line data={data} options={options} height={height} />
    </Box>
  )
}

export default MiniChart
