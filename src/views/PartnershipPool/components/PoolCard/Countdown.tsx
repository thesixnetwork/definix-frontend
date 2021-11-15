import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'
import klaytnLogo from 'uikit-dev/images/Logo-Klaytn.png'

const CountDown = ({ showCom = false, margin = '0px 0px 0px 20px' }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const countdownInterval = () => {
      const endCountDown = new Date('2022-01-14 15:00:00')
      const timer = endCountDown.getTime() - Date.now()

      if (timer <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
        // setIsTimeUpAirdrop(true)
      } else {
        setCountdown({
          days: Math.floor(timer / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timer % (1000 * 60)) / 1000),
        })
        // setIsTimeUpAirdrop(false)
      }
    }

    const interval = setInterval(countdownInterval, 1000)
    return () => clearInterval(interval)
  }, [])

  const Box = styled.div`
    margin-right: 7px;
  `
  const CountDownBox = styled.div`
    width: 45px;
    border-radius: 6px;
    padding: 6px 0px;
    background: ${({ theme }) => (theme.isDark ? '#212121' : '#f8f8f8')};
  `
  const TextUnderBox = styled.div`
    font-size: 9px !important;
    color: #9396a8;
    text-align: center;
  `
  const TextCountDown = styled.div`
    color: #2a9d8f;
    font-size: 15px !important;
    text-align: center;
  `
  const BackgroundCard = styled.div`
    display: float;
    background: ${({ theme }) => (theme.isDark ? 'black' : 'white')};
    padding: 5px 5px 5px 5px;
    border-radius: 7px 7px 0px 0px;
  `

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
