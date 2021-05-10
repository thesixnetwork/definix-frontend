import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useProfile } from 'state/hooks'
import styled from 'styled-components'
import { Button, ChevronRightIcon, Heading, Text } from 'uikit-dev'
import bg from 'uikit-dev/images/for-ui-v2/bg.png'
import CardAudit from './components/CardAudit'
import CardComingSoon from './components/CardComingSoon'
import CardGetStarted from './components/CardGetStarted'
import CardMyFarmsAndPools from './components/CardMyFarmsAndPools'
import CardTVL from './components/CardTVL'
import CardTweet from './components/CardTweet'

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

const MaxWidthLeft = styled(MaxWidth)`
  max-width: 1000px;
`

const MaxWidthRight = styled(MaxWidth)`
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`

const LeftPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: ${({ isShowRightPanel }) => (isShowRightPanel ? 'calc(100% - 480px)' : '100%')};
  padding: 32px;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.2s;
`

const RightPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: ${({ isShowRightPanel }) => (isShowRightPanel ? '480px' : '0')};
  padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '40px 32px 32px 32px' : '40px 0 32px 0')};
  position: relative;
  transition: 0.2s;
  transform: ${({ isShowRightPanel }) => (isShowRightPanel ? 'translateX(0)' : 'translateX(100%)')};
  background: ${({ theme }) => theme.colors.backgroundRadial};

  > button {
    position: absolute;
    top: 24px;
    right: 100%;
    background: ${({ theme }) => theme.colors.white};
    border-radius: 0;
    border-top-left-radius: ${({ theme }) => theme.radii.medium};
    border-bottom-left-radius: ${({ theme }) => theme.radii.medium};
    flex-direction: column;
    align-items: center;
    padding: 12px 16px;
    height: auto;
    color: ${({ theme }) => theme.colors.textSubtle};
    box-shadow: ${({ theme }) => theme.shadows.elevation1};

    svg {
      margin: 0 0 8px 0;
    }
  }
`

const Caption = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.primary};
  padding: 4px 16px;
  border-radius: ${({ theme }) => theme.radii.large};
  display: inline-block;
`

const Home: React.FC = () => {
  const { account } = useWallet()
  const { hasProfile } = useProfile()
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

  const [isShowRightPanel, setIsShowRightPanel] = useState(true)

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

  useEffect(() => {
    return () => {
      setIsShowRightPanel(true)
    }
  }, [])

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
        <div className="flex">
          <LeftPanel isShowRightPanel={isShowRightPanel}>
            <MaxWidthLeft>
              <div className="mb-5">
                <Heading as="h1" fontSize="32px !important" className="mb-2" textTransform="uppercase">
                  Home
                </Heading>
                <Caption>Put your helmet on!! We are going to the MOON!!</Caption>
              </div>

              <CardComingSoon showBtn className="mb-5" />

              <div className="flex align-stretch">
                <div className="col-6 mr-2">
                  <CardTVL className="mb-5" />
                  <CardAudit />
                </div>
                <div className="col-6 ml-3">
                  <CardTweet />
                </div>
              </div>
            </MaxWidthLeft>
          </LeftPanel>

          <RightPanel isShowRightPanel={isShowRightPanel}>
            <Button
              startIcon={<ChevronRightIcon />}
              variant="tertiary"
              onClick={() => {
                setIsShowRightPanel(!isShowRightPanel)
              }}
            >
              Hide
            </Button>
            {isShowRightPanel && (
              <MaxWidthRight>
                {account && !hasProfile ? (
                  <>
                    <Heading className="mb-3" fontSize="18px !important" textTransform="uppercase">
                      My farms & pools
                    </Heading>

                    <CardMyFarmsAndPools />
                  </>
                ) : (
                  <>
                    <Heading className="mb-3" fontSize="18px !important" textTransform="uppercase">
                      TUTORIALS
                    </Heading>
                    <CardGetStarted />
                  </>
                )}
              </MaxWidthRight>
            )}
          </RightPanel>
        </div>
      </div>
    </>
  )
}

export default Home
