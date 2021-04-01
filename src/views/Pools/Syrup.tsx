import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import Page from 'components/layout/Page'
import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import useI18n from 'hooks/useI18n'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import React, { useState, useEffect } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useFarms, usePools, usePriceBnbBusd, usePriceEthBnb } from 'state/hooks'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import PoolCardGenesis from './components/PoolCardGenesis'
import PoolCard from './components/PoolCard'
import { IS_GENESIS } from '../../config'
import Flip from '../../uikit-dev/components/Flip'

// import { Heading } from 'uikit-dev'
// import PoolCard from './components/PoolCard'
// import PoolTabButtons from './components/PoolTabButtons'

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWallet()
  const farms = useFarms()
  const pools = usePools(account)
  const bnbPriceUSD = usePriceBnbBusd()
  const ethPriceBnb = usePriceEthBnb()
  const block = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  const [isPhrase1, setIsPhrase1] = useState(false)
  const phrase1TimeStamp = process.env.REACT_APP_PHRASE_1_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_1_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()
  useEffect(() => {
    if (currentTime < phrase1TimeStamp) {
      setTimeout(() => {
        setIsPhrase1(true)
      }, phrase1TimeStamp - currentTime)
    } else {
      setIsPhrase1(true)
    }
  }, [currentTime, phrase1TimeStamp])

  const priceToBnb = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceBN = new BigNumber(tokenPrice)
    if (tokenName === 'BNB') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.BUSD) {
      return tokenPriceBN.div(bnbPriceUSD)
    }
    return tokenPriceBN
  }

  const poolsWithApy = pools.map((pool) => {
    const isBnbPool = pool.poolCategory === PoolCategory.BINANCE
    const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    const stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api
    const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'ETH' ? ethPriceBnb : 1

    // /!\ Assume that the farm quote price is BNB
    const stakingTokenPriceInBNB = isBnbPool
      ? new BigNumber(1)
      : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote).times(tempMultiplier)
    const rewardTokenPriceInBNB = priceToBnb(
      pool.tokenName,
      rewardTokenFarm?.tokenPriceVsQuote,
      rewardTokenFarm?.quoteTokenSymbol,
    )

    const totalRewardPricePerYear = rewardTokenPriceInBNB.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInBNB.times(getBalanceNumber(pool.totalStaked))
    const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)

    return {
      ...pool,
      isFinished: pool.sousId === 0 ? false : pool.isFinished || block > pool.endBlock,
      apy,
    }
  })

  const [finishedPools, openPools] = partition(poolsWithApy, (pool) => pool.isFinished)
  const stackedOnlyPools = openPools.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )

  const filterStackedOnlyPools = (poolsForFilter) =>
    poolsForFilter.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))

  return (
    <Page>
      {/* <Heading as="h1" fontSize="32px !important" className="mt-2 mb-4" textAlign="center">
        Pool
      </Heading>

      <PoolTabButtons
        poolsCount={pools.length}
        stackedOnly={stackedOnly}
        setStackedOnly={setStackedOnly}
        liveOnly={liveOnly}
        setLiveOnly={setLiveOnly}
      /> */}
      <TimerWrapper isPhrase1={!(currentTime < phrase1TimeStamp && isPhrase1 === false)} date={phrase1TimeStamp}>
        {IS_GENESIS ? (
          <div>
            <Route exact path={`${path}`}>
              <>
                {poolsWithApy.map((pool) => (
                  <PoolCardGenesis key={pool.sousId} pool={pool} />
                ))}
                {/* <Coming /> */}
              </>
            </Route>
          </div>
        ) : (
          <div>
            <Route exact path={`${path}`}>
              {liveOnly
                ? orderBy(stackedOnly ? filterStackedOnlyPools(openPools) : openPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} />
                  ))
                : orderBy(stackedOnly ? filterStackedOnlyPools(finishedPools) : finishedPools, [
                    'sortOrder',
                  ]).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
            </Route>
            <Route path={`${path}/history`}>
              {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                <PoolCard key={pool.sousId} pool={pool} />
              ))}
            </Route>
          </div>
        )}
      </TimerWrapper>
    </Page>
  )
}

const TimerWrapper = ({ isPhrase1, date, children }) => {
  return isPhrase1 ? (
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
      {children}
    </>
  )
}

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
    margin: 0;
    max-width: none;
  }
`

export default Farm
