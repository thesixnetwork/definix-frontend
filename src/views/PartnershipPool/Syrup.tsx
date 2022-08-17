import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/FlexLayout'
import { BLOCKS_PER_YEAR } from 'config'
import Apollo from 'config/abi/Apollo.json'
import erc20 from 'config/abi/erc20.json'
import PairAbi from 'config/abi/uni_v2_lp.json'
import { VeloPool } from 'config/constants'
import AddressTokens from 'config/constants/contracts'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
// import { useFarms, usePools, usePriceBnbBusd, usePriceEthBnb, usePriceSixUsd } from 'state/hooks'
import styled from 'styled-components'
import PageTitle from 'uikitV2/components/PageTitle'
import poolImg from 'uikitV2/images/pool.png'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { getContract } from 'utils/web3'
import { IS_GENESIS } from '../../config'
import Flip from '../../uikit-dev/components/Flip'
import PoolCard from './components/PoolCard/PoolCard'
import { PoolWithApy } from './components/PoolCard/types'
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
  const block = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)
  const [liveOnly, setLiveOnly] = useState(true)
  const [isPhrase1, setIsPhrase1] = useState(false)
  const [listView, setListView] = useState(true)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()

  const [poolVelo1, setPoolVelo1] = useState<PoolWithApy>({
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
    stakingTokenAddress: VeloPool[0].stakingTokenAddress,
    contractAddress: VeloPool[0].contractAddress,
    poolCategory: PoolCategory.PARTHNER,
    projectLink: '',
    tokenPerBlock: '10',
    sortOrder: 1,
    harvest: true,
    isFinished: false,
    tokenDecimals: VeloPool[0].tokenDecimals,
    pairPrice: new BigNumber(0),
  })

  const [poolVelo2, setPoolVelo2] = useState<PoolWithApy>({
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
    stakingTokenAddress: VeloPool[2].stakingTokenAddress,
    contractAddress: VeloPool[2].contractAddress,
    poolCategory: PoolCategory.PARTHNER,
    projectLink: '',
    tokenPerBlock: '10',
    sortOrder: 1,
    harvest: true,
    isFinished: false,
    tokenDecimals: VeloPool[2].tokenDecimals,
    pairPrice: new BigNumber(0),
  })

  const [amountVfinix1, setAmountVfinix1x] = useState<number>(0)
  const [amountVfinix2, setAmountVfinix2x] = useState<number>(0)
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

  const fetch2 = useCallback(async () => {
    // const pairContract = getContract(PairAbi, getAddress(AddressTokens.veloFinixLP))

    // const apolloAddress = '0xd8E92beadEe1fF2Ba550458cd0c30B9D139F3E0f' // getAddress("poolVelo.contractAddress")
    // const finixAddress = getAddress(AddressTokens.finix) // '0x8B8647cD820966293FCAd8d0faDf6877b39F2C46'

    // const contractApollo = getContract(Apollo.abi, apolloAddress)
    // const contractFinix = getContract(erc20, finixAddress)
    // const [totalStake, reserveFinixVelo] = await Promise.all([
    //   contractFinix.methods.balanceOf(apolloAddress).call(),
    //   pairContract.methods.getReserves().call(),
    // ])
    const pairContract = getContract(PairAbi, getAddress(AddressTokens.velo2FinixLP))
    const veloAddress = getAddress(AddressTokens.velo2)
    const apolloAddress = getAddress(poolVelo2.contractAddress) // getAddress("poolVelo.contractAddress")
    const finixAddress = getAddress(AddressTokens.finix) // '0x8B8647cD820966293FCAd8d0faDf6877b39F2C46'
    // 0xd8E92beadEe1fF2Ba550458cd0c30B9D139F3E0f
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

      poolVelo2.userData.allowance = allowance
      poolVelo2.userData.stakedBalance = userInfo.amount
      poolVelo2.userData.pendingReward = new BigNumber(pendingReward).div(1e13)
      // poolVelo.estimatePrice = new BigNumber()
      poolVelo2.userData.stakingTokenBalance = new BigNumber(balanceFinixUser)
      // poolVelo.stakingLimit = new BigNumber(balanceFinixUser)
    }

    poolVelo2.totalStaked = new BigNumber(totalStake)

    const VELO_BLOCK_PER_YEAR = new BigNumber(rewardPerBlock).times(BLOCKS_PER_YEAR).div(1e18).toNumber()

    const veloBalanceReward = new BigNumber(veloBalance).div(1e18).toNumber()
    const finixPervelo = new BigNumber(new BigNumber(reserveFinixVelo._reserve0).div(1e18)).dividedBy(
      new BigNumber(reserveFinixVelo._reserve1).div(1e18),
    )
    poolVelo2.pairPrice = new BigNumber(finixPervelo)
    // const x = finixPervelo.toFixed(3)
    // eslint-disable-next-line
    // debugger
    poolVelo2.apy = new BigNumber(new BigNumber(finixPervelo).times(VELO_BLOCK_PER_YEAR))
      .div(new BigNumber(totalStake).div(1e18))
      .times(100)
    // eslint-disable-next-line
    // debugger
    setPoolVelo2(poolVelo2)
    setAmountVfinix2x(veloBalanceReward)
    // console.log("amountVfinix2)
  }, [account, poolVelo2])

  const fetch1 = useCallback(async () => {
    const pairContract = getContract(PairAbi, getAddress(AddressTokens.veloFinixLP))
    const veloAddress = getAddress(AddressTokens.velo)
    // console.log("poolVelo1.contractAddress",poolVelo1.contractAddress)
    const apolloAddress = getAddress(poolVelo1.contractAddress) // getAddress("poolVelo.contractAddress")
    const finixAddress = getAddress(AddressTokens.finix) // '0x8B8647cD820966293FCAd8d0faDf6877b39F2C46'
    // 0xd8E92beadEe1fF2Ba550458cd0c30B9D139F3E0f
    const contractApollo = getContract(Apollo.abi, apolloAddress)
    const contractFinix = getContract(erc20, finixAddress)
    const contractVelo = getContract(erc20, veloAddress)
    const [veloBalance, totalStake, rewardPerBlock, reserveFinixVelo] = await Promise.all([
      contractVelo.methods.balanceOf(apolloAddress).call(),
      contractFinix.methods.balanceOf(apolloAddress).call(),
      contractApollo.methods.rewardPerBlock().call(),
      pairContract.methods.getReserves().call(),
    ])
    // console.log('fetch1')
    // const veloBalance = await contractVelo.methods.balanceOf(apolloAddress).call();
    // // console.log("1z",veloBalance)
    // const totalStake = await contractFinix.methods.balanceOf(apolloAddress).call()
    // // console.log("2z",totalStake)
    // const rewardPerBlock = await contractApollo.methods.rewardPerBlock().call()
    // // console.log("3z",rewardPerBlock)
    // const reserveFinixVelo = await pairContract.methods.getReserves().call()
    // // console.log("4z",reserveFinixVelo)
    if (account) {
      const [userInfo, allowance, pendingReward, balanceFinixUser] = await Promise.all([
        contractApollo.methods.userInfo(account).call(),
        contractFinix.methods.allowance(account, apolloAddress).call(),
        contractApollo.methods.pendingReward(account).call(),
        contractFinix.methods.balanceOf(account).call(),
      ])

      poolVelo1.userData.allowance = allowance
      poolVelo1.userData.stakedBalance = userInfo.amount
      poolVelo1.userData.pendingReward = pendingReward
      // poolVelo.estimatePrice = new BigNumber()
      poolVelo1.userData.stakingTokenBalance = new BigNumber(balanceFinixUser)
      // poolVelo.stakingLimit = new BigNumber(balanceFinixUser)
    }
    const veloBalanceReward = new BigNumber(veloBalance).div(1e5).toNumber()
    poolVelo1.totalStaked = new BigNumber(totalStake)

    const VELO_BLOCK_PER_YEAR = new BigNumber(rewardPerBlock).times(BLOCKS_PER_YEAR).div(1e5).toNumber()
    const finixPervelo = new BigNumber(new BigNumber(reserveFinixVelo._reserve0).div(1e18)).dividedBy(
      new BigNumber(reserveFinixVelo._reserve1).div(1e5),
    )
    poolVelo1.pairPrice = new BigNumber(finixPervelo)
    // const x = finixPervelo.toFixed(3)
    // eslint-disable-next-line
    // debugger
    poolVelo1.apy = new BigNumber(new BigNumber(finixPervelo).times(VELO_BLOCK_PER_YEAR))
      .div(new BigNumber(totalStake).div(1e18))
      .times(100)
    // eslint-disable-next-line
    // debugger
    setPoolVelo1(poolVelo1)
    setAmountVfinix1x(veloBalanceReward)
  }, [account, poolVelo1])

  const pools = []
  const poolsWithApy = pools.map((pool) => {
    // const userInfo = await contractApollo.methods.userInfo(account).call()

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api

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
    setInterval(() => {
      fetch1()
      fetch2()
    }, 7000)

    return () => {
      setListView(true)
      setModalNode(undefined)
      setIsOpenModal(false)
      // inertvalFetch
    }
  }, [fetch1, fetch2, account])

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
        title="Partnership Pool"
        caption="The Partnership Pool is a place you can stake your single tokens in order to generate high returns in the form of external partner assets. The amount of returns will be calculated by the annual percentage rate (APR)."
        img={poolImg}
      />

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
              <div>
                <PoolCard
                  key={poolVelo2.sousId}
                  pool={poolVelo2}
                  isHorizontal={listView}
                  veloAmount={amountVfinix2}
                  account={account}
                  veloId={2}
                />
                <PoolCard
                  key={poolVelo1.sousId}
                  pool={poolVelo1}
                  isHorizontal={listView}
                  veloAmount={amountVfinix1}
                  account={account}
                  veloId={1}
                />
              </div>
            </Route>
            {/* <Route path={`${path}/history`}>
                    {orderBy(finishedPools, ['sortOrder']).map((pool) => (
                      <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
                    ))}
                  </Route> */}
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
