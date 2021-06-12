import Page from 'components/layout/Page'
import React from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading } from 'uikit-dev'
import CountDownBanner from 'uikit-dev/components/CountDownBanner'
import certik from 'uikit-dev/images/Audit/AW-42.png'
import techRate from 'uikit-dev/images/Audit/AW-43.png'
import InfoBanner from 'views/Info/components/InfoBanner'
import CardUpcomingFarms from './components/CardUpcomingFarms'
import FinixStats from './components/FinixStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'
import CardAirdropKlay from './components/CardAirdropKlay'

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

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Home: React.FC = () => {
  // const TranslateString = useI18n()

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()

  // const { isSm } = useMatchBreakpoints()

  // const settings = {
  //   infinite: true,
  //   lazyLoad: true,
  //   dots: true,
  //   arrows: false,
  //   adaptiveHeight: true,
  //   className: 'pb-7',
  // }

  return (
    <>
      <CountDownBanner title="Definix Farms will be available in" endTime={phrase2TimeStamp} />
      <Page>
        <MaxWidth>
          <Heading as="h1" fontSize="32px !important" className="mb-6 mt-2" textAlign="center">
            Dashboard
          </Heading>
          <CardAirdropKlay showBtn className="mb-5" />
          <InfoBanner className="mb-5" showBtn />

          <Cards>
            <TotalValueLockedCard />
            <FinixStats />
          </Cards>

          {/* <Slider {...settings}></Slider> */}
          
          <CardUpcomingFarms />

          <div className="flex flex-wrap align-center justify-center mt-5">
            <p className="ma-1">Certified by</p>
            <div className="flex align-center ma-1">
              <a className="mr-3" href="https://www.certik.org/projects/sixnetwork" target="_blank" rel="noreferrer">
                <img src={certik} width="120" alt="" />
              </a>
              <a
                href="https://github.com/thesixnetwork/definix-audit/tree/main/Techrate"
                target="_blank"
                rel="noreferrer"
              >
                <img src={techRate} width="100" alt="" />
              </a>
            </div>
          </div>
        </MaxWidth>
      </Page>
    </>
  )
}

export default Home
