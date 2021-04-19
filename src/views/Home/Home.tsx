import Page from 'components/layout/Page'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading } from 'uikit-dev'
import FinixStats from 'views/Home/components/FinixStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import InfoBanner from 'views/Info/components/InfoBanner'
// import Flip from '../../uikit-dev/components/Flip'
// import CardStakeBlue from './components/CardStakeBlue'
import CardUpcomingFarms from './components/CardUpcomingFarms'
// import FarmStakingCard from 'views/Home/components/FarmStakingCard'
// import LotteryCard from 'views/Home/components/LotteryCard'
// import EarnAPYCard from 'views/Home/components/EarnAPYCard'
// import EarnAssetCard from 'views/Home/components/EarnAssetCard'
// import WinCard from 'views/Home/components/WinCard'

// const Hero = styled.div`
//   align-items: center;
//   background-image: url('/images/pan-bg-mobile.svg');
//   background-repeat: no-repeat;
//   background-position: top center;
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
//   margin: auto;
//   margin-bottom: 32px;
//   padding-top: 116px;
//   text-align: center;

//   ${({ theme }) => theme.mediaQueries.lg} {
//     background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
//     background-position: left center, right center;
//     height: 165px;
//     padding-top: 0;
//   }
// `

// const CTACards = styled(BaseLayout)`
//   align-items: start;
//   margin-bottom: 32px;

//   & > div {
//     grid-column: span 6;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     & > div {
//       grid-column: span 8;
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     & > div {
//       grid-column: span 4;
//     }
//   }
// `

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 24px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`
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
      <Page>
        <MaxWidth>
          <Heading as="h1" fontSize="32px !important" className="mb-6 mt-2" textAlign="center">
            Dashboard
          </Heading>

          <div>
            {/* <Cards>
          <FarmStakingCard />
          <LotteryCard />
        </Cards>
        <CTACards>
          <EarnAPYCard />
          <EarnAssetCard />
          <WinCard />
        </CTACards> */}
            <InfoBanner className="mb-5" showBtn />
            <Cards>
              <TotalValueLockedCard />
              <FinixStats />
            </Cards>
            <CardUpcomingFarms />
            {/* <CardStakeBlue /> */}
            {/* <div className="flex align-center justify-center mt-6">
          <Text small>Audited by</Text>
          <img src={certik} width="120" alt="" />
        </div> */}
          </div>
        </MaxWidth>
      </Page>
    </>
  )
}

export default Home
