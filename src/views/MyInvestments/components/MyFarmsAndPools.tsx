import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import _ from 'lodash'
import React, { useMemo, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import useBlock from 'hooks/useBlock'
import useRefresh from 'hooks/useRefresh'
import useFarmsList from 'hooks/useFarmsList'
import usePoolsList from 'hooks/usePoolsList'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { getTokenSymbol } from 'utils/getTokenSymbol'

import { fetchFarmUserDataAsync } from 'state/actions'
import {
  useBalances,
  useRebalances,
  useRebalanceBalances,
  useFarms,
  usePools,
  usePriceFinixUsd,
  usePriceKethKlay,
  usePriceKethKusdt,
  usePriceKlayKusdt,
  usePriceSixUsd,
} from 'state/hooks'
import styled from 'styled-components'
import { Card, ChevronRightIcon, IconButton, Text } from 'uikit-dev'
import { provider } from 'web3-core'
import FarmCard from 'views/NewFarms/components/FarmCard/FarmCard'
import { fetchBalances, fetchRebalanceBalances } from '../../../state/wallet'
import { FarmWithStakedValue } from '../../Farms/components/FarmCard/types'
import PoolCard from '../../Pools/components/PoolCard/PoolCard'

const FarmsAndPools = styled(Card)`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .icon {
    padding-right: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &:last-child {
    border: none;
  }
`

const Rebalancing = styled.div`
  padding: 16px;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .asset {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    img {
      width: 14px;
      height: 14px;
      margin: 1px;
    }
  }
`

const Summary = styled.div`
  padding: 12px 0;
  width: 60%;
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
    padding: 4px;
  }
`

const List = styled.div`
  overflow: auto;
  max-height: 530px;

  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 100%;
    overflow: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: 100%;
    overflow: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    overflow: auto;
  }
`

const MyFarmsAndPools = () => {
  const finixPrice = usePriceFinixUsd()
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const balances = useBalances(account)
  const farms = useFarms()
  const farmsWithApy = useFarmsList(farms)
  const stakedFarms = useMemo(() => {
    return farmsWithApy.reduce((result, farm) => {
      let arr = result
      if (farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)) {
        arr = [
          ...result,
          {
            type: 'farm',
            data: farm,
          },
        ]
      }
      return arr
    }, [])
  }, [farmsWithApy])
  const pools = usePools(account)
  const poolsWithApy = usePoolsList({ farms, pools })
  // const stakedPools = useMemo(() => {
  //   return poolsWithApy.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))
  // }, [poolsWithApy])
  const stakedPools = useMemo(() => {
    return poolsWithApy.reduce((result, pool) => {
      let arr = result
      if (pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)) {
        arr = [
          ...result,
          {
            type: 'pool',
            data: pool,
          },
        ]
      }
      return arr
    }, [])
  }, [poolsWithApy])

  const stakedProducts = useMemo(() => {
    return [...stakedFarms, ...stakedPools]
  }, [stakedFarms, stakedPools])

  const getMyFarmBalancesInWallet = useCallback(
    (tokens: string[]) => {
      return tokens.reduce((result, token) => {
        const obj = {}
        const realTokenAddress = getAddress(token)
        obj[getTokenSymbol(realTokenAddress)] = balances ? _.get(balances, realTokenAddress) : null
        return { ...result, ...obj }
      }, {})
    },
    [balances],
  )

  const getMyPoolBalanceInWallet = useCallback(
    (tokenName: string, tokenAddress: string) => {
      if (balances) {
        const address = tokenName === 'WKLAY' ? 'main' : tokenAddress
        return _.get(balances, address)
      }
      return null
    },
    [balances],
  )

  const rebalances = useRebalances()
  const rebalanceBalances = useRebalanceBalances(account) || {}
  const stakedRebalances = rebalances.filter(
    (r) =>
      (
        rebalanceBalances[typeof r.address === 'string' ? r.address : getAddress(r.address)] || new BigNumber(0)
      ).toNumber() > 0,
  )

  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    if (account) {
      const addressObject = {}
      rebalances.forEach((rebalance) => {
        const assets = rebalance.ratio
        assets.forEach((a) => {
          addressObject[getAddress(a.address)] = true
        })
      })
      dispatch(
        fetchBalances(account, [
          ...Object.keys(addressObject),
          ...rebalances.map((rebalance) => getAddress(rebalance.address)),
        ]),
      )
      dispatch(fetchRebalanceBalances(account, rebalances))
    }
  }, [dispatch, account, rebalances])

  return (
    <>
      {!!stakedProducts.length &&
        stakedProducts.map((product) => {
          if (product.type === 'farm') {
            return (
              <FarmCard
                key={product.data.pid}
                farm={product.data}
                myBalancesInWallet={getMyFarmBalancesInWallet([product.data.firstToken, product.data.secondToken])}
                removed={false}
                klaytn={klaytn}
                account={account}
              />
            )
          }
          if (product.type === 'pool') {
            return (
              <PoolCard
                key={product.data.sousId}
                pool={product.data}
                myBalanceInWallet={getMyPoolBalanceInWallet(product.data.tokenName, product.data.stakingTokenAddress)}
              />
            )
          }
          return null
        })}
      {/* <List>
        <>
          {stakedRebalances.map((r) => {
            const thisBalance = r.enableAutoCompound ? rebalanceBalances : balances
            const currentBalance = _.get(thisBalance, getAddress(r.address), new BigNumber(0))
            const currentBalanceNumber = currentBalance.toNumber()
            return (
              <FarmsAndPools className="mb-3">
                <Rebalancing>
                  <div>
                    <img src={r.icon[0]} alt="" />
                    <div className="asset">
                      {r.ratio
                        .filter((rt) => rt.value)
                        .map((t) => {
                          return <img src={`/images/coins/${t.symbol}.png`} alt="" />
                        })}
                    </div>
                  </div>

                  <Text bold textTransform="uppercase" style={{ fontSize: '10px' }}>
                    {r.title}
                  </Text>
                </Rebalancing>
                <Summary className="flex">
                  <div className="col-4">
                    <Text fontSize="12px" color="textSubtle">
                      APR
                    </Text>
                    <Text bold color="success">
                      {numeral(
                        finixPrice
                          .times(_.get(r, 'finixRewardPerYear', new BigNumber(0)))
                          .div(_.get(r, 'totalAssetValue', new BigNumber(0)))
                          .times(100)
                          .toFixed(2),
                      ).format('0,0.[00]')}
                      %
                    </Text>
                  </div>
                  <div className="col-8">
                    <Text fontSize="12px" color="textSubtle">
                      Current Investment
                    </Text>
                    <div className="flex align-baseline flex-wrap">
                      <Text bold>{`$${numeral(
                        currentBalanceNumber * (r.sharedPrice || new BigNumber(0)).toNumber(),
                      ).format('0,0.[00]')}`}</Text>
                      <Text className="ml-1" fontSize="11px">
                        {`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
                      </Text>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="flex align-baseline">
                      <Text fontSize="12px" color="textSubtle">
                        Share price
                      </Text>
                      <Text className="ml-1" fontSize="11px" color="textSubtle">
                        (Since inception)
                      </Text>
                    </div>
                    <div className="flex align-baseline">
                      <Text bold>{`$${numeral((r.sharedPrice || new BigNumber(0)).toNumber()).format('0,0.00')}`}</Text>
                      <Text
                        className="ml-1"
                        fontSize="11px"
                        bold
                        color={(() => {
                          if (r.sharedPricePercentDiff < 0) return 'failure'
                          if (r.sharedPricePercentDiff > 0) return 'success'
                          return ''
                        })()}
                      >
                        {`${
                          r.sharedPricePercentDiff >= 0
                            ? `+${numeral(r.sharedPricePercentDiff).format('0,0.[00]')}`
                            : `${numeral(r.sharedPricePercentDiff).format('0,0.[00]')}`
                        }%`}
                      </Text>
                    </div>
                  </div>
                </Summary>
                <IconButton size="sm" as={Link} to="/farm" className="flex flex-shrink">
                  <ChevronRightIcon color="textDisabled" width="28" />
                </IconButton>
              </FarmsAndPools>
            )
          })}

          {stackedOnlyPools.map((pool) => (
            <PoolCard key={pool.sousId} pool={pool} isHorizontal={listView} />
          ))}
        </>

        {farmsList(stackedOnlyFarms, false)}
      </List> */}
    </>
  )
}

export default MyFarmsAndPools
