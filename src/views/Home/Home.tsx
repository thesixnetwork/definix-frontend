import Page from 'components/layout/Page'
import React from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading } from 'uikit-dev'
import FinixStats from 'views/Home/components/FinixStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import InfoBanner from 'views/Info/components/InfoBanner'
import Flip from '../../uikit-dev/components/Flip'
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

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Home: React.FC = () => {
  return (
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
          {/* <CardStake large /> */}
          {/* <div className="flex align-center justify-center mt-6">
        <Text small>Audited by</Text>
        <img src={certik} width="120" alt="" />
      </div> */}
        </div>
      </MaxWidth>
    </Page>
  )
}

export default Home
