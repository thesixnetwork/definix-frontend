import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { fetchFarmUserDataAsync } from 'state/actions'
import {
  useFarmUnlockDate,
  useFarms,
  usePriceBnbBusd,
  usePriceEthBusd,
  usePriceFinixUsd,
  usePriceSixBusd,
} from 'state/hooks'
import styled from 'styled-components'
import { Card, Heading, Text, Button } from 'uikit-dev'
import man from 'uikit-dev/images/for-Farm-Elements/1558.png'
// import man02 from 'uikit-dev/images/FINIX-Love-You/1557.png'
import bg from 'uikit-dev/images/for-Farm-Elements/bg.jpg'
import bgBlue from 'uikit-dev/images/FINIX-Love-You/bg.png'
import { provider } from 'web3-core'
import Flip from '../../uikit-dev/components/Flip'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmUnlockAt = useFarmUnlockDate()
  const farmsLP = useFarms()
  const bnbPrice = usePriceBnbBusd()
  const sixPrice = usePriceSixBusd()
  const finixPrice = usePriceFinixUsd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const ethPriceUsd = usePriceEthBusd()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stackedOnly, setStackedOnly] = useState(false)
  const [isPhrase2, setIsPhrase2] = useState(false)
  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()
  useEffect(() => {
    if (currentTime < phrase2TimeStamp) {
      setTimeout(() => {
        setIsPhrase2(true)
      }, phrase2TimeStamp - currentTime)
    } else {
      setIsPhrase2(true)
    }
  }, [currentTime, phrase2TimeStamp])

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const finixPriceVsBNB = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
          .times(farm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

        // finixPriceInQuote * finixRewardPerYear / lpTotalInQuoteToken
        let apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)

        if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
          apy = finixPriceVsBNB.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          apy = finixPrice.div(ethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const finixApy =
            farm && finixPriceVsBNB.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = finixApy && dualApy && finixApy.plus(dualApy)
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          ethPrice={ethPriceUsd}
          sixPrice={sixPrice}
          finixPrice={finixPrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [sixPrice, bnbPrice, ethPriceUsd, finixPrice, ethereum, account],
  )

  return (
    <Page>
      <Heading as="h1" fontSize="32px !important" className="mt-2 mb-6" textAlign="center">
        Farm
      </Heading>

      {/* <CardSorry className="mb-6">
        <MaxWidth>
          <img src={man02} alt="" />

          <div>
            <Heading as="h3" fontSize="24px !important" color="#FFF" className="mb-2">
              For maximum yield farming return and best experience, we are upgrading our farm.
            </Heading>
            <Heading as="h3" fontSize="24px !important" color="#FFD157" className="mb-2">
              Our farm will be available in{' '}
              <Flip small date={farmUnlockAt instanceof Date ? farmUnlockAt.getTime() : farmUnlockAt} />
            </Heading>
            <p>You can stake your LP and get six now</p>
          </div>

          <Button as="a" href="/pool" variant="secondary" className="btn-secondary-disable">
            Go to stake
          </Button>
        </MaxWidth>
      </CardSorry> */}

      <Card className="mb-6">
        <WhatIsFarm>
          <MaxWidth>
            <img src={man} alt="" />

            <div>
              <Heading as="h2" fontSize="28px !important" color="#FFF" className="mb-2">
                What is Farm?
              </Heading>
              <p>
                Farm is a place you can stake your LP tokens in order to generate high returns in the form of FINIX. The
                amount of returns will be calculated by the annual percentage rate (APR). The APR of each farm will be
                different and fluctuated due to the size of the pool. You can choose any farm you like to start farming
                now.
              </p>
            </div>
          </MaxWidth>
        </WhatIsFarm>

        <MaxWidth className="py-6 px-6">
          <Heading as="h2" fontSize="28px !important" className="mb-4">
            How to farm in just 1, 2, 3
          </Heading>
          <Heading as="h3" className="mb-1" color="primary">
            1. Choose a farm you like
          </Heading>
          <Text className="mb-3">See the list of the active farms and decide which farm you want to stake.</Text>

          <Heading as="h3" className="mb-1" color="primary">
            2. Add liquidity
          </Heading>
          <Text className="mb-3">
            For example, if you want to stake in FINIX-SIX LP farm, you go to “Liquidity” menu and add your FINIX and
            SIX tokens to liquidity pool. You’ll get FINIX-SIX LP tokens from this step.
          </Text>

          <Heading as="h3" className="mb-1" color="primary">
            3. Start farming
          </Heading>
          <Text className="mb-3">
            Bring your LP tokens that you’ve got from the previous step to stake in the farm and earn much more FINIX as
            a return!
          </Text>

          <Text color="primary">
            Don’t have cryptocurrency for a farm you want to stake ? No worries, you can use swap to exchange for what
            you want.
          </Text>
        </MaxWidth>
      </Card>

      <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
        <FarmTabButtons
          activeFarmsCount={activeFarms.length}
          stackedOnly={stackedOnly}
          setStackedOnly={setStackedOnly}
        />
        <div>
          <FlexLayout>
            <Route exact path={`${path}`}>
              {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsList(activeFarms, false)}
            </Route>
            <Route exact path={`${path}/history`}>
              {farmsList(inactiveFarms, true)}
            </Route>
          </FlexLayout>
        </div>
      </TimerWrapper>
    </Page>
  )
}

const CardSorry = styled(Card)`
  padding: 24px;
  width: 100%;
  background: url(${bgBlue});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > div {
      text-align: center;
    }
  }

  img {
    width: 160px;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.5;
  }

  a {
    flex-shrink: 0;
    margin-top: 1rem;
  }

  strong {
    padding: 8px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-between;

    > div {
      flex-direction: row;

      > div {
        text-align: left;
      }
    }

    img {
      margin: 0;
    }

    a {
      margin: 0 0 0 1rem;
    }

    strong {
      padding: 0;
    }
  }
`

const MaxWidth = styled.div`
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
`

const WhatIsFarm = styled.div`
  padding: 40px 24px;
  width: 100%;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 25% center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 160px;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.5;
  }

  a {
    flex-shrink: 0;
    margin-left: 2rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    background-position: center 40%;

    > div {
      flex-direction: row;
    }

    img {
      margin: 0;
    }
  }
`

const TimerWrapper = ({ isPhrase2, date, children }) => {
  return isPhrase2 ? (
    children
  ) : (
    <>
      <div>
        <br />
        <Flip date={date} />
        <br />
        <br />
        <br />
      </div>
      <div
        tabIndex={0}
        role="button"
        style={{ opacity: 0.4, pointerEvents: 'none' }}
        onClick={(e) => {
          e.preventDefault()
        }}
        onKeyDown={(e) => {
          e.preventDefault()
        }}
      >
        {children}
      </div>
    </>
  )
}
export default Farms
