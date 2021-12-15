import _ from 'lodash'
import { provider } from 'web3-core'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getAddress } from 'utils/addressHelpers'
import { getTokenSymbol } from 'utils/getTokenSymbol'
import { useBalances } from 'state/hooks'
import { Divider, Box, DropdownOption } from 'definixswap-uikit-v2'
import NoResultArea from 'components/NoResultArea'
import FarmCard from 'views/NewFarms/components/FarmCard/FarmCard'
import PoolCard from 'views/Pools/components/PoolCard/PoolCard'
import ExploreCard from 'views/Explore/components/ExploreCard'
import LongTermStakeCard from 'views/LongTermStake_v2/components/LongTermStakeCard/LongTermStakeCard'

interface Product {
  type: string
  data: any
}
const MyProducts: React.FC<{
  products: Product[]
  productType: string
  orderBy: DropdownOption
  searchKeyword: string
}> = ({ products, productType, orderBy, searchKeyword }) => {
  const { t } = useTranslation()
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const balances = useBalances(account)

  const getTokenName = useCallback((product) => {
    let tokenName = ''
    if (_.get(product, 'title')) {
      // rebalancing
      tokenName = _.get(product, 'title')
    } else if (_.get(product, 'lpSymbol')) {
      // farm
      tokenName = _.get(product, 'lpSymbol').replace(/ LP$/, '')
    } else if (_.get(product, 'tokenName')) {
      // pool
      tokenName = _.get(product, 'tokenName')
    }
    return tokenName.toLowerCase()
  }, [])

  const filteredProducts = useMemo(() => {
    if (productType === '' || productType === 'all') return products
    return products.filter((product) => product.type.toLowerCase() === productType)
  }, [products, productType])

  const orderedProducts = useMemo(() => {
    if (!orderBy) return filteredProducts
    return _.orderBy(filteredProducts, orderBy.id, orderBy.orderBy)
  }, [filteredProducts, orderBy])

  const displayProducts = useMemo(() => {
    if (!searchKeyword.length) return orderedProducts
    return orderedProducts.filter((product) => {
      return getTokenName(product.data).includes(searchKeyword)
    })
  }, [orderedProducts, getTokenName, searchKeyword])

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
  const getProductComponent = useCallback(
    (product) => {
      const type = product.type.toLowerCase()
      if (type === 'farm') {
        return (
          <FarmCard
            key={product.data.pid}
            componentType="myInvestment"
            farm={product.data}
            myBalancesInWallet={getMyFarmBalancesInWallet([product.data.firstToken, product.data.secondToken])}
            klaytn={klaytn}
            account={account}
          />
        )
      }
      if (type === 'pool') {
        return (
          <PoolCard
            key={product.data.sousId}
            componentType="myInvestment"
            pool={product.data}
            myBalanceInWallet={getMyPoolBalanceInWallet(product.data.tokenName, product.data.stakingTokenAddress)}
          />
        )
      }
      if (type === 'rebalancing') {
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
      if (type === 'longtermstake') {
        return (
          <LongTermStakeCard longTermStake={product.data} />
        )
      }
      return null
    },
    [klaytn, account, getMyFarmBalancesInWallet, getMyPoolBalanceInWallet],
  )

  const getKey = useCallback((product) => {
    if (product.data.pid) {
      return product.data.pid
    }
    if (product.data.sousId) {
      return product.data.sousId
    }
    if (product.data.title) {
      return product.data.title
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
              {index > 0 && <Divider />}
              {getProductComponent(product)}
            </Box>
          )
        })
      ) : (
        <Box mb="S_40">
          <NoResultArea useCardLayout={false} message={t('There are no products deposited')} />
        </Box>
      )}
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

export default MyProducts
