import { get, flatten, orderBy } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { getTokenSymbol } from 'utils/getTokenSymbol'
import { useBalances } from 'state/hooks'
import { Box, DropdownOption } from '@fingerlabs/definixswap-uikit-v2'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { mediaQueries, spacing } from 'uikitV2/base'
import NoData from 'uikitV2/components/NoData'
import { Divider } from '@mui/material'
// import NoResultArea from 'components/NoResultArea'
// import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
// import PoolCard from 'views/Pools/components/PoolCard/PoolCard'
// import ExploreCard from 'views/RebalancingFarms/components/ExploreCard'
// import LongTermStakeCard from 'views/LongTermStake/components/LongTermStakeCard'
// import useWallet from 'hooks/useWallet'

const DividerWrap = styled(Box)`
  padding: 0 ${spacing.S_40}px;
  ${mediaQueries.mobileXl} {
    padding: 0 ${spacing.S_20}px;
  }
`

interface Product {
  productType: string
  productLabel: string
  [key: string]: any
}
const MyProducts: React.FC<{
  products: Product[]
  currentProductType: string
  currentOrderBy: DropdownOption
  searchKeyword: string
}> = ({ products, currentProductType, currentOrderBy, searchKeyword }) => {
  const { account } = useWallet()
  const balances = useBalances(account)

  const getTokenName = useCallback((product) => {
    let tokenName = ''
    if (product.productType === 'farm') {
      tokenName = get(product, 'lpSymbol').replace(/ LP$/, '')
    } else if (product.productType === 'pool') {
      tokenName = get(product, 'tokenName')
    } else {
      tokenName = get(product, 'title')
    }
    return tokenName.toLowerCase()
  }, [])

  const filledProducts = useMemo(() => {
    // { farm: [], pool: [], rebalancing: [], ... }
    const defaultProducts = {
      farm: [],
      pool: [],
      rebalancing: [],
      longtermstake: [],
    }
    products.forEach((product) => {
      defaultProducts[product.type.toLowerCase()].push({
        productType: product.type,
        ...product.data,
      })
    })
    return flatten(Object.values(defaultProducts))
  }, [products])

  const filteredProducts = useMemo(() => {
    if (currentProductType === '' || currentProductType === 'all') return filledProducts
    return filledProducts.filter((product) => product.productType.toLowerCase() === currentProductType)
  }, [filledProducts, currentProductType])

  const orderedProducts = useMemo(() => {
    if (!currentOrderBy) return filteredProducts
    return orderBy(filteredProducts, currentOrderBy.id, currentOrderBy.orderBy)
  }, [filteredProducts, currentOrderBy])

  const displayProducts = useMemo(() => {
    if (!searchKeyword.length) return orderedProducts
    return orderedProducts.filter((product) => {
      return getTokenName(product).includes(searchKeyword)
    })
  }, [orderedProducts, getTokenName, searchKeyword])

  // const getMyFarmBalancesInWallet = useCallback(
  //   (tokens: string[]) => {
  //     return tokens.reduce((result, token) => {
  //       const obj = {}
  //       const realTokenAddress = getAddress(token)
  //       obj[getTokenSymbol(realTokenAddress)] = balances ? get(balances, realTokenAddress) : null
  //       return { ...result, ...obj }
  //     }, {})
  //   },
  //   [balances],
  // )
  // const getMyPoolBalanceInWallet = useCallback(
  //   (tokenName: string, tokenAddress: string) => {
  //     if (balances) {
  //       const address = tokenName === 'WKLAY' ? 'main' : tokenAddress
  //       return get(balances, address)
  //     }
  //     return null
  //   },
  //   [balances],
  // )
  // const getProductComponent = useCallback(
  //   (product) => {
  //     const type = get(product, 'productType').toLowerCase()
  //     if (type === 'farm') {
  //       return (
  //         <FarmCard
  //           key={product.pid}
  //           componentType="myInvestment"
  //           farm={product}
  //           myBalancesInWallet={getMyFarmBalancesInWallet([product.firstToken, product.secondToken])}
  //           klaytn={klaytn}
  //           account={account}
  //         />
  //       )
  //     }
  //     if (type === 'pool') {
  //       return (
  //         <PoolCard
  //           key={product.sousId}
  //           componentType="myInvestment"
  //           pool={product}
  //           myBalanceInWallet={getMyPoolBalanceInWallet(product.tokenName, product.stakingTokenAddress)}
  //         />
  //       )
  //     }
  //     if (type === 'rebalancing') {
  //       return (
  //         <ExploreCard
  //           key={product.title}
  //           componentType="myInvestment"
  //           isHorizontal
  //           rebalance={product}
  //           balance={product.myRebalanceBalance}
  //           onClickViewDetail={() => {
  //             // go to link
  //           }}
  //         />
  //       )
  //     }
  //     if (type === 'longtermstake') {
  //       return <LongTermStakeCard longTermStake={product} />
  //     }
  //     return null
  //   },
  //   [klaytn, account, getMyFarmBalancesInWallet, getMyPoolBalanceInWallet],
  // )

  const getKey = useCallback((product) => {
    if (product.pid) {
      return product.pid
    }
    if (product.sousId) {
      return product.sousId
    }
    if (product.title) {
      return product.title
    }
    return ''
  }, [])

  return (
    <>
      {displayProducts.length ? (
        displayProducts.map((product, index) => {
          return (
            <Box
              key={getKey(product)}
              className={`${index === displayProducts.length - 1 ? `pb-s40` : ''} ${index === 0 ? 'mt-s24' : ''}`}
            >
              {index > 0 && (
                <DividerWrap>
                  <Divider />
                </DividerWrap>
              )}
              {/* {getProductComponent(product)} */}
            </Box>
          )
        })
      ) : (
        <Box style={{ marginBottom: 40 }}>
          <NoData
            // useCardLayout={false}
            text="There are no products deposited"
          />
        </Box>
      )}
      {/* <List>
        <>
          {stakedRebalances.map((r) => {
            const thisBalance = r.enableAutoCompound ? rebalanceBalances : balances
            const currentBalance = get(thisBalance, getAddress(r.address), new BigNumber(0))
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
                          .times(get(r, 'finixRewardPerYear', new BigNumber(0)))
                          .div(get(r, 'totalAssetValue', new BigNumber(0)))
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

export default MyProducts
