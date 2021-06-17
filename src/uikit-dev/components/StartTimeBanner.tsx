/* eslint-disable react/require-default-props */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text } from './Text'

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  padding: 4px 24px;

  > div > * {
    margin: 4px;
  }

  img {
    width: 40px;
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

interface StartTimeBannerProps {
  logo?: any
  title?: string
  detail?: string
  topTitle?: string
  topValue?: string
  endTime?: any
  button?: any
}

const StartTimeBanner = ({ logo, title, detail, topTitle, topValue, endTime, button }: StartTimeBannerProps) => {
  const currentTime = new Date().getTime()
  const [timer, setTime] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  })

  const calculateCountdown = () => {
    const startDateTime = new Date(2021, 4, 14, 15, 0, 0, 0)
    const startStamp = startDateTime.getTime()

    const newDate = new Date()
    const newStamp = newDate.getTime()

    let diff = Math.round((newStamp - startStamp) / 1000)

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

    timeLeft.days = Math.floor(diff / 86400)
    diff -= timeLeft.days * 86400
    timeLeft.hours = Math.floor(diff / 3600)
    diff -= timeLeft.hours * 3600
    timeLeft.min = Math.floor(diff / 60)
    diff -= timeLeft.min * 60
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
      const d = calculateCountdown()
      if (d) {
        setTime(d)
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return currentTime < endTime ? (
    <Banner>
      <MaxWidth className="flex align-center justify-center flex-wrap">
        {logo && <img src={logo} alt="" />}

        <Text color="white" textAlign="center">
          {title && <strong className="mr-1">{title}</strong>}
          {detail}
        </Text>

        {endTime && (
          <Text bold color="#ffd157" fontSize="24px" textAlign="center">
            {`${addLeadingZeros(timer.days)}:${addLeadingZeros(timer.hours)}:${addLeadingZeros(
              timer.min,
            )}:${addLeadingZeros(timer.sec)}`}
          </Text>
        )}
        <>
          <Text color="white" textAlign="center">
            <strong>{topTitle}</strong>
          </Text>
          <Text bold color="#ffd157" fontSize="24px" className="mr-2">
            {topValue}
          </Text>
          {button}
        </>
      </MaxWidth>
    </Banner>
  ) : (
    <></>
  )
}

export default StartTimeBanner
