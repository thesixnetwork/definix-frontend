import certik from 'assets/images/certik.png'
import Page from 'components/layout/Page'
import React from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading, Text } from 'uikit-dev'
import CakeStats from 'views/Home/components/CakeStats'
import CardStake from 'views/Home/components/CardStake'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
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
  margin-bottom: 32px;

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

const Home: React.FC = () => {
  // const TranslateString = useI18n()

  return (
    <Page>
      <Heading as="h1" fontSize="32px !important" className="my-6" textAlign="center">
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
        <Cards>
          <TotalValueLockedCard />
          <CakeStats />
        </Cards>
        <CardStake large />
        <div className="flex align-center justify-center mt-6">
          <Text small>Audited by</Text>
          <img src={certik} width="120" alt="" />
        </div>
      </div>
    </Page>
  )
}

export default Home
