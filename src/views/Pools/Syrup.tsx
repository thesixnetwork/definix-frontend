import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/FlexLayout'
import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { useFarms, usePools, usePriceBnbBusd, usePriceEthBnb, usePriceFinixUsd, usePriceSixUsd } from 'state/hooks'
import styled from 'styled-components'
import PageTitle from 'uikitV2/components/PageTitle'
import poolImg from 'uikitV2/images/pool.png'
import { getBalanceNumber } from 'utils/formatBalance'
import { IS_GENESIS } from '../../config'
import Flip from '../../uikit-dev/components/Flip'
import PoolCard from './components/PoolCard/PoolCard'
import PoolCardGenesis from './components/PoolCardGenesis'
import PoolTabButtons from './components/PoolTabButtons'
import PoolContext from './PoolContext'

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  background: url(${({ theme }) => theme.colors.backgroundPolygon});
  background-size: cover;
  background-repeat: no-repeat;
`

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWallet()
  const farms = useFarms()
  const pools = usePools(account)
  const sixPriceUSD = usePriceSixUsd()
  const bnbPriceUSD = usePriceBnbBusd()
  const ethPriceBnb = usePriceEthBnb()
  const finixPriceUsd = usePriceFinixUsd()
  const block = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  const [isPhrase1, setIsPhrase1] = useState(false)
  const [listView, setListView] = useState(true)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()

  const phrase1TimeStamp = process.env.REACT_APP_PHRASE_1_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_1_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()

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
    let rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    let stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)
    switch (pool.sousId) {
      case 0:
        stakingTokenFarm = farms.find((s) => s.pid === 0)
        break
      case 2:
        stakingTokenFarm = farms.find((s) => s.pid === 1)
        break
      case 3:
        stakingTokenFarm = farms.find((s) => s.pid === 2)
        break
      case 4:
        stakingTokenFarm = farms.find((s) => s.pid === 3)
        break
      case 5:
        stakingTokenFarm = farms.find((s) => s.pid === 4)
        break
      case 6:
        stakingTokenFarm = farms.find((s) => s.pid === 5)
        break
      case 25:
        stakingTokenFarm = farms.find((s) => s.pid === 25)
        break
      default:
        break
    }
    switch (pool.sousId) {
      case 0:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        rewardTokenFarm = farms.find((f) => f.tokenSymbol === 'SIX')
        break
      default:
        break
    }

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
    let apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    const totalLP = new BigNumber(stakingTokenFarm.lpTotalSupply).div(new BigNumber(10).pow(18))
    let highestToken
    if (stakingTokenFarm.tokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.tokenAmount
    } else if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.quoteTokenAmount
    } else if (stakingTokenFarm.tokenAmount > stakingTokenFarm.quoteTokenAmount) {
      highestToken = stakingTokenFarm.tokenAmount
    } else {
      highestToken = stakingTokenFarm.quoteTokenAmount
    }
    const tokenPerLp = new BigNumber(totalLP).div(new BigNumber(highestToken))
    const priceUsdTemp = tokenPerLp.times(2).times(new BigNumber(sixPriceUSD))
    const estimatePrice = priceUsdTemp.times(new BigNumber(pool.totalStaked).div(new BigNumber(10).pow(18)))

    switch (pool.sousId) {
      case 0: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear.div(currentTotalStaked).times(100)
        break
      }
      case 25: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear
          .times(finixPriceUsd)
          .div(new BigNumber(currentTotalStaked).times(new BigNumber(sixPriceUSD)))
          .times(100)
        break
      }
      case 2:
      case 3:
      case 4:
      case 5:
      case 6: {
        const { startBlock, endBlock, rewardPerBlock, totalStaked } = pool
        const startBlockNumber = typeof startBlock === 'number' ? startBlock : parseInt(startBlock, 10)
        const endBlockNumber = typeof endBlock === 'number' ? endBlock : parseInt(endBlock, 10)
        const currentBlockNumber = typeof block === 'number' ? block : parseInt(block, 10)
        const totalDiffBlock = endBlockNumber - startBlockNumber
        const remainBlock = endBlockNumber - currentBlockNumber
        const remainTimeSec = remainBlock * 3
        const totalDiffBlockCeil =
          totalDiffBlock % 1200 > 1100 ? totalDiffBlock + (1200 - (totalDiffBlock % 1200)) : totalDiffBlock
        const currentDiffBlock = currentBlockNumber - startBlockNumber
        const totalReward = totalDiffBlockCeil * (rewardPerBlock / 10 ** 18)
        const alreadyRewarded = currentDiffBlock * (rewardPerBlock / 10 ** 18)
        const remainReward = totalReward - alreadyRewarded

        const B33 = remainReward
        const B34 = sixPriceUSD

        const E33 = stakingTokenFarm.lpTotalSupply
        const E34 = totalStaked
        const E35 = highestToken

        const F34 = new BigNumber(E34).div(new BigNumber(E33))
        const F35 = new BigNumber(E35).times(F34)

        const B35 = F35.times(new BigNumber(B34)).times(2)
        const B38 = 365 * 24 * 60 * 60

        apy = new BigNumber(B33)
          .times(new BigNumber(B34))
          .div(B35)
          .times(new BigNumber(B38))
          .div(new BigNumber(remainTimeSec))
          .times(100)

        break
      }
      default:
        break
    }
    return {
      ...pool,
      isFinished: pool.sousId === 0 ? false : pool.isFinished || block > pool.endBlock,
      apy,
      estimatePrice,
    }
  })

  const [finishedPools, openPools] = partition(poolsWithApy, (pool) => pool.isFinished)

  const filterStackedOnlyPools = (poolsForFilter) =>
    poolsForFilter.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))

  const handlePresent = useCallback((node: React.ReactNode) => {
    setModalNode(node)
    setIsOpenModal(true)
    window.scrollTo(0, 0)
  }, [])

  const handleDismiss = useCallback(() => {
    setModalNode(undefined)
    setIsOpenModal(false)
  }, [])

  useEffect(() => {
    if (currentTime < phrase1TimeStamp) {
      setTimeout(() => {
        setIsPhrase1(true)
      }, phrase1TimeStamp - currentTime)
    } else {
      setIsPhrase1(true)
    }
  }, [currentTime, phrase1TimeStamp])

  useEffect(() => {
    return () => {
      setListView(true)
      setModalNode(undefined)
      setIsOpenModal(false)
    }
  }, [])

  return (
    <PoolContext.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      <Helmet>
        <title>Pool - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <PageTitle
        title="Pool"
        caption="Deposit a single token to get stable returns with low risk."
        linkLabel="Learn how to stake in Pool"
        link="https://sixnetwork.gitbook.io/definix/syrup-pools/how-to-stake-to-definix-pool"
        img={poolImg}
      >
        <PoolTabButtons
          stackedOnly={stackedOnly}
          setStackedOnly={setStackedOnly}
          liveOnly={liveOnly}
          setLiveOnly={setLiveOnly}
          listView={listView}
          setListView={setListView}
        />
      </PageTitle>

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
          <FlexLayout cols={listView ? 1 : 3}>
            <Route exact path={`${path}`}>
              {liveOnly
                ? orderBy(stackedOnly ? filterStackedOnlyPools(openPools) : openPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
                  ))
                : orderBy(stackedOnly ? filterStackedOnlyPools(finishedPools) : finishedPools, ['sortOrder']).map(
                    (pool) => <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />,
                  )}
            </Route>
            <Route path={`${path}/history`}>
              {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
              ))}
            </Route>
          </FlexLayout>
        )}
      </TimerWrapper>

      {isOpenModal && React.isValidElement(modalNode) && (
        <ModalWrapper>
          {React.cloneElement(modalNode, {
            onDismiss: handleDismiss,
          })}
        </ModalWrapper>
      )}
    </PoolContext.Provider>
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

export default Farm
