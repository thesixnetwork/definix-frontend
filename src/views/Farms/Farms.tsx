import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import { QuoteToken } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { fetchFarmUserDataAsync } from 'state/actions'
import {
  useFarms,
  usePriceBnbBusd,
  usePriceSixBusd,
  usePriceFinixUsd,
  usePriceCakeBusd,
  usePriceEthBusd,
} from 'state/hooks'
import { Heading } from 'uikit-dev'
import { provider } from 'web3-core'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
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
      const cakePriceVsBNB = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock).times(farm.BONUS_MULTIPLIER).div(new BigNumber(10).pow(18))
        const cakeRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        // cakePriceInQuote * cakeRewardPerYear / lpTotalInQuoteToken
        let apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)

        if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
          apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          apy = cakePrice.div(ethPriceUsd).times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
          apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const cakeApy =
            farm && cakePriceVsBNB.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = cakeApy && dualApy && cakeApy.plus(dualApy)
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethPrice={ethPriceUsd}
          sixPrice={sixPrice}
          finixPrice={finixPrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [finixPrice, sixPrice, bnbPrice, ethPriceUsd, cakePrice, ethereum, account],
  )

  return (
    <Page>
      <Heading as="h1" fontSize="32px !important" className="mt-2 mb-4" textAlign="center">
        Farm
      </Heading>
      <FarmTabButtons activeFarmsCount={activeFarms.length} stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} />
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
    </Page>
  )
}

export default Farms
