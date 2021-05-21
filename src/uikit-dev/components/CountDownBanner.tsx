import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text } from './Text'

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  padding: 8px 24px;

  * {
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

const CountDownBanner = ({ logo = '', title = '', detail = '', endTime, button = <></> }) => {
  const currentTime = new Date().getTime()
  const [timer, setTime] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  })

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

  return currentTime < endTime ? (
    <Banner>
      <MaxWidth className="flex align-center justify-center flex-wrap">
        {logo && <img src={logo} alt="" />}

        <Text color="white" className="mr-2" textAlign="center">
          {title && <strong className="mr-1">{title}</strong>}
          {detail}
        </Text>

        {endTime && (
          <Text bold color="#ffd157" fontSize="24px" className="mr-2" textAlign="center">
            {`${addLeadingZeros(timer.hours)}:${addLeadingZeros(timer.min)}:${addLeadingZeros(timer.sec)}`}
          </Text>
        )}
        {button}
      </MaxWidth>
    </Banner>
  ) : (
    <></>
  )
}

export default CountDownBanner
