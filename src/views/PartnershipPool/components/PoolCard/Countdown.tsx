import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Box = styled.div`
  margin-left: 4px;
  margin-right: 4px;
`
const CountDownBox = styled.div`
  width: 45px;
  border-radius: 6px;
  padding: 6px 4px;
  background: ${({ theme }) => (theme.isDark ? '#212121' : '#f8f8f8')};
`
const TextUnderBox = styled.div`
  font-size: 9px !important;
  color: #9396a8;
  text-align: center;
`
const TextCountDown = styled.div`
  color: #2a9d8f;
  font-size: 16px !important;
  font-weight: 600;
  text-align: center;
`
const BackgroundCard = styled.div`
  display: float;
  background: ${({ theme }) => (theme.isDark ? '#272727' : '#E3E6EC')};
  padding: 5px;
  border-radius: 7px 7px 0px 0px;
`

const CountDown = ({ showCom = false, margin = '0px 0px 0px 20px' }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const countdownInterval = () => {
      const endCountDown = new Date(2022,2,15,15,0,0)
      const timer = endCountDown.getTime() - Date.now()

      if (timer <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      } else {
        setCountdown({
          days: Math.floor(timer / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timer % (1000 * 60)) / 1000),
        })
      }
    }

    const interval = setInterval(countdownInterval, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    showCom && (
      <>
        <div style={{ margin }}>
          <BackgroundCard>
            {/* days */}
            <Box>
              <CountDownBox>
                <TextCountDown>
                  {countdown.days <= 9 ? '0' : ''}
                  {countdown.days}
                </TextCountDown>
                <TextUnderBox>Days</TextUnderBox>
              </CountDownBox>
            </Box>
            {/* Hours */}
            <Box>
              <CountDownBox>
                <TextCountDown>
                  {countdown.hours <= 9 ? '0' : ''}
                  {countdown.hours}
                </TextCountDown>
                <TextUnderBox>Hours</TextUnderBox>
              </CountDownBox>
            </Box>
            {/* Minutes */}
            <Box>
              <CountDownBox>
                <TextCountDown>
                  {countdown.minutes <= 9 ? '0' : ''}
                  {countdown.minutes}
                </TextCountDown>
                <TextUnderBox>Minutes</TextUnderBox>
              </CountDownBox>
            </Box>
            {/* Seconds */}
            <Box>
              <CountDownBox>
                <TextCountDown>
                  {countdown.seconds <= 9 ? '0' : ''}
                  {countdown.seconds}
                </TextCountDown>
                <TextUnderBox>Seconds</TextUnderBox>
              </CountDownBox>
            </Box>
          </BackgroundCard>
        </div>
      </>
    )
  )
}

export default CountDown
