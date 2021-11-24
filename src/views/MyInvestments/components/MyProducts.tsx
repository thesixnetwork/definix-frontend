import _ from 'lodash'
import React, { useCallback } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { getAddress } from 'utils/addressHelpers'
import { getTokenSymbol } from 'utils/getTokenSymbol'
import { useBalances } from 'state/hooks'
import { Card, Divider } from 'definixswap-uikit'
import { provider } from 'web3-core'
import FarmCard from 'views/NewFarms/components/FarmCard/FarmCard'
import PoolCard from '../../Pools/components/PoolCard/PoolCard'
import ExploreCard from '../../Explore/components/ExploreCard'

const MyProducts = ({ products }) => {
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const balances = useBalances(account)

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

  // const { fastRefresh } = useRefresh()
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   if (account) {
  //     dispatch(fetchFarmUserDataAsync(account))
  //   }
  // }, [account, dispatch, fastRefresh])

  // useEffect(() => {
  //   if (account) {
  //     const addressObject = {}
  //     rebalances.forEach((rebalance) => {
  //       const assets = rebalance.ratio
  //       assets.forEach((a) => {
  //         addressObject[getAddress(a.address)] = true
  //       })
  //     })
  //     dispatch(
  //       fetchBalances(account, [
  //         ...Object.keys(addressObject),
  //         ...rebalances.map((rebalance) => getAddress(rebalance.address)),
  //       ]),
  //     )
  //     dispatch(fetchRebalanceBalances(account, rebalances))
  //   }
  // }, [dispatch, account, rebalances])

  const getProductComponent = useCallback(
    (product) => {
      const productType = product.type.toLowerCase()
      if (productType === 'farm') {
        return (
          <FarmCard
            key={product.data.pid}
            componentType="myInvestment"
            farm={product.data}
            myBalancesInWallet={getMyFarmBalancesInWallet([product.data.firstToken, product.data.secondToken])}
            removed={false}
            klaytn={klaytn}
            account={account}
          />
        )
      }
      if (productType === 'pool') {
        return (
          <PoolCard
            key={product.data.sousId}
            componentType="myInvestment"
            pool={product.data}
            myBalanceInWallet={getMyPoolBalanceInWallet(product.data.tokenName, product.data.stakingTokenAddress)}
          />
        )
      }
      if (productType === 'rebalancing') {
        return (
          <ExploreCard
            key={product.data.title}
            componentType="myInvestment"
            isHorizontal
            rebalance={product.data}
            balance={product.data.myRebalanceBalance}
            onClickViewDetail={() => {
              // go to link
            }}
          />
        )
      }
      return null
    },
    [klaytn, account, getMyFarmBalancesInWallet, getMyPoolBalanceInWallet],
  )

  return (
    <Card className="mt-s16">
      {!!products.length &&
        products.map((product, index) => {
          return (
            <>
              {index > 0 && <Divider />}
              {getProductComponent(product)}
            </>
          )
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
    </Card>
  )
}

export default MyProducts