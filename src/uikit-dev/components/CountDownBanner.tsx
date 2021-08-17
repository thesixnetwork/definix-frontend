/* eslint-disable react/require-default-props */

import React, { useEffect, useState } from 'react'
import { useMatchBreakpoints } from 'uikit-dev/hooks'
import styled from 'styled-components'
import { Text } from './Text'

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  padding: 4px 24px;

  > div > * {
    margin: 8px;
  }

  img {
    width: 32px;
  }

  button,
  a {
    color: ${({ theme }) => theme.colors.primary} !important;
    background: ${({ theme }) => theme.colors.white} !important;
  }
`

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

interface CountDownBannerProps {
  logo?: any
  title?: string
  detail?: string
  highlight?: string
  topTitle?: string
  topValue?: string
  endTime?: any
  button?: any
  disableCountdown?: boolean
  customText?: any
}

const CountDownBanner = ({
  logo,
  title,
  detail,
  highlight,
  topTitle,
  topValue,
  endTime,
  button,
  disableCountdown = false,
  customText,
}: CountDownBannerProps) => {
  const currentTime = new Date().getTime()
  const [timer, setTime] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  })

  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isMd && !isXl && !isLg

  const calculateCountdown = (endDate) => {
    let diff = (new Date(endDate).getTime() - new Date().getTime()) / 1000

    // clear countdown when date is reached
    if (diff <= 0) return false

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    }

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400))
      diff -= timeLeft.years * 365.25 * 86400
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400)
      diff -= timeLeft.days * 86400
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600)
      diff -= timeLeft.hours * 3600
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60)
      diff -= timeLeft.min * 60
    }
    timeLeft.sec = Math.floor(diff)

    return timeLeft
  }

  const addLeadingZeros = (value) => {
    let val = String(value)
    while (val.length < 2) {
      val = `0${val}`
    }
    return val
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const d = calculateCountdown(endTime)

      if (d) {
        setTime(d)
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return currentTime < endTime || disableCountdown ? (
    <Banner>
      <MaxWidth className={`flex align-center justify-center ${isMobile ? 'flex-wrap' : ''}`}>
        {logo && <img src={logo} alt="" />}
        {customText || (
          <>
            <Text color="white" className="mr-2" textAlign="center">
              {title && <strong className="mr-1">{title}</strong>}
              {detail && <span className="m-1">{detail}</span>}
              {highlight && <strong style={{ color: '#ffd157' }}>{highlight}</strong>}
            </Text>

            {endTime && (
              <Text bold color="#ffd157" fontSize="24px" className="mr-2" textAlign="center">
                {`${addLeadingZeros(timer.days)}:${addLeadingZeros(timer.hours)}:${addLeadingZeros(
                  timer.min,
                )}:${addLeadingZeros(timer.sec)}`}
              </Text>
            )}

            {topTitle && (
              <Text color="white" textAlign="center" bold>
                {topTitle}
              </Text>
            )}

            {topValue && (
              <Text color="#ffd157" textAlign="center" bold fontSize="24px" className="mr-2">
                {topValue}
              </Text>
            )}

            {button}
          </>
        )}
      </MaxWidth>
    </Banner>
  ) : (
    <></>
  )
}

export default CountDownBanner
