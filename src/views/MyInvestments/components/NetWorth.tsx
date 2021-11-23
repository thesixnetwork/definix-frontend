import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'

import {
  useFarmsIsFetched,
  useRebalancesIsFetched,
  useWalletFetched,
  useWalletRebalanceFetched,
  usePoolsIsFetched,
} from 'state/hooks'
// import { Heading, Skeleton, Text } from 'uikit-dev'

import CardValue from './CardValue'
import EarningBoxTemplate from './EarningBoxTemplate'

const StatAll = styled.div`
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.white};

  h2 {
    margin: 4px 0;
  }
`

// const StatSkeleton = () => {
//   return <Skeleton animation="pulse" variant="rect" height="26px" className="my-1" />
// }

const NetWorth: React.FC<{
  isMobile: boolean;
  products: { [key: string]: any[] }
}> = ({ isMobile, products }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  const { account } = useWallet()
  const isPoolFetched = usePoolsIsFetched()
  const isFarmFetched = useFarmsIsFetched()
  const isRebalanceFetched = useRebalancesIsFetched()
  const isRebalanceBalanceFetched = useWalletRebalanceFetched()
  const isBalanceFetched = useWalletFetched()

  // useEffect(() => {
  //   if (isFarmFetched && isPoolFetched && isRebalanceFetched && isRebalanceBalanceFetched && isBalanceFetched) {
  //     setIsLoading(false)
  //   }
  // }, [isPoolFetched, isFarmFetched, isRebalanceFetched, isRebalanceBalanceFetched, isBalanceFetched])

  const netWorthList = useMemo(() => {
    return Object.entries(products).map(([type, product]) => {
      return {
        title: type,
        price: product.reduce((all, f) => all + Number(f.netWorth), 0)
      } 
    })
  }, [products])

  return (
    <>
      <EarningBoxTemplate
        isMobile={isMobile}
        hasAccount={!!account}
        total={{
          title: t('Total Deposit'),
          price: netWorthList.reduce((result, item) => result + item.price, 0),
        }}
        valueList={netWorthList}
      />

      {/* <div className="flex">
        <StatAll>
          <Heading color="textSubtle">Net worth</Heading>
          {isLoading ? (
            <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
          ) : (
            <Heading fontSize="24px !important">
              {(() => {
                const allNetWorth = [...stackedOnlyFarms, ...stackedOnlyPools, ...stakedRebalances].map((f) => {
                  return getNetWorth(f)
                })
                // eslint-disable-next-line
                const totalNetWorth =
                  _.compact(allNetWorth).length > 0
                    ? _.compact(allNetWorth).reduce((fv, sv) => {
                        return fv.plus(sv)
                      })
                    : new BigNumber(0)
                return totalNetWorth && Number(totalNetWorth) !== 0
                  ? `$${Number(totalNetWorth).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : '-'
              })()}
            </Heading>
          )}
        </StatAll>
        <div className="flex">
          <StatAll>
            <Text color="textSubtle">Farm</Text>
            {isFarmFetched ? (
              <>
                <Heading fontSize="24px !important" color="textInvert">
                  <CardValue value={worthFarm} lineHeight="1.5" color="textInvert" prefix="$" bold={false} decimals={2} />
                </Heading>
              </>
            ) : (
              <StatSkeleton />
            )}
          </StatAll>
        </div>
        <div className="flex">
          <StatAll>
            <Text color="textSubtle">Pool</Text>
            {isPoolFetched ? (
              <>
                <Heading fontSize="24px !important" color="textInvert">
                  <CardValue value={worthPool} lineHeight="1.5" color="textInvert" prefix="$" bold={false} decimals={2} />
                </Heading>
              </>
            ) : (
              <StatSkeleton />
            )}
          </StatAll>
        </div>
        <div className="flex">
          <StatAll>
            <Text color="textSubtle">Rebalancing</Text>
            {isRebalanceFetched ? (
              <>
                <Heading fontSize="24px !important" color="textInvert">
                  <CardValue
                    value={worthRebalance}
                    lineHeight="1.5"
                    color="textInvert"
                    prefix="$"
                    bold={false}
                    decimals={2}
                  />
                </Heading>
              </>
            ) : (
              <StatSkeleton />
            )}
          </StatAll>
        </div>
      </div> */}
    </>
  )
}

export default NetWorth
