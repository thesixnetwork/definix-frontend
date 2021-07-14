import React from 'react'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'

interface FullChartType {
  className?: string
  height?: number
}

const Box = styled.div`
  canvas {
    width: 100% !important;
  }
`

const FullChart: React.FC<FullChartType> = ({ className = '', height = 320 }) => {
  const data = (canvas) => {
    const color = '#30ADFF'

    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 320)
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
    <Box className={className}>
      <Line data={data} options={options} height={height} />
    </Box>
  )
}

export default FullChart
