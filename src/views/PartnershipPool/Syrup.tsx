import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/FlexLayout'
import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken, Address } from 'config/constants/types'

import useBlock from 'hooks/useBlock'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { getContract } from 'utils/web3'
import Apollo from 'config/abi/Apollo.json'
import PairAbi from 'config/abi/uni_v2_lp.json'
import erc20 from 'config/abi/erc20.json'
// import { useFarms, usePools, usePriceBnbBusd, usePriceEthBnb, usePriceSixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Heading, Text, Link } from 'uikit-dev'
import { VeloPool } from 'config/constants'
import { getAddress } from 'utils/addressHelpers'
import AddressTokens from 'config/constants/contracts'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { getBalanceNumber } from 'utils/formatBalance'
import { IS_GENESIS } from '../../config'
import Flip from '../../uikit-dev/components/Flip'
import PoolCard from './components/PoolCard/PoolCard'
import PoolCardGenesis from './components/PoolCardGenesis'
import PoolTabButtons from './components/PoolTabButtons'
import PoolContext from './PoolContext'
import { PoolWithApy } from './components/PoolCard/types'

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

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWallet()
  const block = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  const [isPhrase1, setIsPhrase1] = useState(false)
  const [listView, setListView] = useState(true)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()

  const [poolVelo, setPoolVelo] = useState<PoolWithApy>({
    apy: new BigNumber(0),
    rewardPerBlock: 10,
    estimatePrice: new BigNumber(0),
    totalStaked: new BigNumber(0),
    startBlock: 12664423,
    endBlock: 14392426,
    userData: {
      allowance: new BigNumber(0),
      stakingTokenBalance: new BigNumber(0),
      stakedBalance: new BigNumber(0),
      pendingReward: new BigNumber(0),
    },
    sousId: 0,
    image: '',
    tokenName: 'VELO',
    stakingTokenName: QuoteToken.VELO,
    stakingLimit: 0,
    stakingTokenAddress: VeloPool.stakingTokenAddress,
    contractAddress: VeloPool.contractAddress,
    poolCategory: PoolCategory.PARTHNER,
    projectLink: '',
    tokenPerBlock: '10',
    sortOrder: 1,
    harvest: true,
    isFinished: false,
    tokenDecimals: 18,
    pairPrice: new BigNumber(0),
  })

  const [amountVfinix, setAmountVfinix] = useState<number>(0)
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
      return tokenPriceBN.div(1)
    }
    return tokenPriceBN
  }

  const fetch = useCallback(async () => {
    const pairContract = getContract(PairAbi, getAddress(AddressTokens.veloFinixLP))
    const veloAddress = getAddress(AddressTokens.velo)
    const apolloAddress = '0xd8E92beadEe1fF2Ba550458cd0c30B9D139F3E0f' // getAddress("poolVelo.contractAddress")
    const finixAddress = getAddress(AddressTokens.finix) // '0x8B8647cD820966293FCAd8d0faDf6877b39F2C46'

    const contractApollo = getContract(Apollo.abi, apolloAddress)
    const contractFinix = getContract(erc20, finixAddress)
    const contractVelo = getContract(erc20, veloAddress)
    const [veloBalance, totalStake, rewardPerBlock, reserveFinixVelo] = await Promise.all([
      contractVelo.methods.balanceOf(apolloAddress).call(),
      contractFinix.methods.balanceOf(apolloAddress).call(),
      contractApollo.methods.rewardPerBlock().call(),
      pairContract.methods.getReserves().call(),
    ])
    if (account) {
      const [userInfo, allowance, pendingReward, balanceFinixUser] = await Promise.all([
        contractApollo.methods.userInfo(account).call(),
        contractFinix.methods.allowance(account, apolloAddress).call(),
        contractApollo.methods.pendingReward(account).call(),
        contractFinix.methods.balanceOf(account).call(),
      ])

      poolVelo.userData.allowance = allowance
      poolVelo.userData.stakedBalance = userInfo.amount
      poolVelo.userData.pendingReward = pendingReward
      // poolVelo.estimatePrice = new BigNumber()
      poolVelo.userData.stakingTokenBalance = new BigNumber(balanceFinixUser)
      // poolVelo.stakingLimit = new BigNumber(balanceFinixUser)
    }
    const veloBalanceReward = new BigNumber(veloBalance).div(1e5).toNumber()
    poolVelo.totalStaked = new BigNumber(totalStake)
    const VELO_BLOCK_PER_YEAR = new BigNumber(rewardPerBlock).times(BLOCKS_PER_YEAR)

    const finixPervelo = new BigNumber(new BigNumber(reserveFinixVelo._reserve0).div(1e18)).dividedBy(
      new BigNumber(reserveFinixVelo._reserve1).div(1e5),
    )
    poolVelo.pairPrice = new BigNumber(finixPervelo)
    // const x = finixPervelo.toFixed(3)
    // eslint-disable-next-line
    // debugger
    poolVelo.apy = new BigNumber(new BigNumber(finixPervelo).times(VELO_BLOCK_PER_YEAR)).div(totalStake).times(100)
    // eslint-disable-next-line
    debugger
    setPoolVelo(poolVelo)
    setAmountVfinix(veloBalanceReward)
  }, [account, poolVelo])

  const pools = []
  const poolsWithApy = pools.map((pool) => {
    // const userInfo = await contractApollo.methods.userInfo(account).call()

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api
    const tempMultiplier = 1

    // /!\ Assume that the farm quote price is BNB
    const stakingTokenPriceInBNB = new BigNumber(1)
    // : new BigNumber(1).times(tempMultiplier)
    const rewardTokenPriceInBNB = priceToBnb(pool.tokenName, new BigNumber(1), QuoteToken.VELO)

    const totalRewardPricePerYear = rewardTokenPriceInBNB.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInBNB.times(getBalanceNumber(new BigNumber(1)))
    const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    const totalLP = new BigNumber(1100000000000000000000).div(new BigNumber(10).pow(18))
    const highestToken = 1
    // if (stakingTokenFarm.tokenSymbol === QuoteToken.SIX) {
    //   highestToken = stakingTokenFarm.tokenAmount
    // } else if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.VELO) {
    //   highestToken = stakingTokenFarm.quoteTokenAmount
    // } else if (stakingTokenFarm.tokenAmount > stakingTokenFarm.quoteTokenAmount) {
    //   highestToken = stakingTokenFarm.tokenAmount
    // } else {
    //   highestToken = stakingTokenFarm.quoteTokenAmount
    // }
    const tokenPerLp = new BigNumber(totalLP).div(new BigNumber(highestToken))
    const priceUsdTemp = tokenPerLp.times(2).times(new BigNumber(1))
    const estimatePrice = priceUsdTemp.times(new BigNumber(1100000000000000000000).div(new BigNumber(10).pow(18)))

    switch (pool.sousId) {
      case 0: {
        // const totalRewardPerBlock = new BigNumber(4000000000000000).times(1).div(new BigNumber(10).pow(18))
        // const finixRewardPerBlock = totalRewardPerBlock.times(1)
        // const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        // const currentTotalStaked = getBalanceNumber(new BigNumber(1100000000000000000000))
        // apy = finixRewardPerYear.div(currentTotalStaked).times(100)
        break
      }
      default:
        break
    }
    return {
      ...pool,
      isFinished: pool.sousId === 0 ? false : pool.isFinished || block > 14563535,
      apy,
      estimatePrice,
    }
  })

  const handlePresent = useCallback((node: React.ReactNode) => {
    console.log('present')
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
    setInterval(fetch, 7000)

    return () => {
      setListView(true)
      setModalNode(undefined)
      setIsOpenModal(false)
      // inertvalFetch
    }
  }, [fetch, account])

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
      <TwoPanelLayout style={{ display: isOpenModal ? 'none' : 'block' }}>
        <LeftPanel isShowRightPanel={false}>
          <MaxWidth>
            <div className="mb-5">
              <div className="flex align-center mb-2">
                <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                  Partnership Pool
                </Heading>
                <div className="mt-2 flex align-center justify-center">
                  {/* <Text paddingRight="1">I’m new to this,</Text> */}
                  {/* <TutorailsLink
                    href="https://sixnetwork.gitbook.io/definix/syrup-pools/how-to-stake-to-definix-pool"
                    target="_blank"
                  >
                    How to stake.
                  </TutorailsLink> */}
                </div>
                {/* <HelpButton size="sm" variant="secondary" className="px-2" startIcon={<HelpCircle className="mr-2" />}>
                  Help
                </HelpButton> */}
              </div>
              <Text>
                The Partnership Pool is a place you can stake your single tokens in order to generate high returns in
                the form of external partner assets.
                <br />
                The amount of returns will be calculated by the annual percentage rate (APR).
              </Text>
            </div>

            <PoolTabButtons
              stackedOnly={stackedOnly}
              setStackedOnly={setStackedOnly}
              liveOnly={liveOnly}
              setLiveOnly={setLiveOnly}
              listView={listView}
              setListView={setListView}
            />

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
                    <PoolCard
                      key={poolVelo.sousId}
                      pool={poolVelo}
                      isHorizontal={listView}
                      veloAmount={amountVfinix}
                      account={account}
                    />
                    ,
                  </Route>
                  {/* <Route path={`${path}/history`}>
                    {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                      <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
                    ))}
                  </Route> */}
                </FlexLayout>
              )}
            </TimerWrapper>
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout>

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
