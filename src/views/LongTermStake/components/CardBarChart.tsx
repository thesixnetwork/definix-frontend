import React from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { HorizontalBar } from 'react-chartjs-2'

const Box = styled.div`
  // width: 100% !important;
  // height: 100% !important;

  // ${({ theme }) => theme.mediaQueries.xs} {
  //   width: 100% !important;
  //   height: 116px !important;
  // }
  // ${({ theme }) => theme.mediaQueries.sm} {
  //   width: 100% !important;
  //   height: 156px !important;
  // }
  // ${({ theme }) => theme.mediaQueries.md} {
  //   width: 100% !important;
  //   height: 156px !important;
  // }
  // ${({ theme }) => theme.mediaQueries.lg} {
  //   width: 100% !important;
  //   height: 156px !important;
  // }
`

const traparent = '#ffffff00'

const options = {
  cornerRadius: 20,
  elements: {
    rectangle: {
      borderWidth: 2,
      borderSkipped: 'left',
    },
  },
  responsive: true,
  responsiveAnimationDuration: 100,
  type: 'bar',
  layout: {
    padding: {
      right: 0,
    },
  },

  scales: {
    xAxes: [
      {
        color: traparent,
        label: '',
        gridLines: {
          color: traparent,
          drawBorder: false,
          zeroLineColor: 'transparent',
        },
        scaleLabel: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        color: traparent,
        gridLines: {
          color: traparent,
          drawBorder: false,
          zeroLineColor: 'transparent',
        },
        label: '',
        scaleLabel: {
          display: false,
        },
        barPercentage: 1,
        categoryPercentage: 1,
        barThickness: 15,
        ticks: {
          fontColor: '#737375',
          fontSize: 14,
          padding: 20,
          suggestedMin: 0,
          beginAtZero: true 
        },
      },
    ],
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
}

const CardBarChart = ({ lock, className }) => {
  const data = (canvas) => {
    const ctx1 = canvas.getContext('2d')
    const ctx2 = canvas.getContext('2d')
    const ctx3 = canvas.getContext('2d')
    const primary = ctx1.createLinearGradient(150, 0, 90, 0)
    primary.addColorStop(0, '#F5C858')
    primary.addColorStop(1, '#D8D8D800')
    const success = ctx2.createLinearGradient(150, 0, 90, 0)
    success.addColorStop(0, '#30ADFF')
    success.addColorStop(1, '#D8D8D800')
    const warning = ctx3.createLinearGradient(150, 0, 90, 0)
    warning.addColorStop(0, '#2A9D8F')
    warning.addColorStop(1, '#D8D8D800')
    const themeColors = [primary, success, warning]
    return {
      labels: ['1X 90 days  ', '2X 180 days', '4X 365 days'],
      datasets: [
        {
          label: '',
          axis: 'y',
          data: lock,
          backgroundColor: themeColors,
          borderColor: '#00000000',
          cornerRadius: 10,
          borderWidth: 2,
          borderSkipped: false,
        },
      ],
    }
  }

  return (
    <Box className={className}>
      <HorizontalBar data={data} options={options} />
    </Box>
  )
}

export default CardBarChart
