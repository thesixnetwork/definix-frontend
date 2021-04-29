import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Heading, Text } from 'uikit-dev'
import CardAudit from './components/CardAudit'
import CardTVL from './components/CardTVL'
import CardTweet from './components/CardTweet'
import MainBanner from './components/MainBanner'

const CountDownFarm = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  padding: 20px 24px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  strong {
    margin-left: 4px;
    color: #ffd157;
    font-size: 24px;
  }
`

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Home: React.FC = () => {
  // const TranslateString = useI18n()
  const currentTime = new Date().getTime()
  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

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
      const d = calculateCountdown(phrase2TimeStamp)

      if (d) {
        setTime(d)
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [phrase2TimeStamp])

  return (
    <>
      {currentTime < phrase2TimeStamp && (
        <CountDownFarm>
          <MaxWidth>
            <p>
              Definix Farms will be available in{' '}
              <strong>
                {addLeadingZeros(timer.hours)}:{addLeadingZeros(timer.min)}:{addLeadingZeros(timer.sec)}
              </strong>
            </p>
          </MaxWidth>
        </CountDownFarm>
      )}
      <div>
        <MaxWidth>
          <div className="flex">
            <div className="col-7 pa-6">
              <div className="mb-5">
                <Heading as="h1" fontSize="32px !important" className="mb-1">
                  Home
                </Heading>
                <Text>Put your helmet on!! We are going to the MOON!!</Text>
              </div>

              <MainBanner showBtn className="mb-5" />

              <div className="flex align-strench">
                <div className="col-6 mr-2">
                  <CardTVL className="mb-5" />
                  <CardAudit />
                </div>
                <div className="col-6 ml-3">
                  <CardTweet />
                </div>
              </div>
            </div>

            <div className="col-5 pa-6">
              <div className="flex">
                <Heading as="h3">My farms & pools</Heading>
              </div>
            </div>
          </div>
        </MaxWidth>
      </div>
    </>
  )
}

export default Home
