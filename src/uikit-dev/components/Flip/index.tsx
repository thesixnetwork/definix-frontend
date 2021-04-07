import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const FlipStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;

  .countdown-col {
    margin: 0 12px;

    &:last-child strong:after {
      display: none;
    }
  }

  strong,
  span {
    display: block;
    text-align: center;
  }

  strong {
    background: ${({ theme }) => theme.colors.text};
    padding: 1rem 0.5rem;
    color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radii.default};
    margin-bottom: 0.5rem;
    font-weight: 100;
    font-size: 24px;
    position: relative;
    width: 48px;
    text-align: center;

    &:before {
      content: '';
      width: 100%;
      height: 50%;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      top: 0;
      left: 0;
    }

    &:after {
      content: ':';
      position: absolute;
      top: calc(50% - 12px);
      right: -14px;
      font-size: 24px;
      color: initial;
      font-weight: initial;
    }
  }

  span {
    font-size: 10px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    strong {
      background: ${({ theme }) => theme.colors.text};
      padding: 1rem;
      margin-bottom: 1rem;
      font-size: 64px;
      width: 116px;
    }

    span {
      font-size: 14px;
    }
  }
`

const Flip = ({ date, small = false, color = '#ffffff' }) => {
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
      const d = calculateCountdown(date)

      if (d) {
        setTime(d)
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [date])

  if (small) {
    return (
      <strong style={{ color, display: 'inline-block', width: '200px' }}>
        {`
    ${addLeadingZeros(timer.days)} :

    ${addLeadingZeros(timer.hours)} :

    ${addLeadingZeros(timer.min)} :

    ${addLeadingZeros(timer.sec)}
    `}
      </strong>
    )
  }

  return (
    <FlipStyled>
      <div className="countdown-col">
        <strong>{addLeadingZeros(timer.days)}</strong>
        <span>{timer.days === 1 ? 'Day' : 'Days'}</span>
      </div>

      <div className="countdown-col">
        <strong>{addLeadingZeros(timer.hours)}</strong>
        <span>Hours</span>
      </div>

      <div className="countdown-col">
        <strong>{addLeadingZeros(timer.min)}</strong>
        <span>Miniutes</span>
      </div>

      <div className="countdown-col">
        <strong>{addLeadingZeros(timer.sec)}</strong>
        <span>Seconds</span>
      </div>
    </FlipStyled>
  )
}

export default Flip
