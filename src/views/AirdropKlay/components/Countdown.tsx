import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'
import klaytnLogo from 'uikit-dev/images/Logo-Klaytn.png'

const CountDown = ({ showCom = false }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  //   const [isTimeUpAirdrop, setIsTimeUpAirdrop] = useState<boolean>(false)

  useEffect(() => {
    const countdownInterval = () => {
      const endCountDown = new Date(2021, 5, 21, 9, 59, 59)
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
    margin-left: 4px;
    margin-right: 4px;
  `
  const CountDownBox = styled.div`
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    padding: 15px 10px 15px 10px;
    font-size: 50px;
    background-color: #f8f8f8;
    color: #3072b4;
  `
  const TextUnderBox = styled.div`
    margin-top: 5px;
    text-align: center;
    color: #9396a8;
  `

  return (
    showCom && (
      <>
        <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Text color="primary" style={{ textAlign: 'center', marginBottom: '10px', fontSize: '30px' }}>
            Congratulations!
          </Text>

          <Text style={{ textAlign: 'center', marginBottom: '20px', fontSize: '30px' }}>
            You will receive 11 KLAY
            <img
              style={{ width: '20px', marginLeft: '15px', marginRight: '10px' }}
              src={klaytnLogo}
              alt=""
              className="logo"
            />{' '}
          </Text>

          <Text style={{ textAlign: 'center', marginBottom: '20px', color: '#8C90A3' }}>
            KLAY airdrop is available to claim in
          </Text>
        </div>
        <div style={{ display: 'inherit', margin: '0px 20px' }}>
          {/* days */}
          <Box>
            <CountDownBox>
              {countdown.days <= 9 ? '0' : ''}
              {countdown.days}
            </CountDownBox>
            <TextUnderBox>Days</TextUnderBox>
          </Box>
          {/* Hours */}
          <Box>
            <CountDownBox>
              {countdown.hours <= 9 ? '0' : ''}
              {countdown.hours}
            </CountDownBox>
            <TextUnderBox>Hours</TextUnderBox>
          </Box>
          {/* Minutes */}
          <Box>
            <CountDownBox>
              {countdown.minutes <= 9 ? '0' : ''}
              {countdown.minutes}
            </CountDownBox>
            <TextUnderBox>Minutes</TextUnderBox>
          </Box>
          {/* Seconds */}
          <Box>
            <CountDownBox>
              {countdown.seconds <= 9 ? '0' : ''}
              {countdown.seconds}
            </CountDownBox>
            <TextUnderBox>Seconds</TextUnderBox>
          </Box>
        </div>
      </>
    )
  )
}

export default CountDown
